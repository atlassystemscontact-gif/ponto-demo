// Bloco "Encomendas de Natal" na home: foto + título + chamada para /encomendas.
// Sem efeito próprio (só a revelação padrão do título); textos e foto vêm de src/lib/encomendas.ts.
import Link from "next/link";
import { encomendas, vitrine } from "@/lib/encomendas";
import { loja } from "@/lib/data";
import { Linhas } from "../ui/Reveal";
import s from "./EncomendasNatal.module.css";

export function EncomendasNatal() {
  const prazos = encomendas.map((i) => i.encomenda!.prazoHoras);
  const min = Math.ceil(Math.min(...prazos) / 24);
  const max = Math.ceil(Math.max(...prazos) / 24);
  return (
    <section className={s.sec} aria-labelledby="enc-home-titulo">
      <div className={`wrap ${s.grid}`}>
        <div className={s.foto}>
          <img src={vitrine.home.foto} alt="" loading="lazy" />
        </div>
        <div className={s.texto}>
          <Linhas as="h2" className={`display ${s.titulo}`} linhas={[<span key="a" id="enc-home-titulo">{vitrine.home.titulo[0]}</span>, <em key="b">{vitrine.home.titulo[1]}</em>]} />
          <p className={s.sub}>{vitrine.home.texto}</p>
          <ul className={s.fatos}>
            <li>{encomendas.map((i) => i.nome).join(", ")}</li>
            <li>Peça com {min === max ? `${min}` : `${min} a ${max}`} dias de antecedência</li>
            <li>Sinal de {loja.encomendas.sinalPercentual}% via Pix confirma o pedido</li>
          </ul>
          <Link href="/encomendas" className="btn btn-dark">
            Ver encomendas
          </Link>
        </div>
      </div>
    </section>
  );
}
