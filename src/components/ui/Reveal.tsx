"use client";

// Revelação de títulos linha a linha por máscara (padrão "TextEffect / InView" do Motion Primitives).
// O título inteiro é observado (não cada linha, que fica escondida pela máscara) e as linhas
// sobem em sequência. Com reduced-motion aparece direto (duração 0). O estado inicial é o mesmo
// no servidor e no navegador para não dar erro de hidratação quando reduced-motion está ligado.
import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const filho: Variants = {
  oculto: { y: "108%" },
  visivel: { y: 0, transition: { duration: 0.9, ease: [0.23, 1, 0.32, 1] } },
};
const filhoDireto: Variants = { oculto: { y: "108%" }, visivel: { y: 0, transition: { duration: 0 } } };

const TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p } as const;

export function Linhas({
  linhas,
  as = "h2",
  className,
  atraso = 0,
  noCarregar = false,
}: {
  linhas: ReactNode[];
  as?: keyof typeof TAGS;
  className?: string;
  atraso?: number;
  noCarregar?: boolean; // anima ao montar (herói) em vez de ao entrar na tela
}) {
  const reduz = useReducedMotion();
  const M = TAGS[as];
  const pai: Variants = { oculto: {}, visivel: { transition: reduz ? {} : { staggerChildren: 0.09, delayChildren: atraso } } };
  const gatilho = noCarregar ? { animate: "visivel" } : { whileInView: "visivel", viewport: { once: true, margin: "0px 0px -10% 0px" } };
  return (
    <M className={className} variants={pai} initial="oculto" {...gatilho}>
      {linhas.map((l, i) => (
        <span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.08em", marginBottom: "-0.08em" }}>
          <motion.span style={{ display: "block" }} variants={reduz ? filhoDireto : filho}>
            {l}
          </motion.span>
        </span>
      ))}
    </M>
  );
}

export function Surge({ children, className, atraso = 0, as: Tag = "div" }: { children: ReactNode; className?: string; atraso?: number; as?: "div" | "p" | "ul" | "li" | "section" }) {
  const reduz = useReducedMotion();
  const M = motion[Tag];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={reduz ? { duration: 0 } : { duration: 0.7, delay: atraso, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </M>
  );
}
