"use client";

// Herói dividido (Blunt): título enorme de um lado, foto editorial sangrando do outro.
// Por cima da foto, a pilha "Card Swap" com o que está saindo do balcão.
// Reduced-motion: mesmo estado inicial no servidor e no navegador (evita erro de hidratação),
// só a duração vira 0 (como em ui/Reveal.tsx).
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Linhas } from "../ui/Reveal";
import { CardSwap } from "../ui/CardSwap";
import s from "./Hero.module.css";

export function Hero() {
  const reduz = useReducedMotion();
  return (
    <section className={s.hero} aria-labelledby="hero-titulo">
      <div className={s.texto}>
        <motion.p className={`label ${s.kicker}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={reduz ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}>
          Café &amp; chapa · Penha, São Paulo
        </motion.p>
        <Linhas
          as="h1"
          noCarregar
          atraso={0.15}
          className={`display ${s.titulo}`}
          linhas={[
            <span key="1" id="hero-titulo">Pão na chapa.</span>,
            <em key="2">Café no ponto.</em>,
          ]}
        />
        <motion.div
          className={s.baixo}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduz ? { duration: 0 } : { duration: 0.8, delay: 0.55, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className={s.sub}>O balcão da padaria paulistana com café especial da Mantiqueira. Monte do seu jeito, sem manteiga ou com leite de aveia, e retire em 5 minutos.</p>
          <div className={s.ctas}>
            <Link href="/cardapio" className="btn btn-dark">
              Montar meu pedido
            </Link>
            <a href="#historia" className="btn btn-ghost">
              Conhecer a casa
            </a>
          </div>
          <ul className={s.fatos}>
            <li>
              <strong>5 min</strong> do pedido ao balcão
            </li>
            <li>
              <strong>6h30</strong> a chapa já está quente
            </li>
            <li>
              <strong>R$ 9</strong> o pão na chapa
            </li>
          </ul>
        </motion.div>
      </div>

      <div className={s.foto}>
        <motion.img
          src="/fotos/hero-espresso.webp"
          alt="Espresso saindo da máquina num copinho de vidro"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduz ? { duration: 0 } : { duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
        />
        <div className={s.swap}>
          <CardSwap ids={["pao-na-chapa", "pingado", "misto-quente", "cappuccino", "pao-de-queijo"]} />
        </div>
        <p className={`label ${s.legenda}`}>Espresso da casa · Mantiqueira, torra média</p>
      </div>
    </section>
  );
}
