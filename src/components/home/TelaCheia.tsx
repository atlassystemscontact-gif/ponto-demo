"use client";

// Transição para foto em tela cheia com título por cima (como "Back to what matters" da Morpho),
// com leve parallax na foto. Reduced-motion: a foto fica parada, mas com o mesmo estilo inicial
// no servidor e no navegador (evita erro de hidratação, como em ui/Reveal.tsx).
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Linhas } from "../ui/Reveal";
import s from "./TelaCheia.module.css";

export function TelaCheia() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const reduz = useReducedMotion();
  // com reduced-motion a posição não acompanha a rolagem (fica no ponto inicial, -8%)
  const y = useTransform(scrollYProgress, [0, 1], reduz ? ["-8%", "-8%"] : ["-8%", "8%"]);
  return (
    <section ref={ref} className={`${s.sec} grain`} aria-labelledby="tela-titulo">
      <motion.img src="/fotos/tela-paes.webp" alt="Cesto de pães do dia sobre a bancada" className={s.foto} style={{ y, scale: 1.16 }} />
      <div className={s.sombra} />
      <div className={`wrap ${s.conteudo}`}>
        <p className={`label ${s.kicker}`}>05 — O cardápio</p>
        <Linhas as="h2" className={`display ${s.titulo}`} linhas={[<span key="a" id="tela-titulo">Das 6h30</span>, <em key="b">até acabar o pão.</em>]} />
        <Link href="/cardapio" className={`btn btn-light ${s.cta}`}>
          Explorar o cardápio
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
