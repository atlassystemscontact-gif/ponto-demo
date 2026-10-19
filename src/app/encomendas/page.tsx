import type { Metadata } from "next";
import { vitrine } from "@/lib/encomendas";
import { Encomendas } from "./Encomendas";

export const metadata: Metadata = {
  title: `${vitrine.chamada} · Ponto, café & chapa`,
  description: vitrine.subtitulo,
};

export default function Page() {
  return <Encomendas />;
}
