"use client";

// Carrossel de produtos (Blunt "All Umbrellas"): trilho com rolagem horizontal e setas,
// cartões com inclinação (Tilted Card) e bolinhas de variação.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cardapio } from "@/lib/cardapio";
import { ItemCard } from "../ItemCard";
import { Linhas, Surge } from "../ui/Reveal";
import s from "./Destaques.module.css";

export function Destaques() {
  const trilho = useRef<HTMLDivElement>(null);
  const [ini, setIni] = useState(true);
  const [fim, setFim] = useState(false);
  const itens = cardapio.filter((i) => i.destaque);

  const atualizar = () => {
    const t = trilho.current;
    if (!t) return;
    setIni(t.scrollLeft < 8);
    setFim(t.scrollLeft + t.clientWidth > t.scrollWidth - 8);
  };
  useEffect(atualizar, []);

  const mover = (d: number) => {
    const t = trilho.current;
    if (!t) return;
    const card = t.querySelector<HTMLElement>("[data-card]");
    const passo = card ? card.offsetWidth + 16 : t.clientWidth * 0.8;
    t.scrollBy({ left: d * passo, behavior: "smooth" });
  };

  return (
    <section className={s.sec} aria-labelledby="dest-titulo">
      <div className={`wrap ${s.topo}`}>
        <div>
          <p className={`label ${s.kicker}`}>Os mais pedidos</p>
          <Linhas as="h2" className={`display ${s.titulo}`} linhas={[<span key="a" id="dest-titulo">O que sai mais</span>, <em key="b">antes das nove.</em>]} />
        </div>
        <div className={s.controles}>
          <Link href="/cardapio" className="btn btn-ghost">
            Cardápio completo
          </Link>
          <button className={s.seta} onClick={() => mover(-1)} disabled={ini} aria-label="Anteriores">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className={s.seta} onClick={() => mover(1)} disabled={fim} aria-label="Próximos">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div ref={trilho} className={s.trilho} onScroll={atualizar} tabIndex={0} aria-label="Itens mais pedidos, role para o lado">
        {itens.map((i) => (
          <div key={i.id} className={s.slot} data-card>
            <ItemCard item={i} tamanho="grande" />
          </div>
        ))}
      </div>

      <div className={`wrap ${s.valores}`}>
        {[
          { t: "Café da Mantiqueira", d: "Dois sítios, uma torra média. Doce de manhã, honesto à tarde.", i: "grao" },
          { t: "Pão do dia, assado aqui", d: "Francês às 6h, fermentação natural às 8h. Acabou, acabou.", i: "pao" },
          { t: "Pronto em 5 minutos", d: "Peça pelo site, chegue no balcão e saia com o pedido na mão.", i: "relogio" },
        ].map((v, k) => (
          <Surge key={v.t} className={s.valor} atraso={k * 0.08}>
            <Icone nome={v.i} />
            <h3>{v.t}</h3>
            <p>{v.d}</p>
          </Surge>
        ))}
      </div>
    </section>
  );
}

function Icone({ nome }: { nome: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      {nome === "grao" && (
        <>
          <ellipse cx="20" cy="20" rx="10" ry="14" transform="rotate(-25 20 20)" {...p} />
          <path d="M16 8c6 6-2 18 4 24" {...p} />
        </>
      )}
      {nome === "pao" && (
        <>
          <path d="M6 24c0-7 6-12 14-12s14 5 14 12c0 3-2 5-5 5H11c-3 0-5-2-5-5Z" {...p} />
          <path d="M14 15l3 6M20 13l2 7M26 15l1 6" {...p} />
        </>
      )}
      {nome === "relogio" && (
        <>
          <circle cx="20" cy="21" r="13" {...p} />
          <path d="M20 13v8l5 3M17 5h6" {...p} />
        </>
      )}
    </svg>
  );
}
