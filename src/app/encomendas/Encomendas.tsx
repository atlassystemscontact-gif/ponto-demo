"use client";

// Encomendas com data marcada. Tudo vem de src/lib/encomendas.ts (catálogo, agenda e textos)
// e src/lib/data.ts (sinal, taxa e área de entrega).
// Momento autoral da página: o cartão do produto (Tilted Card, o mesmo do cardápio). O resto é
// estático de propósito: como funciona e quando sai cada item, em texto claro.
// Itens com a temporada encerrada (ultimaData no passado) saem da vitrine, mas seguem nos dados.
import { useEffect, useState } from "react";
import { encomendas, vitrine } from "@/lib/encomendas";
import { formatarPreco } from "@/lib/cardapio";
import { loja } from "@/lib/data";
import { iso, naTemporada, textoDias, textoPrazo, dataCurta } from "@/lib/agenda";
import { ItemCard } from "@/components/ItemCard";
import { Linhas } from "@/components/ui/Reveal";
import s from "./encomendas.module.css";

export function Encomendas() {
  const { sinalPercentual, taxaEntrega, areaEntrega } = loja.encomendas;
  // a página é gerada no build: a data de hoje tem de vir do navegador, depois de montar
  const [hoje, setHoje] = useState<string | null>(null);
  useEffect(() => setHoje(iso(new Date())), []);
  const itens = hoje ? encomendas.filter((i) => naTemporada(i, hoje)) : encomendas;
  const passos = [
    { t: "Escolha", d: "Item, tamanho e sabor. O preço muda na hora." },
    { t: "Escreva", d: "A frase do bolo ou o texto do cartão, se quiser." },
    { t: "Marque a data", d: "Dia e janela de retirada ou entrega. O calendário só libera o que dá tempo de fazer." },
    { t: "Confirme com o sinal", d: `O pedido vai pronto no WhatsApp. Com o Pix de ${sinalPercentual}%, entra na agenda.` },
  ];

  return (
    <>
      <header className={`wrap ${s.topo}`}>
        <Linhas as="h1" noCarregar className={`display ${s.titulo}`} linhas={[vitrine.titulo[0], <em key="b">{vitrine.titulo[1]}</em>]} />
        <p className={s.sub}>{vitrine.subtitulo}</p>
        <ul className={s.fatos}>
          <li>
            <strong>Retirada</strong> no balcão, sem taxa
          </li>
          <li>
            <strong>Entrega</strong> na {areaEntrega}: {formatarPreco(taxaEntrega)}
          </li>
          <li>
            <strong>Sinal de {sinalPercentual}%</strong> via Pix confirma
          </li>
        </ul>
      </header>

      <section className={`wrap ${s.grade}`} aria-labelledby="itens-enc">
        <h2 id="itens-enc" className="sr-only">
          Itens para encomendar
        </h2>
        {itens.map((i) => (
          <ItemCard key={i.id} item={i} />
        ))}
        {!itens.length && <p className={s.vazio}>Nenhuma encomenda aberta agora. Volte na próxima temporada.</p>}
      </section>

      <section className={`wrap ${s.info}`} aria-labelledby="como-enc">
        <div>
          <h2 id="como-enc" className={`display ${s.infoTit}`}>
            Como <em>funciona.</em>
          </h2>
          <ol className={s.passos}>
            {passos.map((p, k) => (
              <li key={p.t}>
                <span className={s.n} aria-hidden="true">
                  {String(k + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h2 id="prazos-enc" className={`display ${s.infoTit}`}>
            Quando sai <em>cada um.</em>
          </h2>
          <ul className={s.prazos} aria-labelledby="prazos-enc">
            {itens.map((i) => {
              const e = i.encomenda!;
              return (
                <li key={i.id}>
                  <p className={s.pNome}>{i.nome}</p>
                  <p className={s.pDet}>
                    Pedir com {textoPrazo(e.prazoHoras)} de antecedência
                    {e.retirada && ` · retirada ${textoDias(e.retirada.dias)}`}
                    {e.entrega && ` · entrega ${textoDias(e.entrega.dias)}`}
                    {e.ultimaData && ` · até ${dataCurta(e.ultimaData)}`}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <p className={`wrap ${s.nota}`}>Fotos ilustrativas. Nomes, preços, prazos e chave Pix são de exemplo (site de demonstração).</p>
    </>
  );
}
