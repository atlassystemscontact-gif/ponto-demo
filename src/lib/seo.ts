// Título e descrição de compartilhamento (Open Graph e Twitter) por página.
// No Next, a página que define `openGraph` substitui o objeto inteiro do layout, inclusive a imagem
// herdada de app/opengraph-image.tsx. Por isso o helper repete site, idioma e tipo e aponta a imagem
// padrão. Páginas com imagem própria (app/encomendas/opengraph-image.tsx) passam `imagemPadrao: false`.
import type { Metadata } from "next";
import { loja } from "./data";

export const SITE_URL = "https://ponto-demo.vercel.app";

const ALT_PADRAO = "ponto. Pão na chapa. Café no ponto. Cafeteria na Penha, São Paulo.";

export function compartilhar({
  titulo,
  descricao,
  caminho,
  imagemPadrao = true,
}: {
  titulo: string;
  descricao: string;
  caminho: string;
  imagemPadrao?: boolean;
}): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: loja.nome,
      title: titulo,
      description: descricao,
      url: caminho,
      ...(imagemPadrao ? { images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: ALT_PADRAO, type: "image/jpeg" }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descricao,
      ...(imagemPadrao ? { images: [{ url: "/twitter-image", alt: ALT_PADRAO }] } : {}),
    },
  };
}
