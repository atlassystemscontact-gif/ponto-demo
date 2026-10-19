import type { Metadata } from "next";
import { Cardapio } from "./Cardapio";

export const metadata: Metadata = {
  title: "Cardápio · Ponto, café & chapa",
  description: "Cafés, pão na chapa, misto quente, pão de queijo e doces. Monte do seu jeito e peça pelo WhatsApp.",
};

export default function Page() {
  return <Cardapio />;
}
