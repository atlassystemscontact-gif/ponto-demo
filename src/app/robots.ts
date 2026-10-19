import type { MetadataRoute } from "next";

// O rastreamento fica liberado de propósito: o buscador precisa ler a página para ver a meta
// "noindex, nofollow" (ligada à flag DEMO em src/lib/data.ts, aplicada em app/layout.tsx).
// Bloquear aqui impediria a leitura da meta e o endereço ainda poderia aparecer na busca.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" } };
}
