// Dados de contato e operação. Tudo aqui é de EXEMPLO (site de demonstração da Atlas Systems).

// Modo demonstração. Com true: faixa fixa de aviso em todas as páginas, "[DEMO]" no começo de toda
// mensagem de WhatsApp e site fora dos buscadores (noindex/nofollow + robots.txt).
// Para um cliente real no ar: false (e troque endereço, WhatsApp e chave Pix).
export const DEMO = true;
export const AVISO_DEMO = "Site de demonstração da Atlas Systems. Produtos, preços e Pix fictícios.";

export const WHATSAPP = "5511930534679"; // troque pelo número real (só dígitos, com 55 + DDD)

export const loja = {
  nome: "Ponto, café & chapa",
  endereco: "Rua Exemplo, 123", // FICTÍCIO. Formato "Rua, número": a seção Visite separa os dois
  bairro: "Penha, São Paulo",
  referencia: "Endereço fictício, criado para esta demonstração.", // linha abaixo do bairro (ex.: ponto de referência)
  mapa: "", // link do Google Maps do endereço real; vazio = sem botão "Como chegar"
  horarios: [
    { dias: "Seg a sex", horas: "6h30 às 19h" },
    { dias: "Sábado", horas: "7h às 14h" },
    { dias: "Domingo", horas: "Fechado (a chapa descansa)" },
  ],
  taxaEntrega: 600, // centavos, raio de 2 km
  tempoPreparo: "5 a 10 min",
  // Encomendas (/encomendas). Catálogo e agenda ficam em ./encomendas.ts.
  encomendas: {
    sinalPercentual: 50, // % do total pago via Pix para confirmar a encomenda
    chavePix: "encomendas@exemplo.com.br", // EXEMPLO: troque pela chave real
    taxaEntrega: 1500, // centavos
    areaEntrega: "Zona Leste",
  },
};
