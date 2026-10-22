// Rodapé escuro com borda de "café escorrendo" gerada em SVG (técnica Haikei, feita em código).
import Link from "next/link";
import { Logo } from "./Logo";
import { loja } from "@/lib/data";
import s from "./Footer.module.css";

// Borda de café escorrendo: faixa ondulada com gotas finas de comprimentos variados.
// Determinística (sem Math.random) para não variar entre servidor e navegador.
function gotejo(largura = 1440, alto = 80) {
  const base = alto * 0.3;
  const gotas = [
    { x: 90, w: 22, h: 0.55 },
    { x: 260, w: 30, h: 0.9 },
    { x: 410, w: 18, h: 0.45 },
    { x: 610, w: 26, h: 0.75 },
    { x: 790, w: 20, h: 1.0 },
    { x: 980, w: 28, h: 0.6 },
    { x: 1150, w: 18, h: 0.85 },
    { x: 1330, w: 24, h: 0.5 },
  ];
  let d = `M0 0 H${largura} V${base}`;
  let x = largura;
  for (const g of [...gotas].reverse()) {
    const fim = base + (alto - base) * g.h;
    const dir = g.x + g.w;
    const esq = g.x - g.w;
    // onda suave até a gota
    d += ` C${(x + dir) / 2} ${base + 2} ${(x + dir) / 2} ${base - 2} ${dir + 14} ${base}`;
    // gota: desce fina, ponta redonda, sobe
    d += ` C${dir} ${base} ${g.x + g.w * 0.45} ${base + 8} ${g.x + g.w * 0.42} ${fim - g.w * 0.5}`;
    d += ` A${g.w * 0.42} ${g.w * 0.42} 0 0 1 ${g.x - g.w * 0.42} ${fim - g.w * 0.5}`;
    d += ` C${g.x - g.w * 0.45} ${base + 8} ${esq} ${base} ${esq - 14} ${base}`;
    x = esq - 14;
  }
  d += ` C${x / 2} ${base + 2} ${x / 2} ${base - 2} 0 ${base} Z`;
  return d;
}

export function Footer() {
  return (
    <footer className={s.footer}>
      <svg className={s.drip} viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d={gotejo()} />
      </svg>
      <div className={`wrap ${s.grid}`}>
        <div className={s.marca}>
          <Logo className={s.logo} />
          <p>Bolos caseiros fresquinhos, macios e molhadinhos, e o Bolo Vulcão explodindo de recheio.</p>
        </div>
        <div>
          <p className="label">Onde</p>
          <p>
            {loja.endereco}
            <br />
            {loja.bairro}
          </p>
        </div>
        <div>
          <p className="label">Quando</p>
          <ul>
            {loja.horarios.map((h) => (
              <li key={h.dias}>
                {h.dias}: {h.horas}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label">Navegar</p>
          <ul>
            <li>
              <Link href="/encomendas">Encomendas</Link>
            </li>
            <li>
              <Link href="/pedido">Sacola e pedido</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={`wrap ${s.base}`}>
        <p>Site de demonstração feito pela Atlas Systems. Nome, preços e endereço são de exemplo. Pedidos de teste chegam à Atlas Systems pelo WhatsApp. Fotos: Unsplash (créditos no projeto).</p>
        <p>© {new Date().getFullYear()} {loja.nome}</p>
      </div>
    </footer>
  );
}
