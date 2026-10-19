import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/hanken-grotesk/index.css";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ItemSheet } from "@/components/ItemSheet";
import { CartFab } from "@/components/CartFab";
import { AVISO_DEMO, DEMO } from "@/lib/data";

export const metadata: Metadata = {
  title: "Ponto, café & chapa · Penha, São Paulo",
  description: "Pão na chapa, misto quente e café especial da Mantiqueira. Monte seu pedido e retire no balcão ou receba na Penha. (Site de demonstração.)",
  // demonstração fora dos buscadores (o robots.txt libera o rastreamento para a meta ser lida)
  robots: DEMO ? { index: false, follow: false, googleBot: { index: false, follow: false } } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#120c09",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body data-demo={DEMO || undefined}>
        {DEMO && (
          <p className="faixa-demo" role="note">
            {AVISO_DEMO}
          </p>
        )}
        <CartProvider>
          <a href="#conteudo" className="sr-only">
            Pular para o conteúdo
          </a>
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
          <CartFab />
          <CartDrawer />
          <ItemSheet />
        </CartProvider>
      </body>
    </html>
  );
}
