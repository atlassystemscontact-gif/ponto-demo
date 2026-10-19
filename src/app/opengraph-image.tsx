// Imagem de compartilhamento padrão (todas as páginas sem imagem própria). Ver src/lib/og.tsx.
import { imagemOg } from "@/lib/og";

export const alt = "ponto. Pão na chapa. Café no ponto. Cafeteria na Penha, São Paulo.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return imagemOg({ fundo: "home", titulo: ["Pão na chapa.", "Café no ponto."], sub: "Café da Mantiqueira e o balcão da padaria paulistana. Peça pelo site." });
}
