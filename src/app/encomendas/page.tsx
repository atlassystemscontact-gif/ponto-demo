import type { Metadata } from "next";
import { vitrine } from "@/lib/encomendas";
import { compartilhar } from "@/lib/seo";
import { Encomendas } from "./Encomendas";

const titulo = `${vitrine.chamada} · Ponto, café & chapa`;

export const metadata: Metadata = {
  title: titulo,
  description: vitrine.subtitulo,
  ...compartilhar({ titulo, descricao: vitrine.subtitulo, caminho: "/encomendas", imagemPadrao: false }), // imagem própria: ./opengraph-image.tsx
};

export default function Page() {
  return <Encomendas />;
}
