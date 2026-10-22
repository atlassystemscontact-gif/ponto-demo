import type { NextConfig } from "next";

// Prévia da Confeitaria da Ka: só a página de encomendas existe para ela.
const nextConfig: NextConfig = {
  async redirects() {
    return ["/", "/cardapio"].map((source) => ({ source, destination: "/encomendas", permanent: false }));
  },
};

export default nextConfig;
