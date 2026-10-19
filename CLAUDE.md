# Ponto, café & chapa: regras do projeto

Responda em português. Este é um site de demonstração da Atlas Systems (cafeteria fictícia).

## Antes de mexer
Leia `docs/PRODUCT.md`, `docs/DESIGN.md` e `docs/MAPA-DE-REFERENCIAS.md`. O mapa diz de onde veio cada elemento visual; não troque um elemento sem atualizar o mapa.

## Stack
Next.js 16 (App Router, TypeScript), CSS Modules + tokens em `src/app/globals.css`, Motion (`motion/react`), Three.js + React Three Fiber (xícara 3D), `@shadergradient/react` (um único lugar), fontes via @fontsource. Sem Tailwind de propósito: os tokens do DESIGN.md são a fonte de verdade.

## Onde fica cada coisa
- Cardápio (itens, preços, opções, "sem...", adicionais): `src/lib/cardapio.ts` (fonte única)
- Regras de preço, resumo do item e mensagem do WhatsApp: `src/lib/pedido.ts`
- Sacola (estado, localStorage), painel do item: `src/lib/cart.tsx`
- Contatos, horários, taxa de entrega, número do WhatsApp: `src/lib/data.ts` (inclui `loja.encomendas`: sinal %, chave Pix, taxa e área de entrega)
- Modo demonstração: `DEMO` em `src/lib/data.ts` liga a faixa de aviso (`.faixa-demo` em `globals.css`, renderizada em `app/layout.tsx`), o prefixo `[DEMO]` nas mensagens e a meta noindex/nofollow (`app/layout.tsx`). O `app/robots.ts` libera o rastreamento: não bloqueie, senão o buscador não lê a meta. Endereço da loja é fictício.
- Encomendas (produtos, tamanhos, sabores, mensagem, prazos, janelas, dias fechados, textos da vitrine): `src/lib/encomendas.ts` (fonte única, só dados)
- Regras de data das encomendas (prazo, dias, janelas, motivo do bloqueio): `src/lib/agenda.ts`; calendário em `src/components/encomendas/Agenda.tsx`
- Sinal, código de rastreio e mensagem da encomenda: `src/lib/pedido.ts` (`valorSinal`, `codigoPedido`, `mensagemEncomenda`)
- Seções da home: `src/components/home/`
- Componentes de efeito (Card Swap, Counter, Tilted Card, Reveal): `src/components/ui/`
- Logo e favicon: `src/components/Logo.tsx`, `src/app/icon.svg`, conceitos em `docs/marca/`
- Fotos: `public/fotos/` (créditos em `docs/CREDITOS.md`; tratamento em `scripts/tratar-fotos.mjs`)

## Regras que não podem quebrar
1. Todo efeito respeita `prefers-reduced-motion` e tem alternativa sem WebGL.
2. Hover só com mouse (`@media (hover: hover) and (pointer: fine)`). Nada de efeito que dependa de hover para funcionar no celular.
3. Um momento autoral por seção. Não somar efeitos novos por cima dos que existem.
4. Títulos: sans fino + uma palavra em `<em>` (serif itálico). Não usar "eyebrow" decorativo acima de todo título.
5. Cor de destaque (`--accent`) só como pontuação (grão do logo, contadores, foco).
6. Preço sempre calculado por `precoUnitario()`; nunca duplicar regra de preço em componente.
7. Testar 1440px e 390px, sem rolagem lateral, console sem erros. Rodar `npx impeccable detect src` (hoje: 0 problemas).

## Pendências conhecidas (para a próxima rodada)
- Rodar `/impeccable audit` e `/impeccable polish` (não deu para rodar onde o site foi construído).
- Watermelon UI: se quiser trocar os inputs/stepper pelos deles, use o MCP (mcp.watermelon.sh) e adapte aos tokens.
- Logo: conceito A aplicado como provisório. Gabriel ainda escolhe entre A, B e C (`docs/marca/concepts.png`). Depois rodar a fase 7 (kit) da skill logo-design.
- Fotos de banco são ilustrativas em alguns itens (ver CREDITOS.md). Para cliente real: fotos próprias.
- Deploy na Vercel só com aprovação do Gabriel.
- Encomendas: o calendário e a vitrine usam o relógio do navegador; quando tiver backend, conferir prazo e agenda no servidor também.

## Padrão para reduced-motion sem erro de hidratação
O servidor não sabe se o visitante usa reduced-motion. Nunca use `initial={reduz ? false : ...}` nem estilo que mude com `reduz` no primeiro render: mantenha o mesmo estado inicial e, com `reduz`, use `transition={{ duration: 0 }}` (ou uma faixa constante em `useTransform`). Exemplos: `ui/Reveal.tsx`, `home/Hero.tsx`, `home/TelaCheia.tsx`.
