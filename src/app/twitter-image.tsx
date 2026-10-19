// Mesma imagem de app/opengraph-image.tsx, para o card do X/Twitter. Ver src/lib/og.tsx.
import { imagemOg } from "@/lib/og";

export const alt = "ponto. Pão na chapa. Café no ponto. Cafeteria na Penha, São Paulo.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function Image() {
  return imagemOg({ fundo: "home", titulo: ["Pão na chapa.", "Café no ponto."], sub: "Café da Mantiqueira e o balcão da padaria paulistana. Peça pelo site." });
}
