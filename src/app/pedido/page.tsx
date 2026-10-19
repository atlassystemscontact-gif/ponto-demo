import type { Metadata } from "next";
import { Pedido } from "./Pedido";

export const metadata: Metadata = {
  title: "Finalizar pedido · Ponto, café & chapa",
};

export default function Page() {
  return <Pedido />;
}
