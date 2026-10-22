// Encomendas (bolos, tortas, panetones, cestas e kits com data marcada). Preços e nomes de EXEMPLO, em centavos.
// Fonte única, como cardapio.ts: a página /encomendas, o bloco da home, o painel do item, a sacola,
// o calendário do pedido e a mensagem do WhatsApp leem daqui.
//
// PARA OUTRO CLIENTE: troque `vitrine`, `agenda` e a lista `produtos` abaixo. Contatos, sinal (%),
// chave Pix e taxa de entrega ficam em ./data.ts. Nenhum outro arquivo precisa mudar.
import type { Adicional, GrupoOpcao, Item } from "./cardapio";

export type Modo = "retirada" | "entrega";
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo, 6 = sábado
export type Janela = { id: string; nome: string; inicio: string; fim: string }; // horários "HH:MM"
export type Logistica = { dias: DiaSemana[]; janelas: string[] }; // ids de agenda.janelas[modo]

export type RegrasEncomenda = {
  prazoHoras: number; // antecedência mínima entre o pedido e o início da janela escolhida
  temporada?: string; // tag mostrada no cartão (ex.: "Natal")
  ultimaData?: string; // "AAAA-MM-DD": último dia em que o item sai (fim da temporada)
  mensagem?: { rotulo: string; limite: number; dica?: string; preco?: number }; // texto no bolo ou no cartão
  retirada?: Logistica; // sem isto, o item não tem retirada
  entrega?: Logistica; // sem isto, o item não tem entrega
};

// ---------- Textos da vitrine (página /encomendas e bloco da home) ----------
export const vitrine = {
  chamada: "Encomendas", // botão flutuante e links
  titulo: ["Encomende seu", "bolo."], // a segunda parte sai em serif itálico
  subtitulo: "Bolo Vulcão explodindo de recheio, bolo de cenoura com brigadeiro e o chocolatudo. Você escolhe, marca o dia e o pedido chega pronto no WhatsApp da Ka.",
  home: {
    titulo: ["Encomende seu", "bolo."],
    texto: "Bolos caseiros fresquinhos, macios e molhadinhos, feitos sob encomenda com data marcada.",
    foto: "/fotos/ka-vulcao.webp",
  },
};

// ---------- Agenda: janelas de horário, horizonte e dias fechados ----------
export const agenda = {
  janelas: {
    retirada: [
      { id: "manha", nome: "Manhã", inicio: "09:00", fim: "12:00" },
      { id: "tarde", nome: "Tarde", inicio: "14:00", fim: "18:00" },
      { id: "noite", nome: "Noite", inicio: "18:00", fim: "21:00" },
    ],
    entrega: [
      { id: "manha", nome: "Manhã", inicio: "09:00", fim: "12:00" },
      { id: "tarde", nome: "Tarde", inicio: "14:00", fim: "18:00" },
    ],
  } satisfies Record<Modo, Janela[]>,
  horizonteDias: 75, // até quantos dias à frente o calendário aceita pedido
  fechado: [] as { data: string; motivo: string }[], // prévia: dias fechados a combinar com a Ka
};

// ---------- Catálogo ----------
type Produto = {
  id: string;
  nome: string;
  descricao: string;
  foto: string;
  buscaFoto: string;
  tamanhos: { id: string; nome: string; preco: number }[]; // preço cheio de cada tamanho
  sabores?: { titulo: string; itens: { id: string; nome: string; acrescimo?: number }[] }; // acrescimo = adicional do sabor
  adicionais?: Adicional[];
  remover?: string[];
} & RegrasEncomenda;

const TODOS: DiaSemana[] = [0, 1, 2, 3, 4, 5, 6];

