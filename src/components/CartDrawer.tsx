"use client";

// Sacola: gaveta lateral. Itens entram/saem como "Animated List" (Superdesign Library).
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useRef } from "react";
import { useCart } from "@/lib/cart";
import { useModal } from "@/lib/useModal";
import { acharItem, precoUnitario, resumoConfig } from "@/lib/pedido";
import { vitrine } from "@/lib/encomendas";
import { formatarPreco } from "@/lib/cardapio";
import { loja } from "@/lib/data";
import { Preco } from "./ui/Counter";
import { Stepper } from "./ItemSheet";
import s from "./CartDrawer.module.css";

export function CartDrawer() {
  const { gavetaAberta, setGaveta } = useCart();
  return <AnimatePresence>{gavetaAberta && <Gaveta onClose={() => setGaveta(false)} />}</AnimatePresence>;
}

function Gaveta({ onClose }: { onClose: () => void }) {
  const { linhas, setQtd, remover, subtotal, qtdTotal, abrirItem } = useCart();
  const temEncomenda = linhas.some((l) => acharItem(l.id)?.encomenda);
  const ref = useRef<HTMLDivElement>(null);
  const reduz = useReducedMotion();
  const fechar = useCallback(() => onClose(), [onClose]);
  useModal(ref, true, fechar);

  return (
    <div className={s.root}>
      <motion.div className={s.overlay} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.24 }} />
      <motion.aside
        ref={ref}
        className={s.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sacola-titulo"
        tabIndex={-1}
        initial={reduz ? { opacity: 0 } : { x: "100%" }}
        animate={reduz ? { opacity: 1 } : { x: 0 }}
        exit={reduz ? { opacity: 0 } : { x: "100%" }}
        transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className={s.topo}>
          <h2 id="sacola-titulo" className={s.titulo}>
            Sua sacola <span>{qtdTotal > 0 ? `${qtdTotal} ${qtdTotal === 1 ? "item" : "itens"}` : ""}</span>
          </h2>
          <button className={s.fechar} onClick={onClose} data-autofocus>
            <span className="sr-only">Fechar sacola</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {linhas.length === 0 ? (
          <div className={s.vazio}>
            <p className={s.vazioTit}>
              Sacola vazia. <em className="serif-i">Por enquanto.</em>
            </p>
            <p>O pão na chapa sai em 5 minutos. O pingado, em 2.</p>
            <Link href="/cardapio" className="btn btn-dark" onClick={onClose}>
              Ver o cardápio
            </Link>
            <Link href="/encomendas" className="btn btn-ghost" onClick={onClose}>
              {vitrine.chamada}
            </Link>
          </div>
        ) : (
          <>
            <ul className={s.lista}>
              <AnimatePresence initial={false}>
                {linhas.map((l) => {
                  const item = acharItem(l.id);
                  if (!item) return null;
                  const det = resumoConfig(item, l.config);
                  return (
                    <motion.li
                      key={l.chave}
                      layout={!reduz}
                      initial={reduz ? false : { opacity: 0, scale: 0.96, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={reduz ? { opacity: 0 } : { opacity: 0, x: 40, transition: { duration: 0.2 } }}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className={s.linha}
                    >
                      <img src={item.foto} alt="" className={s.thumb} />
                      <div className={s.info}>
                        <p className={s.nome}>{item.nome}</p>
                        {det.length > 0 && <p className={s.det}>{det.join(" · ")}</p>}
                        <div className={s.acoes}>
                          <Stepper valor={l.qtd} min={1} max={20} onChange={(v) => setQtd(l.chave, v)} rotulo={`quantidade de ${item.nome}`} pequeno />
                          <button className={s.link} onClick={() => abrirItem(l.id, l.chave)}>
                            Editar
                          </button>
                          <button className={s.link} onClick={() => remover(l.chave)} aria-label={`Remover ${item.nome}`}>
                            Remover
                          </button>
                        </div>
                      </div>
                      <p className={s.preco}>{formatarPreco(precoUnitario(item, l.config) * l.qtd)}</p>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>

            <div className={s.rodape}>
              <div className={s.total}>
                <span>Subtotal</span>
                <Preco centavos={subtotal} className={s.totalValor} />
              </div>
              <p className={s.nota}>
                {temEncomenda
                  ? `Encomenda: data e janela no próximo passo. Sinal de ${loja.encomendas.sinalPercentual}% via Pix confirma o pedido.`
                  : `Retirada no balcão sem taxa. Entrega na Penha: ${formatarPreco(loja.taxaEntrega)}.`}
              </p>
              <Link href="/pedido" className={`btn btn-dark ${s.cta}`} onClick={onClose}>
                Finalizar pedido
              </Link>
            </div>
          </>
        )}
      </motion.aside>
    </div>
  );
}
