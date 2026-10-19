# Ponto, café & chapa: site de demonstração

Site completo de cafeteria fictícia (Next.js 16) feito pela Atlas Systems para portfólio: home com efeitos, cardápio real com personalização de cada item, encomendas com data marcada, sacola e pedido pelo WhatsApp.

## Rodar no seu computador
```
npm install
npm run dev
```
Abra http://localhost:3000

## Páginas
- `/`: home (herói dividido, capítulos com xícara 3D, tela cheia, categorias, mais pedidos, como pedir, visite)
- `/cardapio`: cardápio completo com filtros; clicar num item abre o painel de personalização
- `/encomendas`: bolos, panetones, tortas, cestas e kits com data marcada (a demo para confeitarias e padarias)
- `/pedido`: retirada ou entrega, dados, resumo e envio pelo WhatsApp. Com encomenda na sacola: calendário, janela de horário e sinal via Pix

## Onde mudar as coisas
| O quê | Onde |
|---|---|
| Itens, preços, opções, "sem...", adicionais | `src/lib/cardapio.ts` |
| Encomendas: produtos, tamanhos, sabores, mensagem, prazos, dias e janelas, dias fechados, textos da página | `src/lib/encomendas.ts` |
| Sinal (%), chave Pix, taxa e área de entrega das encomendas | `src/lib/data.ts` (`loja.encomendas`) |
| Número do WhatsApp, endereço, horários, taxa de entrega | `src/lib/data.ts` |
| Cores, fontes, raios, curvas de animação | `src/app/globals.css` (resumo em `docs/DESIGN.md`) |
| Logo | `src/components/Logo.tsx` e `src/app/icon.svg` |
| Fotos | `public/fotos/` (padronize novas com `node scripts/tratar-fotos.mjs <pasta-com-jpgs>`) |

## Encomendas: trocar para outro cliente (menos de 1 hora)

São **2 arquivos de dados** e as fotos. Nenhum componente precisa mudar.

**1. `src/lib/data.ts`** (contatos e dinheiro)
- `WHATSAPP`: número que recebe os pedidos (só dígitos, com 55 + DDD).
- `loja.nome`: aparece no topo da mensagem da encomenda.
- `loja.encomendas.sinalPercentual`: % do sinal (ex.: 50). O site mostra o valor e avisa que só confirma depois do Pix.
- `loja.encomendas.chavePix`: aparece na tela final, com botão de copiar.
- `loja.encomendas.taxaEntrega` (centavos) e `areaEntrega` (ex.: "Zona Leste").

**2. `src/lib/encomendas.ts`** (catálogo e agenda)
- `vitrine`: título da página e do bloco da home (a 2ª parte do título sai em itálico), subtítulo, foto da home, texto do botão flutuante.
- `agenda.janelas`: janelas de retirada e de entrega (`id`, nome, início e fim em "HH:MM").
- `agenda.horizonteDias`: até quantos dias à frente aceita pedido. `agenda.fechado`: dias sem retirada/entrega, com o motivo que aparece no calendário.
- `produtos`: um objeto por item. Campos:
  - `tamanhos`: `{ id, nome, preco }` com o **preço cheio** de cada tamanho (centavos). Um tamanho só = sem escolha.
  - `sabores` (opcional): `{ titulo, itens: [{ id, nome, acrescimo? }] }`. O título vira o nome do grupo ("Sabor", "Recheio", "Café").
  - `mensagem` (opcional): `{ rotulo, limite, dica?, preco? }`. Ex.: "Escrita no bolo", 30 caracteres. Com `preco`, cobra quando o cliente escreve.
  - `adicionais` e `remover` (opcionais): iguais aos do cardápio.
  - `prazoHoras`: antecedência mínima. O calendário bloqueia o que não dá tempo e explica o motivo.
  - `retirada` / `entrega`: `{ dias: [0..6], janelas: ["id", ...] }` (0 = domingo). Sem a chave, o item não tem aquele modo.
  - `temporada` (tag no cartão, ex.: "Natal") e `ultimaData` ("AAAA-MM-DD", último dia em que sai).

**3. Fotos**: coloque os .jpg numa pasta e rode `node scripts/tratar-fotos.mjs <pasta>`. Saem em `public/fotos/` com o mesmo nome, em .webp. Atualize `docs/CREDITOS.md`.

**Conferir**: `npm run dev`, abra `/encomendas`, coloque um item de cada na sacola e finalize. O calendário deve bloquear os dias certos e a mensagem deve sair completa.

O preço sempre passa por `precoUnitario()` (`src/lib/pedido.ts`) e as regras de data ficam em `src/lib/agenda.ts`. Para trocar de cliente, não precisa mexer em nenhum dos dois.

### Como sai a mensagem da encomenda
```
*Encomenda · Ponto, café & chapa*
Pedido #2026-10-19-YEJ

*Itens*
1x Bolo de Natal ... R$ 204,00
   - Tamanho: M · serve 15
   - Recheio: Frutas vermelhas e baunilha
   - Escrita no bolo: "Feliz Natal, família!"
1x Kit presente do Ponto ... R$ 144,00
   - Café: Em grãos
   - Cartão escrito à mão: "Vó, obrigado pelo ano. Com carinho, Ana"

*Quando*
Retirada no balcão
Data: qui, 24/12/2026
Janela: Manhã (8h às 11h)

Nome: Ana

Subtotal ... R$ 348,00
*Total: R$ 348,00*
*Sinal (50%) via Pix: R$ 174,00*
Restante na retirada: R$ 174,00
A encomenda só é confirmada depois do sinal.

[Origem: site | Pedido #2026-10-19-YEJ]
```
A última linha é o código de rastreio: data do pedido + sufixo de 3 caracteres gerado no navegador. Serve para a confeitaria (e a Atlas) contar quantos pedidos vieram do site, buscando "Origem: site" no WhatsApp. Não há backend nem coleta de dados além do que o cliente digita e envia.

## Modo demonstração (`DEMO` em `src/lib/data.ts`)
Com `DEMO = true` (hoje):
- faixa fixa no pé de todas as páginas: "Site de demonstração da Atlas Systems. Produtos, preços e Pix fictícios." (texto em `AVISO_DEMO`);
- toda mensagem de WhatsApp começa com `[DEMO]`;
- site fora dos buscadores: meta `noindex, nofollow` em todas as páginas. O `robots.txt` (`src/app/robots.ts`) libera o rastreamento de propósito, para o buscador conseguir ler a meta.

O endereço da loja também é fictício (`Rua Exemplo, 123`) e, sem `loja.mapa`, a seção Visite não mostra o botão "Como chegar". Para pôr um cliente real no ar: `DEMO = false`, endereço, `mapa`, `WHATSAPP` e chave Pix reais em `data.ts`.

## Publicar na Vercel
Só com aprovação do Gabriel.
```
npx vercel
```

## O que é de mentira
Nome, preços, endereço, telefone e horários são de exemplo. Nada é cobrado: o pedido vira uma mensagem de WhatsApp. Fotos do Unsplash (créditos em `docs/CREDITOS.md`).

## Documentação
- `docs/BRIEF.md`: o brief original
- `docs/PRODUCT.md`, `docs/DESIGN.md`: produto e sistema visual
- `docs/MAPA-DE-REFERENCIAS.md`: de qual referência veio cada elemento
- `docs/marca/`: os 3 conceitos de logo (skill logo-design)
- `docs/prints/`: prints desktop e celular (os de encomenda começam com `encomenda` e `home-encomendas`)
- `CLAUDE.md`: regras para o Claude Code continuar o projeto
