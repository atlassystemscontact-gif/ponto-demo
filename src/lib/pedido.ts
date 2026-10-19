// Regras de preço e montagem da mensagem do pedido. Fonte única para painel, carrinho e WhatsApp.
import { cardapio, formatarPreco, type Item } from "./cardapio";
import { encomendas, type Janela, type Modo } from "./encomendas";
import { dataComAno, ehEncomenda, iso, textoJanela } from "./agenda";
import { DEMO, loja } from "./data";

/** "[DEMO]" no começo de toda mensagem de WhatsApp enquanto DEMO = true (data.ts). */
const comDemo = (titulo: string) => (DEMO ? `[DEMO] ${titulo}` : titulo);

export type Config = {
  opcoes: Record<string, string>; // grupoId -> opcaoId
  remover: string[]; // nomes do item.remover
  adicionais: Record<string, number>; // adicionalId -> quantidade
  obs: string;
  mensagem?: string; // encomendas: texto no bolo ou no cartão (item.encomenda.mensagem)
};

export const configPadrao = (item: Item): Config => ({
  opcoes: Object.fromEntries((item.opcoes ?? []).map((g) => [g.id, g.padrao])),
  remover: [],
  adicionais: {},
  obs: "",
  ...(item.encomenda?.mensagem ? { mensagem: "" } : {}),
});

export const acharItem = (id: string) => cardapio.find((i) => i.id === id) ?? encomendas.find((i) => i.id === id);

export function precoUnitario(item: Item, c: Config) {
  let p = item.preco;
  for (const g of item.opcoes ?? []) {
    const o = g.itens.find((x) => x.id === c.opcoes[g.id]);
    if (o) p += o.acrescimo;
  }
  for (const a of item.adicionais ?? []) p += a.preco * (c.adicionais[a.id] ?? 0);
  const msg = item.encomenda?.mensagem;
  if (msg?.preco && c.mensagem?.trim()) p += msg.preco; // ex.: cartão escrito à mão
  return p;
}

/** "a partir de": menor combinação obrigatória */
export function precoMinimo(item: Item) {
  let p = item.preco;
  for (const g of item.opcoes ?? []) p += Math.min(...g.itens.map((o) => o.acrescimo));
  return p;
}

