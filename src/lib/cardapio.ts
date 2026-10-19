// Cardápio do Ponto, café & chapa (preços de EXEMPLO, em centavos).
// Fonte única: o site inteiro (home, /cardapio, carrinho, mensagem do WhatsApp) lê daqui.
// Encomendas (bolos, panetones, cestas) ficam em ./encomendas.ts com o mesmo formato de Item.
import type { RegrasEncomenda } from "./encomendas";

export type Opcao = { id: string; nome: string; acrescimo: number };
export type GrupoOpcao = { id: string; titulo: string; itens: Opcao[]; padrao: string };
export type Adicional = { id: string; nome: string; preco: number; max?: number };

export type Item = {
  id: string;
  categoria: CategoriaId;
  nome: string;
  descricao: string;
  preco: number; // preço base
  foto: string; // caminho em public/fotos (Claude Code baixa e preenche)
  buscaFoto: string; // termo para achar a foto no Unsplash/Pexels
  opcoes?: GrupoOpcao[]; // escolha única, obrigatória
  remover?: string[]; // "Sem ..." (não muda preço)
  adicionais?: Adicional[]; // extras pagos
  selo?: "Mais pedido" | "Da casa" | "Vegano" | (string & {}); // encomendas usam a tag de temporada (ex.: "Natal")
  destaque?: boolean; // aparece no carrossel da home
  encomenda?: RegrasEncomenda; // só nos itens de ./encomendas.ts (prazo, mensagem, retirada/entrega)
};

export type CategoriaId = "cafes" | "com-leite" | "gelados" | "chapa" | "forno" | "doces" | "encomendas";

export const categorias: { id: CategoriaId; nome: string }[] = [
  { id: "cafes", nome: "Cafés" },
  { id: "com-leite", nome: "Com leite" },
  { id: "gelados", nome: "Gelados" },
  { id: "chapa", nome: "Chapa & sanduíches" },
  { id: "forno", nome: "Do forno" },
  { id: "doces", nome: "Doces" },
];

// Grupos reutilizados
const tamanho = (p: number, m: number, g: number): GrupoOpcao => ({
  id: "tamanho",
  titulo: "Tamanho",
  padrao: "m",
  itens: [
    { id: "p", nome: "P (180 ml)", acrescimo: p },
    { id: "m", nome: "M (240 ml)", acrescimo: m },
    { id: "g", nome: "G (350 ml)", acrescimo: g },
  ],
});

const leite: GrupoOpcao = {
  id: "leite",
  titulo: "Leite",
  padrao: "integral",
  itens: [
    { id: "integral", nome: "Integral", acrescimo: 0 },
    { id: "desnatado", nome: "Desnatado", acrescimo: 0 },
    { id: "zero-lactose", nome: "Zero lactose", acrescimo: 100 },
    { id: "aveia", nome: "Aveia", acrescimo: 300 },
    { id: "amendoas", nome: "Amêndoas", acrescimo: 300 },
  ],
};

const extrasCafe: Adicional[] = [
  { id: "shot", nome: "Shot extra de espresso", preco: 400, max: 2 },
  { id: "chantilly", nome: "Chantilly", preco: 300 },
  { id: "doce-leite", nome: "Calda de doce de leite", preco: 300 },
  { id: "canela", nome: "Canela", preco: 0 },
];

const pao: GrupoOpcao = {
  id: "pao",
  titulo: "Pão",
  padrao: "frances",
  itens: [
    { id: "frances", nome: "Pão francês", acrescimo: 0 },
    { id: "natural", nome: "Fermentação natural", acrescimo: 400 },
    { id: "integral", nome: "Integral", acrescimo: 200 },
    { id: "brioche", nome: "Brioche", acrescimo: 300 },
  ],
};

const extrasChapa: Adicional[] = [
  { id: "ovo", nome: "Ovo na chapa", preco: 400, max: 2 },
  { id: "bacon", nome: "Bacon", preco: 600 },
  { id: "queijo-extra", nome: "Queijo extra", preco: 500 },
  { id: "requeijao", nome: "Requeijão de copo", preco: 300 },
  { id: "tomate", nome: "Tomate", preco: 200 },
  { id: "catupiry", nome: "Catupiry", preco: 500 },
];

