"use client";

// Botão flutuante no canto inferior direito (como o "Talk to Morpho"): leva ao pedido de
// qualquer ponto da página e avisa quando um item entra na sacola. Com a sacola vazia leva ao
// cardápio; no próprio cardápio, leva às encomendas.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { acharItem } from "@/lib/pedido";
import { vitrine } from "@/lib/encomendas";
import { Grao } from "./Logo";
import s from "./CartFab.module.css";

export function CartFab() {
  const { qtdTotal, setGaveta, pulso, ultimo } = useCart();
  const [aviso, setAviso] = useState<string | null>(null);
  const reduz = useReducedMotion();
  const path = usePathname();

  useEffect(() => {
    if (!pulso || !ultimo) return;
    setAviso(acharItem(ultimo)?.nome ?? null);
    const t = setTimeout(() => setAviso(null), 2600);
    return () => clearTimeout(t);
  }, [pulso, ultimo]);

  if (path === "/pedido") return null;

  return (
    <div className={s.root}>
      <AnimatePresence>
        {aviso && (
          <motion.div
            className={s.aviso}
            role="status"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          >
            <strong>{aviso}</strong> foi para a sacola.
            <button onClick={() => setGaveta(true)}>Ver</button>
          </motion.div>
        )}
      </AnimatePresence>

      {qtdTotal > 0 ? (
        <motion.button
          key={pulso}
          className={s.fab}
          onClick={() => setGaveta(true)}
          initial={reduz || !pulso ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <Grao className={s.icone} />
          <span>Fazer pedido</span>
          <span className={s.n}>{qtdTotal}</span>
        </motion.button>
      ) : path === "/cardapio" ? (
        <Link href="/encomendas" className={s.fab}>
          <Grao className={s.icone} />
          <span>{vitrine.chamada}</span>
        </Link>
      ) : (
        path !== "/encomendas" && (
          <Link href="/cardapio" className={s.fab}>
            <Grao className={s.icone} />
            <span>Pedir agora</span>
          </Link>
        )
      )}
    </div>
  );
}
