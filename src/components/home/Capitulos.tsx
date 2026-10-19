"use client";

// Capítulos com objeto fixo no centro (Morpho): a xícara 3D fica parada enquanto a história
// rola em volta. Índice "01 / 04" na lateral, nome do capítulo embaixo, foto de fundo trocando.
// Sem WebGL ou com reduced-motion: vira blocos empilhados com foto.
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./Capitulos.module.css";

const Cup3D = dynamic(() => import("./Cup3D"), { ssr: false });

const CAPS = [
  {
    nome: "O grão",
    foto: "/fotos/cap-grao.webp",
    titulo: ["Do sul de Minas,", "direto pra xícara."],
    texto: "Café da Serra da Mantiqueira, torra média, de dois sítios em Carmo de Minas. Doce, com chocolate e caramelo.",
    lado: "esq",
    bebida: "Espresso",
  },
  {
    nome: "A torra",
    foto: "/fotos/cap-torra.webp",
    titulo: ["Torrado toda", "segunda-feira."],
    texto: "Lotes pequenos, a quinze minutos daqui. Nenhum pacote passa de quinze dias na prateleira.",
    lado: "dir",
    bebida: "Coado do dia",
  },
  {
    nome: "A chapa",
    foto: "/fotos/cap-chapa.webp",
    titulo: ["Manteiga de verdade,", "pão do dia."],
    texto: "O pão francês chega às seis e vai prensado na chapa até dourar por fora. Simples. Por isso é difícil.",
    lado: "esq",
    bebida: "Pingado",
  },
  {
    nome: "O balcão",
    foto: "/fotos/cap-balcao.webp",
    titulo: ["Dois minutos de balcão.", "Ou vinte."],
    texto: "Tem quem pegue o pingado e corra pro ônibus. Tem quem fique para o segundo. O ponto é dos dois.",
    lado: "dir",
    bebida: "Cappuccino",
  },
] as const;

export function Capitulos() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [cap, setCap] = useState(0);
  const [gl, setGl] = useState<boolean | null>(null);
  const reduz = useReducedMotion();
  const perto = useInView(ref, { margin: "200px 0px" });

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setGl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setGl(false);
    }
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(CAPS.length - 1, Math.max(0, Math.floor(v * CAPS.length * 0.999)));
    setCap((c) => (c === i ? c : i));
  });

  // decide a versão estática só depois de montar (evita diferença entre servidor e navegador)
  const [simples, setSimples] = useState(false);
  useEffect(() => setSimples(!!reduz || gl === false), [reduz, gl]);

  if (simples) return <CapitulosSimples />;

  const c = CAPS[cap];

  return (
    <section ref={ref} id="historia" className={s.trilho} aria-label="A história do Ponto" style={{ height: `${CAPS.length * 100 + 40}vh` }}>
      <div className={`${s.palco} grain`}>
        {/* fundos */}
        <AnimatePresence initial={false}>
          <motion.img
            key={c.foto}
            src={c.foto}
            alt=""
            className={s.fundo}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
          />
        </AnimatePresence>
        <div className={s.vinheta} />

        {/* índice lateral */}
        <div className={s.indice} aria-hidden="true">
          <span className={s.num}>0{cap + 1}</span>
          <span className={s.de}>/ 0{CAPS.length}</span>
          <span className={s.marcas}>
            {CAPS.map((_, i) => (
              <span key={i} data-on={i === cap || undefined} />
            ))}
          </span>
          <span className={s.vertical}>A história</span>
        </div>

        {/* xícara */}
        <div className={s.xicara} aria-hidden="true">
          {gl && <Cup3D progresso={scrollYProgress} capitulo={cap} ativo={perto} />}
          <AnimatePresence mode="wait">
            <motion.p key={c.bebida} className={s.bebida} style={{ x: "-50%" }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}>
              Na xícara: {c.bebida}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* texto do capítulo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cap}
            className={s.texto}
            data-lado={c.lado}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <p className={`label ${s.cap}`}>
              0{cap + 1} — {c.nome}
            </p>
            <h2 className={`display ${s.titulo}`}>
              {c.titulo.map((l, i) => (
                <span key={i} className={s.linha}>
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.05 + i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {i === 1 ? <em>{l}</em> : l}
                  </motion.span>
                </span>
              ))}
            </h2>
            <motion.p className={s.p} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
              {c.texto}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* progresso embaixo */}
        <div className={s.rodape} aria-hidden="true">
          <span>0{cap + 1}</span>
          <span className={s.barra}>
            <motion.span style={{ scaleX: scrollYProgress }} />
          </span>
          <span>{c.nome}</span>
        </div>
      </div>
    </section>
  );
}

function CapitulosSimples() {
  return (
    <section id="historia" className={s.simples} aria-label="A história do Ponto">
      {CAPS.map((c, i) => (
        <article key={c.nome} className={s.simplesCap}>
          <img src={c.foto} alt="" />
          <div>
            <p className="label">
              0{i + 1} — {c.nome}
            </p>
            <h2 className="display">
              {c.titulo[0]} <em>{c.titulo[1]}</em>
            </h2>
            <p>{c.texto}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