/** Descrição curta da configuração, para o carrinho e a mensagem. Só mostra o que difere do básico. */
export function resumoConfig(item: Item, c: Config): string[] {
  const out: string[] = [];
  for (const g of item.opcoes ?? []) {
    const o = g.itens.find((x) => x.id === c.opcoes[g.id]);
    if (!o || g.itens.length < 2) continue;
    if (g.id === "leite") {
      if (o.id === g.padrao) continue; // leite integral é o padrão: não precisa avisar
      out.push(o.id === "aveia" || o.id === "amendoas" ? `Leite de ${o.nome.toLowerCase()}` : `Leite ${o.nome.toLowerCase()}`);
    } else out.push(o.nome);
  }
  for (const r of c.remover) out.push(`Sem ${lower(r)}`);
  for (const a of item.adicionais ?? []) {
    const q = c.adicionais[a.id] ?? 0;
    if (q > 0) out.push(q > 1 ? `${q}x ${a.nome}` : `+ ${a.nome}`);
  }
  const msg = item.encomenda?.mensagem;
  if (msg && c.mensagem?.trim()) out.push(`${msg.rotulo}: "${c.mensagem.trim()}"`);
  if (c.obs.trim()) out.push(`"${c.obs.trim()}"`);
  return out;
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export const chaveLinha = (id: string, c: Config) =>
  id +
  "|" +
  JSON.stringify({
    o: Object.entries(c.opcoes).sort(),
    r: [...c.remover].sort(),
    a: Object.entries(c.adicionais).filter(([, q]) => q > 0).sort(),
    obs: c.obs.trim(),
    ...(c.mensagem?.trim() ? { m: c.mensagem.trim() } : {}),
  });

export type Linha = { chave: string; id: string; qtd: number; config: Config };

export type DadosPedido = {
  numero: number;
  tipo: "retirada" | "entrega";
  nome: string;
  horario?: string;
  endereco?: string;
  obs?: string;
};

export function mensagemWhatsApp(linhas: Linha[], d: DadosPedido, taxa: number) {
  const partes: string[] = [];
  partes.push(comDemo(`*Pedido Ponto #${d.numero}*`));
  // "Retirada: 7h30" ou "Retirada: o quanto antes"
  partes.push(d.tipo === "retirada" ? `Retirada${d.horario ? `: ${/^\d/.test(d.horario) ? d.horario : lower(d.horario)}` : ""}` : `Entrega: ${d.endereco}`);
  partes.push(`Nome: ${d.nome}`);
  partes.push("");
  let total = 0;
  for (const l of linhas) {
    const item = acharItem(l.id);
    if (!item) continue;
    const sub = precoUnitario(item, l.config) * l.qtd;
    total += sub;
    const det = resumoConfig(item, l.config);
    partes.push(`${l.qtd}x ${item.nome}${det.length ? " · " + det.join(" · ") : ""} ... ${formatarPreco(sub)}`);
  }
  if (d.tipo === "entrega") {
    partes.push(`Taxa de entrega ... ${formatarPreco(taxa)}`);
    total += taxa;
  }
  partes.push("");
  partes.push(`*Total: ${formatarPreco(total)}*`);
  if (d.obs?.trim()) partes.push(`Obs: ${d.obs.trim()}`);
  return partes.join("\n");
}

// ---------- Encomendas ----------

/** Taxa de entrega do pedido: encomendas têm área e taxa próprias (data.ts). */
export const taxaDoPedido = (tipo: Modo, temEncomenda: boolean) =>
  tipo === "entrega" ? (temEncomenda ? loja.encomendas.taxaEntrega : loja.taxaEntrega) : 0;

/** Sinal via Pix que confirma a encomenda (percentual em data.ts). */
export const valorSinal = (total: number) => Math.round((total * loja.encomendas.sinalPercentual) / 100);

/** Código do pedido: AAAA-MM-DD-XXX, sufixo curto gerado no navegador (sem O/0/I/1 para não confundir). */
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 símbolos: 256 % 32 = 0, sem viés
export function codigoPedido(agora = new Date()) {
  const n = crypto.getRandomValues(new Uint8Array(3));
  return `${iso(agora)}-${Array.from(n, (x) => ALFABETO[x % ALFABETO.length]).join("")}`;
}
export const rastreio = (codigo: string) => `[Origem: site | Pedido #${codigo}]`;

/** Detalhes de um item de encomenda, um por linha ("Tamanho: M · serve 15"). */
export function detalhesEncomenda(item: Item, c: Config): string[] {
  const out: string[] = [];
  for (const g of item.opcoes ?? []) {
    const o = g.itens.find((x) => x.id === c.opcoes[g.id]);
    if (o) out.push(`${g.titulo}: ${o.nome}`);
  }
  for (const r of c.remover) out.push(`Sem ${lower(r)}`);
  for (const a of item.adicionais ?? []) {
    const q = c.adicionais[a.id] ?? 0;
    if (q > 0) out.push(q > 1 ? `${q}x ${a.nome}` : `+ ${a.nome}`);
  }
  const msg = item.encomenda?.mensagem;
  if (msg) out.push(`${msg.rotulo}: ${c.mensagem?.trim() ? `"${c.mensagem.trim()}"` : "sem texto"}`);
  if (c.obs.trim()) out.push(`Obs.: ${c.obs.trim()}`);
  return out;
}

export type DadosEncomenda = {
  codigo: string;
  tipo: Modo;
  nome: string;
  data: string; // AAAA-MM-DD
  janela: Janela;
  endereco?: string;
  obs?: string;
};

export function mensagemEncomenda(linhas: Linha[], d: DadosEncomenda) {
  const p: string[] = [];
  p.push(comDemo(`*Encomenda · ${loja.nome}*`));
  p.push(`Pedido #${d.codigo}`);
  p.push("");
  p.push("*Itens*");
  let subtotal = 0;
  for (const l of linhas) {
    const item = acharItem(l.id);
    if (!item) continue;
    const sub = precoUnitario(item, l.config) * l.qtd;
    subtotal += sub;
    if (ehEncomenda(item)) {
      p.push(`${l.qtd}x ${item.nome} ... ${formatarPreco(sub)}`);
      for (const det of detalhesEncomenda(item, l.config)) p.push(`   - ${det}`);
    } else {
      const det = resumoConfig(item, l.config);
      p.push(`${l.qtd}x ${item.nome}${det.length ? " · " + det.join(" · ") : ""} ... ${formatarPreco(sub)}`);
    }
  }
  p.push("");
  p.push("*Quando*");
  p.push(d.tipo === "retirada" ? "Retirada no balcão" : "Entrega");
  p.push(`Data: ${dataComAno(d.data)}`);
  p.push(`Janela: ${textoJanela(d.janela)}`);
  if (d.tipo === "entrega" && d.endereco) p.push(`Endereço: ${d.endereco}`);
  p.push("");
  p.push(`Nome: ${d.nome}`);
  p.push("");
  const taxa = taxaDoPedido(d.tipo, true);
  const total = subtotal + taxa;
  const sinal = valorSinal(total);
  p.push(`Subtotal ... ${formatarPreco(subtotal)}`);
  if (taxa) p.push(`Taxa de entrega ... ${formatarPreco(taxa)}`);
  p.push(`*Total: ${formatarPreco(total)}*`);
  p.push(`*Sinal (${loja.encomendas.sinalPercentual}%) via Pix: ${formatarPreco(sinal)}*`);
  p.push(`Restante na ${d.tipo === "retirada" ? "retirada" : "entrega"}: ${formatarPreco(total - sinal)}`);
  p.push("A encomenda só é confirmada depois do sinal.");
  if (d.obs?.trim()) p.push(`Obs.: ${d.obs.trim()}`);
  p.push("");
  p.push(rastreio(d.codigo));
  return p.join("\n");
}
