"use client";

// "Card Swap" (Superdesign Library / React Bits), refeito com Motion: pilha de cartões em
// perspectiva; a cada poucos segundos o da frente cai e volta para o fundo. Pausa no hover,
// fora da tela e com reduced-motion. Cada cartão abre o painel do item.
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cardapio, formatarPreco } from "@/lib/cardapio";
import { precoMinimo } from "@/lib/pedido";
import { useCart } from "@/lib/cart";
import s from "./CardSwap.module.css";

export function CardSwap({ ids, intervalo = 4200 }: { ids: string[]; intervalo?: number }) {
  const itens = ids.map((id) => cardapio.find((i) => i.id === id)!).filter(Boolean);
  const [ordem, setOrdem] = useState(itens.map((_, i) => i));
  const [caindo, setCaindo] = useState<number | null>(null);
  const [pausa, setPausa] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const visivel = useInView(ref, { margin: "-10% 0px" });
  const reduz = useReducedMotion();
  const { abrirItem } = useCart();

  useEffect(() => {
    if (reduz || pausa || !visivel) return;
    const t = setInterval(() => {
      setCaindo((c) => (c === null ? ordem[0] : c));
    }, intervalo);
    return () => clearInterval(t);
  }, [reduz, pausa, visivel, intervalo, ordem]);

  useEffect(() => {
    if (caindo === null) return;
    const t = setTimeout(() => {
      setOrdem((o) => [...o.slice(1), o[0]]);
      setCaindo(null);
    }, 620);
    return () => clearTimeout(t);
  }, [caindo]);

  const n = itens.length;

  return (
    <div ref={ref} className={s.stage} onMouseEnter={() => setPausa(true)} onMouseLeave={() => setPausa(false)} onFocus={() => setPausa(true)} onBlur={() => setPausa(false)}>
      {itens.map((item, idx) => {
        const pos = ordem.indexOf(idx);
        const cai = caindo === idx;
        return (
          <motion.button
            key={item.id}
            type="button"
            className={s.card}
            style={{ zIndex: cai ? n + 1 : n - pos }}
            initial={false}
            animate={
              cai
                ? { x: 0, y: 520, rotate: 6, opacity: 1, transition: { duration: 0.6, ease: [0.55, 0, 0.75, 0.2] } }
                : { x: pos * 46, y: -pos * 44, scale: 1 - pos * 0.05, rotate: 0, opacity: pos > 3 ? 0 : 1 }
            }
            transition={{ type: "spring", stiffness: 160, damping: 22, mass: 0.9 }}
            onClick={() => abrirItem(item.id)}
            tabIndex={pos === 0 ? 0 : -1}
            aria-hidden={pos === 0 ? undefined : true}
            aria-label={pos === 0 ? `${item.nome}, ${formatarPreco(precoMinimo(item))}. Abrir para montar` : undefined}
          >
            <img src={item.foto} alt="" className={s.foto} draggable={false} />
            <span className={s.info}>
              <span className={s.tag}>Saindo agora</span>
              <span className={s.nome}>{item.nome}</span>
              <span className={s.preco}>{item.opcoes?.length ? "a partir de " : ""}{formatarPreco(precoMinimo(item))}</span>
            </span>
            <span className={s.mais} aria-hidden="true">+</span>
          </motion.button>
        );
      })}
    </div>
  );
}
