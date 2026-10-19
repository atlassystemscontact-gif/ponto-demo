"use client";

// Cartão de item (home, /cardapio, /encomendas).
// - Tocar em qualquer parte do cartão abre o painel do item. O clique é tratado no próprio <article>
//   (os eventos sobem de qualquer filho), sem película transparente por cima: dentro do contexto 3D
//   do Tilted Card, o Safari/iPhone ignora z-index e a película ficava por baixo da foto e do texto.
// - "+" é um <button> real (44x44): item sem escolha obrigatória vai direto para a sacola; item com
//   opções (tamanho, sabor) ou encomenda (mensagem, data) abre o painel para escolher antes.
// - Teclado: o nome é um botão (abre o painel) e o "+" é outro; Enter/Espaço funcionam nos dois.
import type { MouseEvent } from "react";
import { formatarPreco, type Item } from "@/lib/cardapio";
import { configPadrao, precoMinimo } from "@/lib/pedido";
import { useCart } from "@/lib/cart";
import { textoPrazo } from "@/lib/agenda";
import { TiltedCard } from "./ui/TiltedCard";
import s from "./ItemCard.module.css";

export function ItemCard({ item, tamanho = "normal" }: { item: Item; tamanho?: "normal" | "grande" }) {
  const { abrirItem, adicionar } = useCart();
  const g = item.opcoes?.[0];
  const temOpcoes = !!item.opcoes?.length;
  const precisaEscolher = temOpcoes || !!item.encomenda;

  const mais = (e: MouseEvent) => {
    e.stopPropagation(); // não deixa o clique subir para o cartão (que abriria o painel)
    if (precisaEscolher) abrirItem(item.id);
    else adicionar(item.id, configPadrao(item), 1);
  };

  return (
    <TiltedCard className={s.tilt}>
      <article className={s.card} data-tamanho={tamanho} onClick={() => abrirItem(item.id)}>
        <div className={s.foto}>
          <img src={item.foto} alt="" loading="lazy" />
          {item.selo && <span className={s.selo}>{item.selo}</span>}
        </div>
        <div className={s.info}>
          <div className={s.linha1}>
            <h3 className={s.nome}>
              {/* o clique sobe para o <article>; o botão existe para teclado e leitor de tela */}
              <button type="button" className={s.abrir} aria-haspopup="dialog">
                {item.nome}
              </button>
            </h3>
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
            <button type="button" className={s.add} onClick={mais} aria-label={`Adicionar ${item.nome}`} aria-haspopup={precisaEscolher ? "dialog" : undefined}>
              <span className={s.addCirculo} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </article>
    </TiltedCard>
  );
}
