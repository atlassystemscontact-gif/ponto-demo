# Brief: Ponto, café & chapa (site de demonstração Atlas Systems)

Leia este arquivo inteiro antes da Etapa 0 do /criar-site. Ele já responde a Etapa 0 e boa parte da Etapa 1.
O arquivo `cardapio.ts` (nesta mesma pasta) é o cardápio real: copie para `src/lib/cardapio.ts` e use como fonte única.

## Etapa 0 (já respondida)
- Tipo: site (home + cardápio + carrinho + checkout simulado).
- Cliente: fictício (portfólio Atlas). Preços, endereço, telefone e horários são de exemplo e aparecem marcados assim no rodapé e no checkout.
- Ação principal: montar o pedido no carrinho e enviar pelo WhatsApp (retirada no balcão ou entrega no bairro).
- Logo: NÃO existe. Rode a skill `logo-design` (Etapa 2) usando a seção "Marca" abaixo.
- Fotos: NÃO existem. Baixe fotos reais do Unsplash/Pexels pela lista "Fotos" abaixo.

## Conceito
O balcão da padaria paulistana encontrado com o café especial.
Pão na chapa, misto quente e pingado, feitos com o mesmo cuidado de um café de terceira onda. Nada de "cafeteria instagramável genérica": o herói é a chapa, o balcão de fórmica e o café da Mantiqueira.

Nome: **Ponto**. Três sentidos que o site explora:
1. ponto de torra (o café),
2. ponto do pão na chapa (dourado, crocante),
3. ponto de encontro / ponto de ônibus (o café de passagem da manhã).

Local (exemplo): Rua Padre Benedito de Camargo, Penha, São Paulo. Seg a sex 6h30 às 19h, sáb 7h às 14h.

## Público
Gente de 22 a 45 anos que passa de manhã a caminho do trabalho, e o pessoal do bairro no fim de semana. Pede pelo celular, quer saber o preço na hora e customizar sem ter que explicar no balcão ("sem manteiga", "leite de aveia").

## Tom
Paulistano, curto, com humor seco. "Pão na chapa. Ponto." Nada de "experiência sensorial única".

## Marca (entrada para a skill logo-design)
- Wordmark "Ponto" com um ponto final que vira um grão de café ou uma gema de ovo (decidir no conceito).
- Deve funcionar em carimbo de copo de papel, em placa de fachada e como favicon (só o ponto).
- Paleta de partida (a skill pode propor ajuste): café torrado #2B1B14, creme de leite #F4EDE1, dourado de chapa #D9A441, vermelho de fórmica #C8432B, verde de azulejo #2F5D50.
- Tipografia: um display serifado com itálico forte (para a palavra de destaque, estilo Morpho "A world *opens*") + um sans limpo para texto e preços.

## Referências e o que tirar de cada uma (inspiração, não cópia)
### morphowater.com
- Rolagem em capítulos: um objeto fica PARADO no centro (sticky) enquanto os textos trocam dos lados. Índice vertical "01 / 07" na lateral esquerda e nome do capítulo embaixo ("01 — O grão").
- Título grande em sans fino com UMA palavra em serif itálico ("Pão na chapa. *No ponto.*").
- Fundo escuro com vinheta suave atrás do objeto.
- Depois dos capítulos, transição para uma foto em tela cheia com título por cima.
- Nav em pílula de vidro no topo central; botão flutuante fixo no canto inferior direito ("Fazer pedido" com contador do carrinho).
- Para o Ponto: o objeto central é uma XÍCARA (foto recortada em PNG com fundo transparente, ou xícara 3D simples em Three.js). Capítulos: 01 O grão, 02 A torra, 03 A chapa, 04 O balcão. A cada capítulo a xícara gira ou troca (café, pingado, cappuccino) e a cor do fundo muda levemente.

### bluntumbrellas.com
- Herói dividido: título enorme em duas linhas de um lado, foto editorial sangrando do outro.
- Carrossel de produtos limpo, com bolinhas de variação (no Ponto: tamanho P/M/G ou tipo de leite direto no card).
- Faixa de 3 valores com ícone de linha (no Ponto: "Café da Mantiqueira", "Pão do dia, assado aqui", "Pronto em 5 min").
- Muito respiro, superfícies claras na parte de compra (cardápio e carrinho ficam CLAROS; o escuro cinematográfico é só na história da home).

