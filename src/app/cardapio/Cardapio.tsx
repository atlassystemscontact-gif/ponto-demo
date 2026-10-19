"use client";

// Cardápio completo: pílulas de categoria fixas no topo (com indicador deslizante, "Pill Nav")
// que acompanham a rolagem, e grade de cartões por categoria.
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cardapio, categorias, type CategoriaId } from "@/lib/cardapio";
import { ItemCard } from "@/components/ItemCard";
import { Linhas } from "@/components/ui/Reveal";
import s from "./cardapio.module.css";

export function Cardapio() {
  const [ativa, setAtiva] = useState<CategoriaId>("cafes");
  const reduz = useReducedMotion();
  const trilho = useRef<HTMLDivElement>(null);
  const clicou = useRef(0);

  useEffect(() => {
    const secoes = categorias.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (ents) => {
        if (Date.now() - clicou.current < 900) return;
        const vis = ents.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setAtiva(vis[0].target.id as CategoriaId);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    secoes.forEach((x) => io.observe(x));
    return () => io.disconnect();
  }, []);

  // mantém a pílula ativa visível no celular
  useEffect(() => {
    const el = trilho.current?.querySelector<HTMLElement>(`[data-cat="${ativa}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduz ? "auto" : "smooth" });
  }, [ativa, reduz]);

  const ir = (id: CategoriaId) => {
    clicou.current = Date.now();
    setAtiva(id);
    document.getElementById(id)?.scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      <header className={`wrap ${s.topo}`}>
        <p className={`label ${s.kicker}`}>Cardápio · preços de exemplo</p>
        <Linhas as="h1" noCarregar className={`display ${s.titulo}`} linhas={["Tudo o que sai", <em key="b">do balcão.</em>]} />
        <p className={s.sub}>Toque em qualquer item para escolher tamanho, leite ou pão, tirar o que não quer e turbinar com o que quiser.</p>
      </header>

      <nav className={s.navWrap} aria-label="Categorias do cardápio">
        <div ref={trilho} className={s.nav}>
          {categorias.map((c) => (
            <button key={c.id} data-cat={c.id} className={s.pill} aria-current={ativa === c.id ? "true" : undefined} onClick={() => ir(c.id)}>
              {ativa === c.id && <motion.span layoutId="cat-pill" className={s.pillBg} transition={reduz ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 38 }} />}
              <span className={s.pillTxt}>{c.nome}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className={`wrap ${s.secoes}`}>
        {categorias.map((c) => {
          const itens = cardapio.filter((i) => i.categoria === c.id);
          return (
            <section key={c.id} id={c.id} className={s.secao} aria-labelledby={`t-${c.id}`}>
              <div className={s.secTopo}>
                <h2 id={`t-${c.id}`} className={s.secTitulo}>
                  {c.nome}
                </h2>
                <span className={s.secQtd}>{itens.length} itens</span>
              </div>
              <div className={s.grade}>
                {itens.map((i) => (
                  <ItemCard key={i.id} item={i} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
