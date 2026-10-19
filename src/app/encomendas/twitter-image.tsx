// Mesma imagem de app/encomendas/opengraph-image.tsx, para o card do X/Twitter.
import { imagemOg } from "@/lib/og";
import { vitrine } from "@/lib/encomendas";

export const alt = "ponto. Encomendas de Natal: panetone, bolo, torta, cesta e kit presente com data marcada.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function Image() {
  return imagemOg({ fundo: "encomendas", titulo: [vitrine.titulo[0], vitrine.titulo[1]], sub: "Panetone, bolo, torta, cesta e kit presente. Marque a data e confirme com sinal via Pix." });
}