export const cardapio: Item[] = [
  // ---------- Cafés ----------
  {
    id: "espresso",
    categoria: "cafes",
    nome: "Espresso",
    descricao: "Café da Mantiqueira, torra média. Doce, notas de chocolate e caramelo. Curto e direto.",
    preco: 800,
    foto: "/fotos/espresso.webp",
    buscaFoto: "espresso shot cup dark",
    opcoes: [{ id: "dose", titulo: "Dose", padrao: "simples", itens: [{ id: "simples", nome: "Simples", acrescimo: 0 }, { id: "duplo", nome: "Duplo", acrescimo: 400 }] }],
    adicionais: [{ id: "agua-gas", nome: "Água com gás", preco: 300 }],
    selo: "Da casa",
  },
  {
    id: "coado",
    categoria: "cafes",
    nome: "Coado do dia",
    descricao: "Passado na hora no V60. O grão muda toda semana, o barista conta qual é.",
    preco: 1000,
    foto: "/fotos/coado.webp",
    buscaFoto: "pour over coffee v60",
    opcoes: [tamanho(0, 200, 500)],
    remover: ["Açúcar no balcão"],
  },
  {
    id: "carioca",
    categoria: "cafes",
    nome: "Café carioca",
    descricao: "Espresso alongado com água quente. Para quem quer o sabor do espresso por mais tempo.",
    preco: 900,
    foto: "/fotos/carioca.webp",
    buscaFoto: "americano coffee cup",
  },

  // ---------- Com leite ----------
  {
    id: "pingado",
    categoria: "com-leite",
    nome: "Pingado",
    descricao: "O clássico do balcão: café coado com leite vaporizado, no copo americano.",
    preco: 900,
    foto: "/fotos/pingado.webp",
    buscaFoto: "coffee with milk glass cup",
    opcoes: [leite],
    remover: ["Açúcar"],
    adicionais: [{ id: "canela", nome: "Canela", preco: 0 }],
    selo: "Mais pedido",
    destaque: true,
  },
  {
    id: "cappuccino",
    categoria: "com-leite",
    nome: "Cappuccino",
    descricao: "Espresso, leite vaporizado e espuma fina. Do jeito italiano, sem chocolate em pó.",
    preco: 1400,
    foto: "/fotos/cappuccino.webp",
    buscaFoto: "cappuccino latte art top view",
    opcoes: [tamanho(-200, 0, 400), leite],
    adicionais: extrasCafe,
    destaque: true,
  },
  {
    id: "latte",
    categoria: "com-leite",
    nome: "Latte",
    descricao: "Mais leite, menos espuma. Suave, bom para acompanhar o pão na chapa.",
    preco: 1500,
    foto: "/fotos/latte.webp",
    buscaFoto: "latte glass cafe",
    opcoes: [tamanho(-200, 0, 400), leite],
    adicionais: extrasCafe,
  },
  {
    id: "mocha",
    categoria: "com-leite",
    nome: "Mocha da casa",
    descricao: "Espresso, chocolate 50% derretido na hora e leite vaporizado.",
    preco: 1700,
    foto: "/fotos/mocha.webp",
    buscaFoto: "mocha coffee chocolate",
    opcoes: [tamanho(-200, 0, 400), leite],
    remover: ["Raspas de chocolate"],
    adicionais: extrasCafe,
  },

  // ---------- Gelados ----------
  {
    id: "cold-brew",
    categoria: "gelados",
    nome: "Cold brew",
    descricao: "Café extraído a frio por 18 horas. Gelado, encorpado e com pouca acidez.",
    preco: 1600,
    foto: "/fotos/cold-brew.webp",
    buscaFoto: "cold brew coffee glass ice",
    opcoes: [{ id: "estilo", titulo: "Estilo", padrao: "puro", itens: [{ id: "puro", nome: "Puro", acrescimo: 0 }, { id: "tonica", nome: "Com tônica e laranja", acrescimo: 300 }, { id: "leite", nome: "Com leite", acrescimo: 100 }] }],
    remover: ["Gelo"],
    destaque: true,
  },
  {
    id: "latte-gelado",
    categoria: "gelados",
    nome: "Latte gelado de doce de leite",
    descricao: "Espresso, leite gelado e doce de leite mineiro no fundo do copo.",
    preco: 1800,
    foto: "/fotos/latte-gelado.webp",
    buscaFoto: "iced latte caramel glass",
    opcoes: [leite],
    remover: ["Gelo", "Chantilly"],
    adicionais: [{ id: "shot", nome: "Shot extra de espresso", preco: 400, max: 2 }],
    selo: "Da casa",
  },

  // ---------- Chapa & sanduíches ----------
  {
    id: "pao-na-chapa",
    categoria: "chapa",
    nome: "Pão na chapa",
    descricao: "Pão francês do dia, manteiga de verdade, prensado na chapa até ficar dourado por fora e macio por dentro.",
    preco: 900,
    foto: "/fotos/pao-na-chapa.webp",
    buscaFoto: "toasted bread roll butter griddle",
    opcoes: [pao],
    remover: ["Manteiga (vai seco na chapa)"],
    adicionais: [{ id: "requeijao", nome: "Requeijão de copo", preco: 300 }, { id: "ovo", nome: "Ovo na chapa", preco: 400, max: 2 }, { id: "queijo", nome: "Queijo minas", preco: 400 }],
    selo: "Mais pedido",
    destaque: true,
  },
  {
    id: "misto-quente",
    categoria: "chapa",
    nome: "Misto quente",
    descricao: "Presunto cozido e queijo prato derretendo, no pão de forma da casa, prensado na chapa.",
    preco: 1700,
    foto: "/fotos/misto-quente.webp",
    buscaFoto: "ham cheese toasted sandwich melted",
    opcoes: [{ id: "pao", titulo: "Pão", padrao: "forma", itens: [{ id: "forma", nome: "Pão de forma da casa", acrescimo: 0 }, { id: "frances", nome: "Pão francês", acrescimo: 0 }, { id: "natural", nome: "Fermentação natural", acrescimo: 400 }] }],
    remover: ["Presunto", "Manteiga"],
    adicionais: extrasChapa,
    destaque: true,
  },
  {
    id: "bauru",
    categoria: "chapa",
    nome: "Bauru do Ponto",
    descricao: "Rosbife fatiado fino, queijo derretido, tomate e picles no pão francês. O paulistano raiz.",
    preco: 2600,
    foto: "/fotos/bauru.webp",
    buscaFoto: "roast beef sandwich melted cheese",
    opcoes: [pao],
    remover: ["Tomate", "Picles", "Orégano"],
    adicionais: extrasChapa,
  },
  {
    id: "pao-ovo",
    categoria: "chapa",
    nome: "Pão com ovo e queijo",
    descricao: "Dois ovos na chapa com gema mole, queijo minas e cebolinha no pão francês.",
    preco: 1600,
    foto: "/fotos/pao-ovo.webp",
    buscaFoto: "egg sandwich runny yolk",
    opcoes: [pao, { id: "gema", titulo: "Gema", padrao: "mole", itens: [{ id: "mole", nome: "Mole", acrescimo: 0 }, { id: "dura", nome: "Dura", acrescimo: 0 }] }],
    remover: ["Queijo", "Cebolinha", "Manteiga"],
    adicionais: extrasChapa,
  },
  {
    id: "tostex-veg",
    categoria: "chapa",
    nome: "Tostado de cogumelos",
    descricao: "Cogumelos salteados, homus e rúcula no pão de fermentação natural. Vegano.",
    preco: 2400,
    foto: "/fotos/tostado-cogumelo.webp",
    buscaFoto: "mushroom toast sourdough",
    remover: ["Rúcula", "Homus"],
    adicionais: [{ id: "tomate", nome: "Tomate confit", preco: 300 }, { id: "abacate", nome: "Abacate", preco: 500 }],
    selo: "Vegano",
  },

  // ---------- Do forno ----------
  {
    id: "pao-de-queijo",
    categoria: "forno",
    nome: "Pão de queijo",
    descricao: "Polvilho azedo e queijo canastra, saindo do forno a cada 20 minutos.",
    preco: 700,
    foto: "/fotos/pao-de-queijo.webp",
    buscaFoto: "brazilian cheese bread pao de queijo",
    opcoes: [{ id: "qtd", titulo: "Porção", padrao: "1", itens: [{ id: "1", nome: "1 unidade", acrescimo: 0 }, { id: "3", nome: "3 unidades", acrescimo: 1100 }, { id: "6", nome: "6 unidades", acrescimo: 2600 }] }],
    adicionais: [{ id: "requeijao", nome: "Recheio de requeijão", preco: 300 }, { id: "goiabada", nome: "Recheio de goiabada", preco: 300 }],
    selo: "Mais pedido",
    destaque: true,
  },
  {
    id: "croissant",
    categoria: "forno",
    nome: "Croissant na manteiga",
    descricao: "Massa folhada de fermentação longa, assado aqui toda manhã.",
    preco: 1200,
    foto: "/fotos/croissant.webp",
    buscaFoto: "butter croissant bakery",
    opcoes: [{ id: "tipo", titulo: "Como", padrao: "puro", itens: [{ id: "puro", nome: "Puro", acrescimo: 0 }, { id: "misto", nome: "Recheado de presunto e queijo", acrescimo: 800 }] }],
    adicionais: [{ id: "geleia", nome: "Geleia da casa", preco: 300 }],
  },
  {
    id: "esfiha",
    categoria: "forno",
    nome: "Esfiha aberta de carne",
    descricao: "Carne temperada com limão e hortelã, massa fina. Herança dos vizinhos da Penha.",
    preco: 900,
    foto: "/fotos/esfiha.webp",
    buscaFoto: "lebanese meat flatbread sfiha",
    remover: ["Cebola"],
    adicionais: [{ id: "coalhada", nome: "Coalhada seca", preco: 400 }],
  },

  // ---------- Doces ----------
  {
    id: "bolo-fuba",
    categoria: "doces",
    nome: "Bolo de fubá com goiabada",
    descricao: "Fatia generosa, cremoso no meio, goiabada cascão derretida por cima.",
    preco: 1100,
    foto: "/fotos/bolo-fuba.webp",
    buscaFoto: "cornmeal cake slice",
    remover: ["Goiabada"],
    adicionais: [{ id: "requeijao", nome: "Requeijão por cima (Romeu e Julieta)", preco: 300 }],
  },
  {
    id: "sonho",
    categoria: "doces",
    nome: "Sonho de creme",
    descricao: "Massa frita leve, creme de baunilha e açúcar de confeiteiro. O da padaria, só que melhor.",
    preco: 1000,
    foto: "/fotos/sonho.webp",
    buscaFoto: "cream filled donut powdered sugar",
    opcoes: [{ id: "recheio", titulo: "Recheio", padrao: "creme", itens: [{ id: "creme", nome: "Creme", acrescimo: 0 }, { id: "doce-leite", nome: "Doce de leite", acrescimo: 100 }, { id: "goiabada", nome: "Goiabada", acrescimo: 0 }] }],
    remover: ["Açúcar de confeiteiro"],
    destaque: true,
  },
  {
    id: "brigadeiro",
    categoria: "doces",
    nome: "Brigadeiro de colher",
    descricao: "Chocolate 50%, ponto mole, com uma pitada de flor de sal. Vem no potinho.",
    preco: 900,
    foto: "/fotos/brigadeiro.webp",
    buscaFoto: "chocolate brigadeiro spoon jar",
    remover: ["Flor de sal"],
    adicionais: [{ id: "espresso", nome: "Shot de espresso por cima (affogato)", preco: 500 }],
  },
];

// Combos (opcional na home: "Pra levar de manhã")
export const combos = [
  { id: "combo-balcao", nome: "Combo balcão", itens: ["pingado", "pao-na-chapa"], preco: 1600, descricao: "Pingado + pão na chapa. O café da manhã de São Paulo." },
  { id: "combo-misto", nome: "Combo misto", itens: ["cappuccino", "misto-quente"], preco: 2800, descricao: "Cappuccino M + misto quente." },
];

export const formatarPreco = (centavos: number) =>
  (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
