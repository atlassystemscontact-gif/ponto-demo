"use client";

// Cartão de item do cardápio (usado na home e em /cardapio). Clicar abre o painel do item.
import { formatarPreco, type Item } from "@/lib/cardapio";
import { precoMinimo } from "@/lib/pedido";
import { useCart } from "@/lib/cart";
import { textoPrazo } from "@/lib/agenda";
import { TiltedCard } from "./ui/TiltedCard";
import s from "./ItemCard.module.css";

export function ItemCard({ item, tamanho = "normal" }: { item: Item; tamanho?: "normal" | "grande" }) {
  const { abrirItem } = useCart();
  const g = item.opcoes?.[0];
  const temOpcoes = !!item.opcoes?.length;
  return (
    <TiltedCard className={s.tilt}>
      <article className={s.card} data-tamanho={tamanho}>
        <button className={s.cobre} onClick={() => abrirItem(item.id)} aria-label={`${item.nome}: escolher e adicionar`} />
        <div className={s.foto}>
          <img src={item.foto} alt="" loading="lazy" />
          {item.selo && <span className={s.selo}>{item.selo}</span>}
        </div>
        <div className={s.info}>
          <div className={s.linha1}>
            <h3 className={s.nome}>{item.nome}</h3>
            <p className={s.preco}>
              {temOpcoes && <span>a partir de</span>}
              {formatarPreco(precoMinimo(item))}
            </p>
          </div>
          <p className={s.desc}>{item.descricao}</p>
          {item.encomenda && <p className={s.prazo}>Encomende com {textoPrazo(item.encomenda.prazoHoras)} de antecedência</p>}
          <div className={s.linha2}>
            {g ? (
              <p className={s.variantes} aria-label={`${g.titulo}: ${g.itens.map((o) => o.nome).join(", ")}`}>
                <span className={s.pontos} aria-hidden="true">
                  {g.itens.slice(0, 5).map((o) => (
                    <i key={o.id} data-on={o.id === g.padrao || undefined} />
                  ))}
                </span>
                {g.itens.length} opções de {g.titulo.toLowerCase()}
              </p>
            ) : item.remover?.length || item.adicionais?.length ? (
              <p className={s.variantes}>Do seu jeito</p>
            ) : (
              <span />
            )}
            <span className={s.add} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </TiltedCard>
  );
}
