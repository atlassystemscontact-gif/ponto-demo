# Ponto, café & chapa (site de demonstração)

## O que é
Cafeteria fictícia na Penha, São Paulo: o balcão da padaria paulistana (pão na chapa, misto, pingado) com café especial da Mantiqueira. Site de portfólio da Atlas Systems mostrando um site completo de cafeteria com pedido online.

## Público
De 22 a 45 anos, passa de manhã a caminho do trabalho; o pessoal do bairro no fim de semana. Pede pelo celular, quer o preço na hora e customizar sem explicar no balcão.

## Ações principais
1. Montar o pedido (com personalização de cada item) e enviar pelo WhatsApp.
2. Retirar no balcão ou receber na Penha.
3. Encomendar (bolo, panetone, torta, cesta, kit) com data e janela marcadas, confirmando com sinal via Pix. Página `/encomendas`: é a demo que a Atlas mostra a confeitarias e padarias.

## Tom
Paulistano, curto, humor seco. "Pão na chapa. Café no ponto." Nada de "experiência sensorial única".

## Restrições
- Tudo é de exemplo: preços, endereço, telefone, horários. Isso aparece no rodapé, no cardápio, no pedido e na seção Visite.
- Nenhum pagamento online. O pedido vira uma mensagem de WhatsApp.
- Contatos e taxa: `src/lib/data.ts`. Cardápio: `src/lib/cardapio.ts` (fonte única). Encomendas: `src/lib/encomendas.ts` (fonte única).
- Encomenda: o site não cobra nada. Mostra o sinal (% em `data.ts`), avisa que só confirma após o Pix e manda tudo no WhatsApp com o código `[Origem: site | Pedido #AAAA-MM-DD-XXX]` para contar pedidos vindos do site. Sem backend: nada fica guardado fora do navegador do cliente (a sacola, com o texto do bolo/cartão, fica só no localStorage dele).
