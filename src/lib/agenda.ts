// Regras de data das encomendas: prazo mínimo, dias e janelas de retirada/entrega, dias fechados.
// Os DADOS ficam em ./encomendas.ts; aqui só a lógica (não precisa mudar para outro cliente).
// Datas trafegam como "AAAA-MM-DD" no fuso do navegador.
import type { Item } from "./cardapio";
import { agenda, type Janela, type Modo, type RegrasEncomenda } from "./encomendas";

export type ItemEnc = Item & { encomenda: RegrasEncomenda };
export const ehEncomenda = (i: Item | undefined): i is ItemEnc => !!i?.encomenda;

// ---------- datas ----------
const dois = (n: number) => String(n).padStart(2, "0");
export const iso = (d: Date) => `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
export const deIso = (s: string) => {
  const [a, m, d] = s.split("-").map(Number);
  return new Date(a, m - 1, d);
};
export const somarDias = (s: string, n: number) => {
  const d = deIso(s);
  d.setDate(d.getDate() + n);
  return iso(d);
};
const comHora = (s: string, hhmm: string) => {
  const d = deIso(s);
  const [h, m] = hhmm.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d;
};

// ---------- textos ----------
const DIAS_CURTOS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const DIAS_PLURAL = ["aos domingos", "às segundas", "às terças", "às quartas", "às quintas", "às sextas", "aos sábados"];

/** "qui, 24/12" */
export const dataCurta = (s: string) => {
  const d = deIso(s);
  return `${DIAS_CURTOS[d.getDay()]}, ${dois(d.getDate())}/${dois(d.getMonth() + 1)}`;
};
/** "qui, 24/12/2026" (mensagem do WhatsApp) */
export const dataComAno = (s: string) => `${dataCurta(s)}/${deIso(s).getFullYear()}`;
/** "quinta-feira, 24 de dezembro" (leitor de tela e confirmação) */
export const dataLonga = (s: string) => deIso(s).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
/** "8h às 11h", "6h30 às 9h" */
const hora = (hhmm: string) => {
  const [h, m] = hhmm.split(":");
  return `${Number(h)}h${m === "00" ? "" : m}`;
};
export const textoJanela = (j: Janela) => `${j.nome} (${hora(j.inicio)} às ${hora(j.fim)})`;
export const horasJanela = (j: Janela) => `${hora(j.inicio)} às ${hora(j.fim)}`;
/** 24 -> "1 dia", 72 -> "3 dias", 36 -> "36 horas" */
export const textoPrazo = (h: number) => (h % 24 === 0 ? `${h / 24} ${h === 24 ? "dia" : "dias"}` : `${h} horas`);
/** [1..6] -> "seg a sáb"; [0..6] -> "todos os dias" */
export function textoDias(dias: number[]) {
  const ord = [...new Set(dias)].sort();
  if (ord.length === 7) return "todos os dias";
  const seguidos = ord.every((d, i) => i === 0 || d === ord[i - 1] + 1);
  if (seguidos && ord.length > 2) return `${DIAS_CURTOS[ord[0]]} a ${DIAS_CURTOS[ord[ord.length - 1]]}`;
  return ord.map((d) => DIAS_CURTOS[d]).join(", ");
}
const lista = (nomes: string[]) => (nomes.length < 2 ? nomes.join("") : `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`);
const nomeModo = (m: Modo) => (m === "retirada" ? "retirada" : "entrega");
const saiNoDia = (i: ItemEnc, modo: Modo, dia: number) => (i.encomenda[modo]?.dias as number[] | undefined)?.includes(dia) ?? false;

// ---------- regras ----------
/** Se o item ainda está na temporada (sem `ultimaData`, sai o ano todo). Usado pela vitrine. */
export const naTemporada = (i: Item, hoje: string) => !i.encomenda?.ultimaData || i.encomenda.ultimaData >= hoje;

/** Itens de encomenda distintos (sem repetir o mesmo produto). */
export const unicos = (itens: ItemEnc[]) => [...new Map(itens.map((i) => [i.id, i])).values()];

/** Maior prazo entre os itens e quem o impõe. */
export function prazoDoPedido(itens: ItemEnc[]) {
  const horas = Math.max(0, ...itens.map((i) => i.encomenda.prazoHoras));
  return { horas, quem: itens.filter((i) => i.encomenda.prazoHoras === horas).map((i) => i.nome) };
}

/** Janelas que servem para TODOS os itens no modo escolhido. */
export const janelasComuns = (itens: ItemEnc[], modo: Modo): Janela[] =>
  agenda.janelas[modo].filter((j) => itens.every((i) => i.encomenda[modo]?.janelas.includes(j.id)));

/** Se o modo (retirada/entrega) é possível para o conjunto de itens e, se não, por quê. */
export function modoPossivel(itens: ItemEnc[], modo: Modo): { ok: boolean; motivo?: string } {
  const sem = itens.filter((i) => !i.encomenda[modo]);
  if (sem.length) return { ok: false, motivo: `${lista(sem.map((i) => i.nome))} não ${sem.length > 1 ? "têm" : "tem"} ${nomeModo(modo)}.` };
  if (itens.length > 1 && !janelasComuns(itens, modo).length)
    return { ok: false, motivo: `Não há janela de ${nomeModo(modo)} que sirva para ${lista(itens.map((i) => i.nome))} juntos. Faça pedidos separados.` };
  const dias = [0, 1, 2, 3, 4, 5, 6].filter((d) => itens.every((i) => saiNoDia(i, modo, d)));
  if (!dias.length) return { ok: false, motivo: `Não há dia de ${nomeModo(modo)} em comum para esses itens. Faça pedidos separados.` };
  return { ok: true };
}

type Avaliacao = { ok: boolean; motivo?: string; janelas: { janela: Janela; ok: boolean }[] };

function checarDia(data: string, itens: ItemEnc[], modo: Modo, agora: Date): Avaliacao & { porPrazo?: boolean } {
  const janelas = janelasComuns(itens, modo);
  const nao = (motivo: string, extra?: { porPrazo?: boolean }) => ({ ok: false, motivo, janelas: janelas.map((janela) => ({ janela, ok: false })), ...extra });
  const hoje = iso(agora);
  if (data < hoje) return nao("Essa data já passou.");
  const ultimoDia = somarDias(hoje, agenda.horizonteDias);
  if (data > ultimoDia) return nao(`A agenda está aberta até ${dataCurta(ultimoDia)}.`);
  const fechado = agenda.fechado.find((f) => f.data === data);
  if (fechado) return nao(fechado.motivo);
  const passou = itens.filter((i) => i.encomenda.ultimaData && data > i.encomenda.ultimaData);
  if (passou.length) {
    const i = passou[0].encomenda;
    return nao(`${lista(passou.map((x) => x.nome))} ${passou.length > 1 ? "saem" : "sai"} só até ${dataCurta(i.ultimaData!)}${i.temporada ? ` (temporada de ${i.temporada})` : ""}.`);
  }
  const dia = deIso(data).getDay();
  const semDia = itens.filter((i) => !saiNoDia(i, modo, dia));
  if (semDia.length) {
    const quem = semDia.length === itens.length ? "" : `${lista(semDia.map((i) => i.nome))}: `;
    return nao(`${quem}${quem ? "sem" : "Sem"} ${nomeModo(modo)} ${DIAS_PLURAL[dia]}.`);
  }
  if (!janelas.length) return nao(modoPossivel(itens, modo).motivo ?? "Sem janela disponível.");
  const { horas, quem } = prazoDoPedido(itens);
  const minimo = agora.getTime() + horas * 3600_000;
  const avaliadas = janelas.map((janela) => ({ janela, ok: comHora(data, janela.inicio).getTime() >= minimo }));
  if (!avaliadas.some((j) => j.ok)) return { ...nao(`${lista(quem)} ${quem.length > 1 ? "precisam" : "precisa"} de ${textoPrazo(horas)} de antecedência.`, { porPrazo: true }) };
  return { ok: true, janelas: avaliadas };
}

/** Primeira data com pelo menos uma janela livre, ou null se não houver no horizonte. */
export function primeiraData(itens: ItemEnc[], modo: Modo, agora: Date) {
  if (!itens.length || !modoPossivel(itens, modo).ok) return null;
  const hoje = iso(agora);
  for (let n = 0; n <= agenda.horizonteDias; n++) {
    const d = somarDias(hoje, n);
    if (checarDia(d, itens, modo, agora).ok) return d;
  }
  return null;
}

/** Avalia um dia: se dá, quais janelas servem e, se não dá, o motivo em texto claro. */
export function avaliarDia(data: string, itens: ItemEnc[], modo: Modo, agora: Date): Avaliacao {
  const r = checarDia(data, itens, modo, agora);
  if (r.porPrazo) {
    const p = primeiraData(itens, modo, agora);
    return { ok: false, janelas: r.janelas, motivo: `${r.motivo}${p ? ` A primeira data possível é ${dataCurta(p)}.` : ""}` };
  }
  return r;
}

/** Dias da semana em que o conjunto de itens sai no modo escolhido (para textos de ajuda). */
export const diasComuns = (itens: ItemEnc[], modo: Modo) => [0, 1, 2, 3, 4, 5, 6].filter((d) => itens.every((i) => saiNoDia(i, modo, d)));