## Páginas
1. `/` Home: herói dividido (Blunt) → capítulos com a xícara sticky (Morpho) → foto em tela cheia "Das 6h30 até acabar o pão" → destaque de 6 itens do cardápio em carrossel → faixa de valores → como pedir (3 passos) → localização e horário → rodapé.
2. `/cardapio`: filtros por categoria (pílulas), grade com foto, nome, descrição curta, preço "a partir de". Clicar abre o painel do item (ver abaixo).
3. Carrinho: gaveta lateral + página `/pedido` com retirada ou entrega, nome, WhatsApp, observação, horário de retirada. Botão final gera a mensagem e abre `wa.me` com o pedido formatado. Checkout NÃO cobra nada.

## Painel do item (o coração do pedido)
Abre como sheet (lateral no desktop, de baixo no celular), com:
- Foto grande, nome, descrição, preço base.
- `opcoes` (escolha única, obrigatória quando existir): tamanho, tipo de pão, tipo de leite. Mostrar o acréscimo (+R$ 2,00) ao lado.
- `remover` (checkboxes "Sem ..."): ingredientes que vêm no item. Remover não muda preço.
- `adicionais` (checkboxes com preço): extras pagos. Respeitar `max` quando houver.
- Observação livre (até 140 caracteres).
- Quantidade (− 1 +) e botão "Adicionar · R$ total" com o total recalculando ao vivo.
- No carrinho, cada linha mostra a configuração em texto ("Leite de aveia · Sem açúcar · +1 shot") e permite editar ou remover. Dois itens iguais com configuração diferente são linhas diferentes; iguais somam quantidade.
- Carrinho salvo em localStorage (com try/catch).

## Mensagem do WhatsApp (formato)
```
Pedido Ponto #1234
Retirada às 8h15 (ou: Entrega: Rua X, 100)
Nome: Maria

2x Cappuccino (M) · Leite de aveia · +1 shot ... R$ 41,00
1x Pão na chapa · Pão de fermentação natural · Sem manteiga ... R$ 13,00

Total: R$ 54,00
Obs: ...
```
O número fica numa constante única `WHATSAPP` em `src/lib/data.ts`.

## Fotos (Unsplash ou Pexels, uso comercial livre; registrar em CREDITOS.md)
Regra de ouro: as fotos têm que parecer da MESMA cafeteria. Escolha todas com luz quente, fundo escuro ou madeira, mesma temperatura. Depois aplique o mesmo tratamento em todas (ex.: `sharp` com leve ajuste de saturação e temperatura, ou um filtro CSS único). Se uma foto destoar, troque, não force.

Busca sugerida (termos em inglês funcionam melhor):
- Herói: "barista pouring latte art dark", "coffee shop counter morning light"
- Xícara para recorte sticky: "espresso cup top view isolated", "ceramic coffee cup plain background"
- Capítulos: "green coffee beans hands", "coffee roasting drum", "toast butter griddle", "diner counter formica"
- Tela cheia: "bakery bread basket morning", "coffee shop window street"
- Cardápio, uma por item (ver `foto` em cada item do cardapio.ts). Para itens brasileiros que não existirem bem fotografados (pão na chapa, misto quente, pingado), use a foto genérica mais próxima ("toasted bread roll butter", "ham cheese toasted sandwich", "coffee with milk glass") e anote no CREDITOS.md que é foto ilustrativa.
- Salve em `public/fotos/` como .webp, largura máxima 1600px.

## Efeitos (limites)
- ShaderGradient: NÃO usar aqui. O momento autoral é a xícara sticky com capítulos. Um efeito forte só.
- Rolagem: CSS `position: sticky` + IntersectionObserver ou Motion `useScroll`. Sem biblioteca pesada de scroll-jacking. Não sequestrar a rolagem do usuário.
- Revelar títulos por linha (mask), contador de capítulo, troca de fundo suave. Tudo com prefers-reduced-motion (sem movimento: capítulos viram blocos normais empilhados).
- Botão flutuante do carrinho: "pula" de leve ao adicionar item (Emil: 200ms, ease-out).
- Mobile: capítulos viram foto em cima e texto embaixo, xícara menor. Testar em 390px.

## Fora do escopo
Pagamento real, login, painel admin, programa de fidelidade, blog.
