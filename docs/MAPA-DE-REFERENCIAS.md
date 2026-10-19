# Mapa de referências: de onde veio cada elemento

Tudo é inspiração refeita em código próprio. Nenhum código pago foi copiado.

| Fonte | Elemento | Onde está no site | Arquivo |
|---|---|---|---|
| **morphowater.com** | Objeto fixo no centro enquanto a história rola (capítulos) | Home, seção "A história" | `src/components/home/Capitulos.tsx`, `Cup3D.tsx` |
| morphowater.com | Índice "01 / 04" na lateral + nome do capítulo com barra embaixo | Home, capítulos | `Capitulos.tsx` |
| morphowater.com | Título sans fino + palavra em serif itálico | Todos os títulos (`.display em`) | `src/app/globals.css` |
| morphowater.com | Transição para foto em tela cheia com título por cima | "Das 6h30 até acabar o pão." | `TelaCheia.tsx` |
| morphowater.com | Nav em pílula de vidro + botão flutuante no canto inferior direito | Cabeçalho e "Fazer pedido" | `Header.tsx`, `CartFab.tsx` |
| **bluntumbrellas.com** | Herói dividido: título enorme + foto sangrando | Topo da home | `Hero.tsx` |
| bluntumbrellas.com | Carrossel de produtos com bolinhas de variação e setas | "O que sai mais antes das nove." | `Destaques.tsx`, `ItemCard.tsx` |
| bluntumbrellas.com | Faixa de 3 valores com ícone de linha | Abaixo do carrossel | `Destaques.tsx` |
| **Superdesign Library** · Card Swap | Pilha de cartões que trocam sozinhos | Sobre a foto do herói ("Saindo agora") | `src/components/ui/CardSwap.tsx` |
| Superdesign · Flowing Menu | Categorias gigantes; no hover entra faixa corrida com itens e fotos pela borda de onde o mouse veio | "Seis gavetas, um balcão." | `FlowingMenu.tsx` |
| Superdesign · Image Trail | Fotos ficam no rastro do mouse | Seção "Visite" | `Visite.tsx` |
| Superdesign · Tilted Card | Cartão inclina seguindo o mouse | Todos os cartões do cardápio e de /encomendas (o momento autoral da página) | `src/components/ui/TiltedCard.tsx` |
| Superdesign · Pill Nav | Indicador que desliza entre os links | Cabeçalho (agora com "Encomendas") e filtros do cardápio | `Header.tsx`, `app/cardapio/Cardapio.tsx` |
| Superdesign · Shrinking Sticky Header | Cabeçalho encolhe para uma pílula ao rolar (no celular, barra sempre com fundo quase opaco + blur) | Cabeçalho | `Header.tsx` |
| Superdesign · Counter | Dígitos rolando quando o preço muda | Painel do item, sacola, pedido (inclui sinal da encomenda) | `src/components/ui/Counter.tsx` |
| Superdesign · Animated List | Itens entram e saem da sacola com mola | Sacola | `CartDrawer.tsx` |
| Superdesign · Staggered Menu | Links do menu do celular entram em sequência | Menu do celular | `Header.tsx` |
| **Motion Primitives** | Revelar texto por linha ao entrar na tela (TextEffect/InView) | Todos os títulos | `src/components/ui/Reveal.tsx` |
| **ShaderGradient** | Gradiente 3D animado cor de café | "Monte do seu jeito." | `ComoPedir.tsx` |
| **Haikei** (técnica, feito em código) | Borda de café escorrendo; textura de grão | Topo do rodapé; seções escuras | `Footer.tsx`, `.grain` em `globals.css` |
| **Refero Styles** · Superhuman ("golden hour editorial") | Princípios: fundo pergaminho (nunca branco), títulos que sussurram, foto faz o trabalho emocional, cor só como pontuação, bordas finas, sem sombras pesadas | Sistema todo | `docs/DESIGN.md` |
| **logo-design skill** | Conceito A "Ponto-grão": o ponto final do nome é um grão de café | Logo, favicon, botão flutuante | `src/components/Logo.tsx`, `docs/marca/` |
| **Watermelon UI** | Não usado direto (o ambiente de construção não alcançava o servidor deles). Os blocos equivalentes (sheet, gaveta, stepper, inputs) foram feitos à mão no padrão shadcn | Painel, sacola, pedido | ver nota no CLAUDE.md |
| **Cult UI Pro** | Só inspiração (sem licença): nada copiado | — | — |
| Skills do **Emil Kowalski** | Curvas, durações, escala no clique, hover só com mouse, reduced-motion | Todo o movimento | `globals.css`, componentes |

## Encomendas (/encomendas), adicionado em 19/10/2026

Nenhum efeito novo: a página reaproveita o que já existia. O calendário é controle de formulário, sem animação.

| Fonte | Elemento | Onde está no site | Arquivo |
|---|---|---|---|
| Superdesign · Tilted Card (reaproveitado) | Cartão do produto com foto, tag de temporada, "a partir de" e prazo | /encomendas | `src/components/ItemCard.tsx` |
| Painel do item (reaproveitado) | Preço cheio por tamanho, campo "Escrita no bolo"/"Cartão" com limite, aviso de prazo | Painel do item | `src/components/ItemSheet.tsx` |
| **WAI-ARIA APG** · Date Picker (padrão de teclado, feito à mão) | Calendário com setas, Home/End, PageUp/PageDown; dia bloqueado continua focável e explica o motivo | /pedido, bloco "Para quando?" | `src/components/encomendas/Agenda.tsx` |
| Cartões de "Como você quer receber?" (reaproveitado) | Janelas de retirada/entrega como cartões de escolha; janela fora do prazo tracejada | /pedido | `Agenda.tsx`, `app/pedido/pedido.module.css` |
| **bluntumbrellas.com** (herói dividido, reaproveitado em escala menor) | Bloco "Encomendas de Natal": foto + título + 3 fatos + botão | Home, entre "Os mais pedidos" e "Como pedir" | `src/components/home/EncomendasNatal.tsx` |
| Motion Primitives · TextEffect (reaproveitado) | Títulos da página e do bloco da home | /encomendas, home | `src/components/ui/Reveal.tsx` |

## Modo demonstração (adicionado em 19/10/2026)

| Fonte | Elemento | Onde está no site | Arquivo |
|---|---|---|---|
| Próprio (sem referência) | Faixa fixa escura no pé da tela com o aviso de demonstração; o botão flutuante sobe para ficar acima dela | Todas as páginas, enquanto `DEMO = true` | `src/app/layout.tsx`, `.faixa-demo` em `src/app/globals.css` |
