# Design: Ponto, café & chapa

## Ideia
O balcão da padaria paulistana com café especial. Duas temperaturas:
- **Escuro, cinematográfico** onde se conta a história (capítulos, foto em tela cheia, como pedir, rodapé).
- **Claro, pergaminho quente** onde se compra (herói, cardápio, painel do item, sacola, pedido).

Títulos "sussurram": sans fino (peso 300) grande, com **uma** palavra ou frase em serif itálico (assinatura vinda da Morpho). A emoção vem das fotos, não de cor.

## Cores (tokens em `src/app/globals.css`)
| Token | Hex | Uso |
|---|---|---|
| `--paper` | #fbf7f0 | Fundo claro (nunca branco puro) |
| `--cream` / `--cream-2` | #f3ebdd / #ebe0cd | Rodapé da sacola, resumo do pedido, hovers |
| `--ink` | #2b1b14 | Texto e botão principal (café torrado) |
| `--ink-2` | #6b5a4e | Texto secundário (contraste ~6:1 no papel) |
| `--night` / `--night-2` / `--night-3` | #120c09 / #1d1410 / #2a1d17 | Superfícies escuras |
| `--on-night` / `--on-night-2` | #f4ede1 / 66% | Texto no escuro |
| `--accent` | #c8432b | Vermelho fórmica: o grão do logo, contadores, foco. Usar pouco |
| `--gold` | #d9a441 | Dourado de chapa: rótulos de capítulo no escuro |

## Tipografia
- **Hanken Grotesk Variable** (texto e títulos, peso 300 nos títulos, tracking -0.035em, entrelinha 0.98).
- **Fraunces Variable** (palavra em itálico dos títulos, nomes dos itens e logo). Eixos: `SOFT 100`, `WONK 1`, `opsz 144` no itálico.
- Escala fluida `--step--1` a `--step-5`.

## Forma
- Raio 18px (cartões), 22–24px (painéis), pílula em botões e filtros.
- Bordas finas quentes (`--line`), sem sombra pesada; sombra só em painéis flutuantes.
- Textura de grão (SVG feTurbulence, estilo Haikei) sobre as superfícies escuras: classe `.grain`.

## Movimento (curvas das skills do Emil)
- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` para quase tudo; gaveta/painel `cubic-bezier(0.32, 0.72, 0, 1)` em 420ms.
- Botões: escala 0.97 no clique, 160ms. Hover só com mouse (`@media (hover: hover)`).
- Títulos sobem linha a linha por máscara (0.9s, intervalo 90ms).
- Um momento autoral por seção, nunca dois brigando: xícara 3D nos capítulos; gradiente 3D só em "Como pedir"; em /encomendas, o cartão do produto (Tilted Card). O calendário de encomenda não anima.
- `prefers-reduced-motion`: capítulos viram blocos estáticos com foto, gradiente congela, cartões não giram, nada se mexe sozinho.

## Componentes-chave
- Cabeçalho que encolhe (largura toda → pílula escura centralizada) com indicador deslizante.
- Botão flutuante "Fazer pedido" (canto inferior direito) com aviso quando um item entra na sacola.
- Painel do item: lateral no desktop, de baixo no celular; total rola os dígitos ao mudar.
- Cartão do cardápio: foto 4:3 (4:5 no carrossel), nome em Fraunces, "a partir de", bolinhas de variação, botão +. Em encomendas, mais uma linha com o prazo.
- Calendário de encomenda: grade de 7 colunas em cartão branco; dia livre em `--cream`, escolhido em `--ink`, bloqueado riscado em `--ink-2` (dá para focar e ler o motivo); foco em `--accent`.
