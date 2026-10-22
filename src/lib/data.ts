// Dados de contato e operação. Tudo aqui é de EXEMPLO (site de demonstração da Atlas Systems).

// Modo demonstração. Com true: faixa fixa de aviso em todas as páginas, "[DEMO]" no começo de toda
// mensagem de WhatsApp e site fora dos buscadores (meta noindex/nofollow; o robots.txt libera o rastreamento).
// Para um cliente real no ar: false (e troque endereço, WhatsApp e chave Pix).
export const DEMO = true;
export const AVISO_DEMO = "Prévia feita pela Atlas Systems para a Confeitaria Artesanal da Ka. Ainda não está no ar: Pix e taxa de entrega são de exemplo.";

export const WHATSAPP = "5511968063042"; // troque pelo número real (só dígitos, com 55 + DDD)

export const loja = {
  nome: "Confeitaria Artesanal da Ka",
  endereco: "Vila Rio Branco", // FICTÍCIO. Formato "Rua, número": a seção Visite separa os dois
  bairro: "Zona Leste, São Paulo",
  referencia: "Prévia: endereço completo a combinar.", // linha abaixo do bairro (ex.: ponto de referência)
  mapa: "", // link do Google Maps do endereço real; vazio = sem botão "Como chegar"
  horarios: [
    { dias: "Seg a sáb", horas: "9h às 21h" },
    { dias: "Domingo", horas: "10h às 21h" },
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