const produtos: Produto[] = [
  {
    id: "vulcao",
    nome: "Bolo Caseiro Vulcão",
    descricao: "Macio, molhadinho e com recheio farto que causa erupção de delícia na boca. Feito só com ingredientes de 1ª qualidade.",
    foto: "/fotos/ka-vulcao.webp",
    buscaFoto: "",
    tamanhos: [{ id: "inteiro", nome: "Bolo inteiro", preco: 7000 }],
    prazoHoras: 24,
    retirada: { dias: TODOS, janelas: ["manha", "tarde", "noite"] },
    entrega: { dias: TODOS, janelas: ["manha", "tarde"] },
  },
  {
    id: "vulcao-gourmet",
    nome: "Bolo Vulcão Gourmet",
    descricao: "Explosão de chocolate nobre: macio por fora, recheio abundante e decoração especial. Perfeito para presentear.",
    foto: "/fotos/ka-vulcao-gourmet.webp",
    buscaFoto: "",
    tamanhos: [{ id: "inteiro", nome: "Bolo inteiro", preco: 9000 }],
    prazoHoras: 24,
    retirada: { dias: TODOS, janelas: ["manha", "tarde", "noite"] },
    entrega: { dias: TODOS, janelas: ["manha", "tarde"] },
  },
  {
    id: "vulcao-frutas",
    nome: "Bolo Vulcão com Frutas",
    descricao: "Erupção tropical: recheio de morango suculento com abacaxi refrescante. O vulcão mais fresco da casa.",
    foto: "/fotos/ka-vulcao-frutas.webp",
    buscaFoto: "",
    tamanhos: [{ id: "inteiro", nome: "Bolo inteiro", preco: 7000 }],
    prazoHoras: 24,
    retirada: { dias: TODOS, janelas: ["manha", "tarde", "noite"] },
    entrega: { dias: TODOS, janelas: ["manha", "tarde"] },
  },
  {
    id: "cenoura",
    nome: "Bolo de Cenoura com Brigadeiro",
    descricao: "O carro-chefe: macio, derrete na boca e vem com muita cobertura de brigadeiro cremoso por todo lado.",
    foto: "/fotos/ka-cenoura.webp",
    buscaFoto: "",
    tamanhos: [{ id: "inteiro", nome: "Bolo inteiro", preco: 3700 }],
    prazoHoras: 24,
    retirada: { dias: TODOS, janelas: ["manha", "tarde", "noite"] },
    entrega: { dias: TODOS, janelas: ["manha", "tarde"] },
  },
  {
    id: "chocolatudo",
    nome: "Bolo Chocolatudo",
    descricao: "Massa molhadinha com recheio de brigadeiro que derrete na boca.",
    foto: "/fotos/ka-chocolatudo.webp",
    buscaFoto: "",
    tamanhos: [{ id: "inteiro", nome: "Bolo inteiro", preco: 3700 }],
    prazoHoras: 24,
    retirada: { dias: TODOS, janelas: ["manha", "tarde", "noite"] },
    entrega: { dias: TODOS, janelas: ["manha", "tarde"] },
  },
];

// Converte o formato amigável acima no formato de Item usado pelo resto do site.
// Tamanho vira um grupo de opção cujo acréscimo é a diferença para o primeiro tamanho.
function paraItem(p: Produto): Item {
  const base = p.tamanhos[0].preco;
  const opcoes: GrupoOpcao[] = [];
  if (p.tamanhos.length > 1)
    opcoes.push({ id: "tamanho", titulo: "Tamanho", padrao: p.tamanhos[0].id, itens: p.tamanhos.map((t) => ({ id: t.id, nome: t.nome, acrescimo: t.preco - base })) });
  if (p.sabores)
    opcoes.push({ id: "sabor", titulo: p.sabores.titulo, padrao: p.sabores.itens[0].id, itens: p.sabores.itens.map((s) => ({ id: s.id, nome: s.nome, acrescimo: s.acrescimo ?? 0 })) });
  return {
    id: p.id,
    categoria: "encomendas",
    nome: p.nome,
    descricao: p.descricao,
    preco: base,
    foto: p.foto,
    buscaFoto: p.buscaFoto,
    opcoes: opcoes.length ? opcoes : undefined,
    remover: p.remover,
    adicionais: p.adicionais,
    selo: p.temporada,
    encomenda: { prazoHoras: p.prazoHoras, temporada: p.temporada, ultimaData: p.ultimaData, mensagem: p.mensagem, retirada: p.retirada, entrega: p.entrega },
  };
}

export const encomendas: Item[] = produtos.map(paraItem);
