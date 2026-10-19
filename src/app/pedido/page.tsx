import type { Metadata } from "next";
import { compartilhar } from "@/lib/seo";
import { Pedido } from "./Pedido";

const titulo = "Finalizar pedido · Ponto, café & chapa";
const descricao = "Retirada no balcão, entrega ou encomenda com data marcada. O pedido sai pronto no WhatsApp.";

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  ...compartilhar({ titulo, descricao, caminho: "/pedido" }),
};

export default function Page() {
  return <Pedido />;
}
