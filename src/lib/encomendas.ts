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
  chamada: "Encomendas de Natal", // botão flutuante e links
  titulo: ["Encomendas de", "Natal."], // a segunda parte sai em serif itálico
  subtitulo: "Panetone de fermentação natural, bolo com casinhas de biscoito, torta, cesta de café da manhã e kit presente. Você escolhe, marca a data e confirma com um sinal via Pix.",
  home: {
    titulo: ["Encomendas de", "Natal."],
    texto: "Panetone, bolo de Natal, torta, cesta e kit presente feitos aqui, com data marcada. Escolha o dia e a janela; a gente separa o seu.",
    foto: "/fotos/enc-bolo-natal.webp",
  },
};

// ---------- Agenda: janelas de horário, horizonte e dias fechados ----------
export const agenda = {
  janelas: {
    retirada: [
      { id: "manha", nome: "Manhã", inicio: "08:00", fim: "11:00" },
      { id: "tarde", nome: "Tarde", inicio: "14:00", fim: "18:00" },
    ],
    entrega: [
      { id: "cedo", nome: "Bem cedo", inicio: "07:00", fim: "09:00" },
      { id: "manha", nome: "Manhã", inicio: "09:00", fim: "12:00" },
      { id: "tarde", nome: "Tarde", inicio: "14:00", fim: "18:00" },
    ],
  } satisfies Record<Modo, Janela[]>,
  horizonteDias: 75, // até quantos dias à frente o calendário aceita pedido
  fechado: [
    { data: "2026-12-25", motivo: "Dia de Natal: a casa fecha." },
    { data: "2027-01-01", motivo: "Ano-novo: a casa fecha." },
  ],
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

const SEG_SAB: DiaSemana[] = [1, 2, 3, 4, 5, 6];
const TER_SAB: DiaSemana[] = [2, 3, 4, 5, 6];
const TODOS: DiaSemana[] = [0, 1, 2, 3, 4, 5, 6];

const produtos: Produto[] = [
  {
    id: "panetone",
    nome: "Panetone artesanal",
    descricao: "Fermentação natural de 36 horas, manteiga de verdade e casca de laranja feita aqui. Vem na forma de papel, pronto para dar de presente.",
    foto: "/fotos/enc-panetone.webp",
    buscaFoto: "panettone christmas",
    tamanhos: [
      { id: "500g", nome: "500 g", preco: 6900 },
      { id: "1kg", nome: "1 kg", preco: 11900 },
    ],
    sabores: {
      titulo: "Sabor",
      itens: [
        { id: "frutas", nome: "Frutas e laranja" },
        { id: "chocolate", nome: "Gotas de chocolate 70%" },
        { id: "doce-leite", nome: "Doce de leite e nozes", acrescimo: 1200 },
      ],
    },
    adicionais: [{ id: "caixa", nome: "Caixa de presente", preco: 800 }],
    mensagem: { rotulo: "Cartão", limite: 120, dica: "Vai num cartão preso na fita. Deixe em branco se não quiser." },
    temporada: "Natal",
    ultimaData: "2026-12-24",
    prazoHoras: 48,
    retirada: { dias: SEG_SAB, janelas: ["manha", "tarde"] },
    entrega: { dias: SEG_SAB, janelas: ["manha", "tarde"] },
  },
  {
    id: "bolo-natal",
    nome: "Bolo de Natal",
    descricao: "Massa amanteigada de especiarias, cobertura de cream cheese e casinhas de biscoito de gengibre feitas uma a uma.",
    foto: "/fotos/enc-bolo-natal.webp",
    buscaFoto: "christmas cake gingerbread houses",
    tamanhos: [
      { id: "p", nome: "P · serve 8", preco: 12900 },
      { id: "m", nome: "M · serve 15", preco: 18900 },
      { id: "g", nome: "G · serve 25", preco: 27900 },
    ],
    sabores: {
      titulo: "Recheio",
      itens: [
        { id: "nozes", nome: "Nozes com doce de leite" },
        { id: "frutas-vermelhas", nome: "Frutas vermelhas e baunilha", acrescimo: 1500 },
      ],
    },
    mensagem: { rotulo: "Escrita no bolo", limite: 30, dica: "Uma frase curta, escrita com chocolate. Ex.: Feliz Natal, família" },
    temporada: "Natal",
    ultimaData: "2026-12-24",
    prazoHoras: 72,
    retirada: { dias: TER_SAB, janelas: ["manha", "tarde"] },
    entrega: { dias: TER_SAB, janelas: ["manha", "tarde"] },
  },
  {
    id: "torta-peca",
    nome: "Torta de noz-pecã",
    descricao: "Massa amanteigada, recheio de caramelo de rapadura e noz-pecã tostada por cima. Sai o ano todo.",
    foto: "/fotos/enc-torta.webp",
    buscaFoto: "pecan pie coffee",
    tamanhos: [
      { id: "18", nome: "18 cm · serve 8", preco: 9800 },
      { id: "24", nome: "24 cm · serve 12", preco: 14800 },
    ],
    remover: ["Calda extra de caramelo"],
    prazoHoras: 24,
    retirada: { dias: SEG_SAB, janelas: ["manha", "tarde"] },
    entrega: { dias: SEG_SAB, janelas: ["manha", "tarde"] },
  },
  {
    id: "cesta-cafe",
    nome: "Cesta de café da manhã",
    descricao: "Croissant, pão de queijo, bolo de fubá, geleia da casa, frutas, café coado na garrafa térmica e suco de laranja. Chega cedo, ainda quente.",
    foto: "/fotos/enc-cesta.webp",
    buscaFoto: "breakfast basket croissants coffee",
    tamanhos: [
      { id: "2", nome: "Para 2 pessoas", preco: 15900 },
      { id: "4", nome: "Para 4 pessoas", preco: 27900 },
    ],
    adicionais: [{ id: "mini-panetone", nome: "Mini panetone (100 g)", preco: 2200, max: 4 }],
    mensagem: { rotulo: "Cartão", limite: 160, dica: "Vai escrito à mão dentro da cesta." },
    temporada: "Natal",
    prazoHoras: 24,
    retirada: { dias: SEG_SAB, janelas: ["manha"] },
    entrega: { dias: TODOS, janelas: ["cedo", "manha"] },
  },
  {
    id: "kit-presente",
    nome: "Kit presente do Ponto",
    descricao: "250 g do café da Mantiqueira, caixa de biscoitos amanteigados de Natal e caneca esmaltada da casa.",
    foto: "/fotos/enc-kit.webp",
    buscaFoto: "christmas cookies gift box",
    tamanhos: [{ id: "unico", nome: "Kit completo", preco: 13900 }],
    sabores: {
      titulo: "Café",
      itens: [
        { id: "graos", nome: "Em grãos" },
        { id: "coado", nome: "Moído para coado" },
        { id: "italiana", nome: "Moído para italiana" },
      ],
    },
    mensagem: { rotulo: "Cartão escrito à mão", limite: 200, preco: 500, dica: "Escrito pela equipe, com caneta de verdade." },
    temporada: "Natal",
    ultimaData: "2026-12-24",
    prazoHoras: 48,
    retirada: { dias: SEG_SAB, janelas: ["manha", "tarde"] },
    entrega: { dias: SEG_SAB, janelas: ["manha", "tarde"] },
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
