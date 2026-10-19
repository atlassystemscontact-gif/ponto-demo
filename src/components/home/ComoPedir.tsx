"use client";

// Como pedir, sobre um gradiente 3D animado cor de café (ShaderGradient).
// Respeita reduced-motion (fica parado) e some sem WebGL, ficando o fundo escuro.
import Link from "next/link";
import dynamic from "next/dynamic";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Linhas, Surge } from "../ui/Reveal";
import s from "./ComoPedir.module.css";

const Canvas = dynamic(() => import("@shadergradient/react").then((m) => m.ShaderGradientCanvas), { ssr: false });
const Gradient = dynamic(() => import("@shadergradient/react").then((m) => m.ShaderGradient), { ssr: false });

const PASSOS = [
  { n: "01", t: "Escolha", d: "Cafés, chapa, forno e doces. Tudo com foto e preço na hora." },
  { n: "02", t: "Ajuste", d: "Sem manteiga, leite de aveia, ovo extra, gema mole. Do jeito que você pede no balcão." },
  { n: "03", t: "Envie e retire", d: "O pedido vai pronto no WhatsApp. Retire em 5 minutos ou receba na Penha." },
];

export function ComoPedir() {
  const ref = useRef<HTMLElement>(null);
  const perto = useInView(ref, { margin: "300px 0px" });
  const reduz = useReducedMotion();
  const [gl, setGl] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setGl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {}
  }, []);

  return (
    <section ref={ref} className={`${s.sec} grain`} aria-labelledby="como-titulo">
      {gl && perto && (
        <div className={s.gradiente} aria-hidden="true">
          <Canvas style={{ position: "absolute", inset: 0 }} pixelDensity={1} fov={45} pointerEvents="none">
            <Gradient
              animate={reduz ? "off" : "on"}
              type="waterPlane"
              uSpeed={0.08}
              uStrength={1.6}
              uDensity={1.1}
              uFrequency={4.2}
              uAmplitude={0}
              color1="#3a1f12"
              color2="#120c09"
              color3="#a8622c"
              grain="off"
              lightType="3d"
              brightness={0.9}
              reflection={0.08}
              cAzimuthAngle={180}
              cPolarAngle={90}
              cDistance={3.6}
              positionX={0}
              rotationX={0}
              rotationZ={30}
            />
          </Canvas>
        </div>
      )}
      <div className={`wrap ${s.conteudo}`}>
        <Linhas as="h2" className={`display ${s.titulo}`} linhas={[<span key="a" id="como-titulo">Monte do seu jeito.</span>, <em key="b">A gente faz no ponto.</em>]} />
        <ol className={s.passos}>
          {PASSOS.map((p, i) => (
            <Surge as="li" key={p.n} className={s.passo} atraso={i * 0.1}>
              <span className={s.n}>{p.n}</span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </Surge>
          ))}
        </ol>
        <Link href="/cardapio" className={`btn btn-light ${s.cta}`}>
          Montar meu pedido
        </Link>
      </div>
    </section>
  );
}
