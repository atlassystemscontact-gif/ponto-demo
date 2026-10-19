"use client";

// Visite: endereço gigante + "Image Trail" (Superdesign Library / React Bits): ao passar o
// mouse, fotos da casa vão ficando pelo caminho e somem. Só com mouse e sem reduced-motion.
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import { loja } from "@/lib/data";
import { Linhas } from "../ui/Reveal";
import s from "./Visite.module.css";

const FOTOS = ["/fotos/pao-na-chapa.webp", "/fotos/cappuccino.webp", "/fotos/misto-quente.webp", "/fotos/pao-de-queijo.webp", "/fotos/espresso-duplo.webp", "/fotos/croissant.webp", "/fotos/pingado.webp", "/fotos/luminaria.webp", "/fotos/esfiha.webp", "/fotos/brigadeiro.webp"];

type Rastro = { id: number; x: number; y: number; src: string; rot: number };

export function Visite() {
  const [rastros, setRastros] = useState<Rastro[]>([]);
  const ultimo = useRef<{ x: number; y: number } | null>(null);
  const cont = useRef(0);
  const reduz = useReducedMotion();

  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (reduz || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const u = ultimo.current;
    if (u && Math.hypot(x - u.x, y - u.y) < 110) return;
    ultimo.current = { x, y };
    const id = cont.current++;
    const novo = { id, x, y, src: FOTOS[id % FOTOS.length], rot: ((id * 37) % 14) - 7 };
    setRastros((p) => [...p.slice(-6), novo]);
    window.setTimeout(() => setRastros((p) => p.filter((q) => q.id !== id)), 900);
  };

  // sem link de mapa em data.ts (endereço fictício), sem botão: um mapa de endereço inventado levaria a um lugar qualquer
  const mapa = loja.mapa;

  return (
    <section id="visite" className={s.sec} aria-labelledby="visite-titulo">
      <div className={s.area} onPointerMove={mover} onPointerLeave={() => (ultimo.current = null)}>
        <AnimatePresence>
          {rastros.map((r) => (
            <motion.img
              key={r.id}
              src={r.src}
              alt=""
              aria-hidden="true"
              className={s.rastro}
              style={{ left: r.x, top: r.y, rotate: r.rot }}
              initial={{ opacity: 0, scale: 0.6, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, y: "-30%", transition: { duration: 0.5 } }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            />
          ))}
        </AnimatePresence>

        <div className={`wrap ${s.conteudo}`}>
          <p className={`label ${s.kicker}`}>Visite</p>
          <Linhas
            as="h2"
            className={`display ${s.titulo}`}
            linhas={[
              <span key="a" id="visite-titulo">
                {loja.endereco.replace(/, \d+$/, "")},
              </span>,
              <em key="b">número {loja.endereco.match(/\d+$/)?.[0]}.</em>,
            ]}
          />
          <div className={s.info}>
            <div>
              <p className="label">Bairro</p>
              <p>
                {loja.bairro}. {loja.referencia}
              </p>
            </div>
            <div>
              <p className="label">Horário</p>
              <ul>
                {loja.horarios.map((h) => (
                  <li key={h.dias}>
                    <span>{h.dias}</span>
                    <span>{h.horas}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.acoes}>
              {mapa && (
                <a href={mapa} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                  Como chegar
                </a>
              )}
              <p className={s.nota}>Endereço de exemplo (site de demonstração).</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
