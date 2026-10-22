// Mesma imagem de app/encomendas/opengraph-image.tsx, para o card do X/Twitter.
import { imagemOg } from "@/lib/og";
import { vitrine } from "@/lib/encomendas";

export const alt = "Confeitaria Artesanal da Ka: encomende seu bolo com data marcada.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function Image() {
  return imagemOg({ fundo: "encomendas", titulo: [vitrine.titulo[0], vitrine.titulo[1]], sub: "Bolo Vulcão, cenoura com brigadeiro e chocolatudo. Marque o dia e o pedido chega pronto no WhatsApp." });
}
