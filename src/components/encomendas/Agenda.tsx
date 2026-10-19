"use client";

// "Para quando?": calendário da encomenda + janela de horário.
// Dias bloqueados continuam focáveis: tocar ou chegar neles pelo teclado mostra o motivo em texto.
// Teclado: setas (dia/semana), Home/End (início/fim da semana), PageUp/PageDown (mês), Enter/Espaço escolhe.
// Sem animação: é um controle de formulário, não um efeito.
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { Modo } from "@/lib/encomendas";
import { agenda } from "@/lib/encomendas";
import {
  avaliarDia,
  dataLonga,
  deIso,
  diasComuns,
  horasJanela,
  iso,
  prazoDoPedido,
  primeiraData,
  somarDias,
  textoDias,
  textoPrazo,
  type ItemEnc,
} from "@/lib/agenda";
import s from "./Agenda.module.css";

type Valor = { data?: string; janela?: string };

const SEMANA = [
  { curto: "D", nome: "domingo" },
  { curto: "S", nome: "segunda" },
  { curto: "T", nome: "terça" },
  { curto: "Q", nome: "quarta" },
  { curto: "Q", nome: "quinta" },
  { curto: "S", nome: "sexta" },
  { curto: "S", nome: "sábado" },
];

export function Agenda({
  itens,
  modo,
  valor,
  onChange,
  erroData,
  erroJanela,
}: {
  itens: ItemEnc[];
  modo: Modo;
  valor: Valor;
  onChange: (v: Valor) => void;
  erroData?: string;
  erroJanela?: string;
}) {
  const [agora] = useState(() => new Date());
  const hoje = iso(agora);
  const limite = somarDias(hoje, agenda.horizonteDias);
  const primeira = useMemo(() => primeiraData(itens, modo, agora), [itens, modo, agora]);
  const [foco, setFoco] = useState(() => valor.data ?? primeira ?? hoje);
  const [mes, setMes] = useState(() => foco.slice(0, 7));
  const [aviso, setAviso] = useState<string | null>(null);
  const moverFoco = useRef(false);
  const grade = useRef<HTMLTableElement>(null);

  const avaliar = (d: string) => avaliarDia(d, itens, modo, agora);
  const escolhido = valor.data ? avaliar(valor.data) : null;

  // Itens ou modo mudaram: desfaz escolhas que deixaram de valer e volta o calendário para a primeira data.
  useEffect(() => {
    if (valor.data) {
      const r = avaliarDia(valor.data, itens, modo, agora);
      if (!r.ok) {
        onChange({});
        setAviso(`A data escolhida deixou de valer. ${r.motivo ?? ""}`);
      } else if (valor.janela && !r.janelas.some((j) => j.ok && j.janela.id === valor.janela)) onChange({ data: valor.data });
    } else if (primeira) {
      setFoco(primeira);
      setMes(primeira.slice(0, 7));
    }
    // (só reage a itens/modo; valor e onChange mudam a cada escolha)
  }, [itens, modo]);

  useEffect(() => {
    if (!moverFoco.current) return;
    moverFoco.current = false;
    grade.current?.querySelector<HTMLButtonElement>(`[data-dia="${foco}"]`)?.focus();
  }, [foco, mes]);

  const semanas = useMemo(() => {
    const [a, m] = mes.split("-").map(Number);
    const ini = new Date(a, m - 1, 1);
    const n = new Date(a, m, 0).getDate();
    const celulas: (string | null)[] = Array(ini.getDay()).fill(null);
    for (let d = 1; d <= n; d++) celulas.push(iso(new Date(a, m - 1, d)));
    while (celulas.length % 7) celulas.push(null);
    const out: (string | null)[][] = [];
    for (let i = 0; i < celulas.length; i += 7) out.push(celulas.slice(i, i + 7));
    return out;
  }, [mes]);

  const mesMin = hoje.slice(0, 7);
  const mesMax = limite.slice(0, 7);
  const nomeMes = deIso(`${mes}-01`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const tituloMes = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1); // "Outubro de 2026"

  const irMes = (delta: number) => {
    const [a, m] = mes.split("-").map(Number);
    const novo = iso(new Date(a, m - 1 + delta, 1)).slice(0, 7);
    if (novo < mesMin || novo > mesMax) return;
    setMes(novo);
    // o foco do teclado vai para o mesmo dia no mês novo (ou o mais perto dentro da agenda)
    const dia = Math.min(Number(foco.slice(8)), new Date(Number(novo.slice(0, 4)), Number(novo.slice(5)), 0).getDate());
    setFoco(clamp(`${novo}-${String(dia).padStart(2, "0")}`));
  };
  const clamp = (d: string) => (d < hoje ? hoje : d > limite ? limite : d);

  const escolher = (d: string) => {
    setFoco(d);
    const r = avaliar(d);
    if (!r.ok) {
      setAviso(r.motivo ?? "Data indisponível.");
      return;
    }
    setAviso(null);
    const livres = r.janelas.filter((j) => j.ok);
    const manter = livres.some((j) => j.janela.id === valor.janela) ? valor.janela : livres.length === 1 ? livres[0].janela.id : undefined;
    onChange({ data: d, janela: manter });
  };

  const tecla = (e: KeyboardEvent<HTMLButtonElement>, d: string) => {
    const dow = deIso(d).getDay();
    const passos: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -dow, End: 6 - dow };
    let alvo: string | null = null;
    if (e.key in passos) alvo = somarDias(d, passos[e.key]);
    else if (e.key === "PageUp" || e.key === "PageDown") {
      const x = deIso(d);
      x.setMonth(x.getMonth() + (e.key === "PageUp" ? -1 : 1));
      alvo = iso(x);
    }
    if (!alvo) return;
    e.preventDefault();
    alvo = clamp(alvo);
    moverFoco.current = true;
    setFoco(alvo);
    setMes(alvo.slice(0, 7));
  };

  const { horas, quem } = prazoDoPedido(itens);
  const dias = diasComuns(itens, modo);
  const nomeModo = modo === "retirada" ? "retirada" : "entrega";
  const status = aviso ?? (valor.data ? `Escolhida: ${dataLonga(valor.data)}.` : "");

  return (
    <fieldset className={s.agenda}>
      <legend className={s.legend}>Para quando?</legend>
      <p className={s.regra}>
        {quem.join(" e ")} {quem.length > 1 ? "pedem" : "pede"} <strong>{textoPrazo(horas)}</strong> de antecedência. {nomeModo === "retirada" ? "Retirada" : "Entrega"} {textoDias(dias)}.
        {primeira ? (
          <>
            {" "}
            Primeira data: <strong>{dataLonga(primeira)}</strong>.
          </>
        ) : (
          ` Sem data livre nos próximos ${agenda.horizonteDias} dias.`
        )}
      </p>

      <div className={s.cal} data-erro={erroData ? true : undefined}>
        <div className={s.mesBar}>
          <button type="button" className={s.seta} onClick={() => irMes(-1)} disabled={mes <= mesMin} aria-label="Mês anterior">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p id="agenda-mes" className={s.mes} aria-live="polite">
            {tituloMes}
          </p>
          <button type="button" className={s.seta} onClick={() => irMes(1)} disabled={mes >= mesMax} aria-label="Próximo mês">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <table ref={grade} id="data" className={s.grade} role="grid" aria-labelledby="agenda-mes" aria-describedby="agenda-status" tabIndex={-1}>
          <thead>
            <tr>
              {SEMANA.map((d) => (
                <th key={d.nome} scope="col" abbr={d.nome}>
                  {d.curto}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {semanas.map((sem, i) => (
              <tr key={i}>
                {sem.map((d, j) =>
                  d ? (
                    <Dia
                      key={d}
                      d={d}
                      ok={avaliar(d).ok}
                      hoje={d === hoje}
                      escolhido={d === valor.data}
                      focavel={d === foco}
                      onClick={() => escolher(d)}
                      onKeyDown={(e) => tecla(e, d)}
                      onFocus={() => {
                        setFoco(d);
                        const r = avaliar(d);
                        if (!r.ok) setAviso(r.motivo ?? "Data indisponível.");
                        else if (d !== valor.data) setAviso(null);
                      }}
                    />
                  ) : (
                    <td key={`v${i}-${j}`} />
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <p id="agenda-status" className={s.status} data-aviso={aviso ? true : undefined} aria-live="polite">
          {status}
        </p>
        {erroData && (
          <p id="data-erro" className={s.erro}>
            {erroData}
          </p>
        )}
      </div>

      <fieldset className={s.janelas} disabled={!escolhido?.ok}>
        <legend className={s.sublegend}>Janela de {nomeModo}</legend>
        {!escolhido?.ok ? (
          <p className={s.vazio}>Escolha o dia para ver os horários.</p>
        ) : (
          <div className={s.opcoes}>
            {escolhido.janelas.map(({ janela, ok }, k) => (
              <label key={janela.id} className={s.janela} data-on={valor.janela === janela.id || undefined} data-off={!ok || undefined}>
                <input
                  id={k === 0 ? "janela" : undefined}
                  type="radio"
                  name="janela"
                  value={janela.id}
                  disabled={!ok}
                  checked={valor.janela === janela.id}
                  onChange={() => onChange({ data: valor.data, janela: janela.id })}
                  aria-describedby={erroJanela ? "janela-erro" : undefined}
                />
                <span className={s.jNome}>{janela.nome}</span>
                <span className={s.jHoras}>{ok ? horasJanela(janela) : `${horasJanela(janela)} · fora do prazo de ${textoPrazo(horas)}`}</span>
              </label>
            ))}
          </div>
        )}
        {erroJanela && (
          <p id="janela-erro" className={s.erro}>
            {erroJanela}
          </p>
        )}
      </fieldset>
    </fieldset>
  );
}

function Dia({
  d,
  ok,
  hoje,
  escolhido,
  focavel,
  onClick,
  onKeyDown,
  onFocus,
}: {
  d: string;
  ok: boolean;
  hoje: boolean;
  escolhido: boolean;
  focavel: boolean;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  onFocus: () => void;
}) {
  return (
    <td aria-selected={escolhido}>
      <button
        type="button"
        data-dia={d}
        className={s.dia}
        data-ok={ok || undefined}
        data-hoje={hoje || undefined}
        data-escolhido={escolhido || undefined}
        tabIndex={focavel ? 0 : -1}
        aria-disabled={!ok || undefined}
        aria-label={`${dataLonga(d)}${hoje ? ", hoje" : ""}${ok ? "" : ", indisponível"}`}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      >
        {Number(d.slice(8))}
      </button>
    </td>
  );
}
