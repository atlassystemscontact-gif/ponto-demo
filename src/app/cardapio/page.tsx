import type { Metadata } from "next";
import { compartilhar } from "@/lib/seo";
import { Cardapio } from "./Cardapio";

const titulo = "Cardápio · Ponto, café & chapa";
const descricao = "Cafés, pão na chapa, misto quente, pão de queijo e doces. Monte do seu jeito e peça pelo WhatsApp.";

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  ...compartilhar({ titulo, descricao, caminho: "/cardapio" }),
};

export default function Page() {
  return <Cardapio />;
}
