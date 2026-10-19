"use client";

// "Flowing Menu" (Superdesign Library / React Bits): lista de categorias em letras grandes;
// no hover entra, pela borda por onde o mouse veio, uma faixa corrida com os itens e fotos.
import Link from "next/link";
import { animate } from "motion";
import { useRef, type MouseEvent } from "react";
import { cardapio, categorias } from "@/lib/cardapio";
import s from "./FlowingMenu.module.css";

export function FlowingMenu() {
  return (
    <section className={s.sec} aria-labelledby="fm-titulo">
      <div className={`wrap ${s.topo}`}>
        <h2 id="fm-titulo" className={`display ${s.titulo}`}>
          Seis gavetas, <em>um balcão.</em>
        </h2>
        <p className={s.sub}>Passe o mouse numa categoria para espiar o que tem dentro.</p>
      </div>
      <ul className={s.lista}>
        {categorias.map((c) => (
          <Linha key={c.id} id={c.id} nome={c.nome} />
        ))}
      </ul>
    </section>
  );
}

const EASE = [0.23, 1, 0.32, 1] as const;

function Linha({ id, nome }: { id: string; nome: string }) {
  const over = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const itens = cardapio.filter((i) => i.categoria === id);

  const lado = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return e.clientY - r.top < r.height / 2 ? -1 : 1;
  };

  const entrar = (d: number) => {
    if (!over.current || !inner.current) return;
    animate(over.current, { y: `${d * 101}%` }, { duration: 0 });
    animate(inner.current, { y: `${-d * 101}%` }, { duration: 0 });
    animate(over.current, { y: "0%" }, { duration: 0.5, ease: EASE });
    animate(inner.current, { y: "0%" }, { duration: 0.5, ease: EASE });
  };
  const sair = (d: number) => {
    if (!over.current || !inner.current) return;
    animate(over.current, { y: `${d * 101}%` }, { duration: 0.45, ease: EASE });
    animate(inner.current, { y: `${-d * 101}%` }, { duration: 0.45, ease: EASE });
  };

  const faixa = (
    <span className={s.trecho}>
      {itens.map((i) => (
        <span key={i.id} className={s.item}>
          <span>{i.nome}</span>
          <img src={i.foto} alt="" />
        </span>
      ))}
    </span>
  );

  return (
    <li className={s.linha}>
      <Link href={`/cardapio#${id}`} className={s.link} onMouseEnter={(e) => entrar(lado(e))} onMouseLeave={(e) => sair(lado(e))}>
        <span className={s.nome}>{nome}</span>
        <span className={s.qtd}>{itens.length} itens</span>
        <span ref={over} className={s.overlay} aria-hidden="true" style={{ transform: "translateY(101%)" }}>
          <span ref={inner} className={s.inner} style={{ transform: "translateY(-101%)" }}>
            <span className={s.marquee}>
              {faixa}
              {faixa}
            </span>
          </span>
        </span>
      </Link>
    </li>
  );
}
