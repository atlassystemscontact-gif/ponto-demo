"use client";

// Painel do item: escolha única (tamanho, leite, pão), "Sem ..." e adicionais pagos,
// observação, quantidade e total ao vivo. Lateral no desktop, de baixo no celular.
// Em encomendas: preço cheio em cada tamanho, prazo e campo de mensagem (bolo/cartão).
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { formatarPreco, type Item } from "@/lib/cardapio";
import { acharItem, configPadrao, precoMinimo, precoUnitario, type Config } from "@/lib/pedido";
import { useCart } from "@/lib/cart";
import { textoPrazo } from "@/lib/agenda";
import { useModal } from "@/lib/useModal";
import { Preco } from "./ui/Counter";
import s from "./ItemSheet.module.css";

export function ItemSheet() {
  const { painel, fecharItem, linhas } = useCart();
  const item = painel ? acharItem(painel.id) : undefined;
  const linha = painel?.editando ? linhas.find((l) => l.chave === painel.editando) : undefined;
  return (
    <AnimatePresence>
      {item && <Painel key={item.id + (painel?.editando ?? "")} item={item} inicial={linha?.config} qtdInicial={linha?.qtd} editando={painel?.editando} onClose={fecharItem} />}
    </AnimatePresence>
  );
}

function Painel({ item, inicial, qtdInicial, editando, onClose }: { item: Item; inicial?: Config; qtdInicial?: number; editando?: string; onClose: () => void }) {
  const [c, setC] = useState<Config>(() => (inicial ? structuredClone(inicial) : configPadrao(item)));
  const [qtd, setQtd] = useState(qtdInicial ?? 1);
  const [mobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches);
  const { adicionar, substituir } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  const reduz = useReducedMotion();
  const fechar = useCallback(() => onClose(), [onClose]);
  useModal(ref, true, fechar);

  const unit = useMemo(() => precoUnitario(item, c), [item, c]);
  const total = unit * qtd;
  const enc = item.encomenda;
  // preço cheio de cada tamanho (com o resto já escolhido), sempre via precoUnitario
  const precoCom = (grupo: string, opcao: string) => precoUnitario(item, { ...c, opcoes: { ...c.opcoes, [grupo]: opcao } });

  const toggleRemover = (r: string) =>
    setC((p) => ({ ...p, remover: p.remover.includes(r) ? p.remover.filter((x) => x !== r) : [...p.remover, r] }));
  const setAd = (id: string, q: number) => setC((p) => ({ ...p, adicionais: { ...p.adicionais, [id]: Math.max(0, q) } }));

  const confirmar = () => {
    if (editando) substituir(editando, item.id, c, qtd);
    else adicionar(item.id, c, qtd);
    onClose();
  };

  const tituloId = `item-${item.id}-titulo`;
  const anim = reduz
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : mobile
      ? { initial: { y: "100%", x: 0 }, animate: { y: 0, x: 0 }, exit: { y: "100%" } }
      : { initial: { x: "100%", y: 0 }, animate: { x: 0, y: 0 }, exit: { x: "100%" } };

  return (
    <div className={s.root}>
      <motion.div className={s.overlay} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.24 }} />
      <motion.div
        ref={ref}
        className={s.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        tabIndex={-1}
        {...anim}
        transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className={s.scroll}>
          <div className={s.foto}>
            <img src={item.foto} alt="" />
            <button className={s.fechar} onClick={onClose} data-autofocus>
              <span className="sr-only">Fechar</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            {item.selo && <span className={s.selo}>{item.selo}</span>}
          </div>

          <div className={s.corpo}>
            <h2 id={tituloId} className={s.nome}>
              {item.nome}
            </h2>
            <p className={s.desc}>{item.descricao}</p>
            <p className={s.base}>{item.opcoes?.length ? `A partir de ${formatarPreco(precoMinimo(item))}` : formatarPreco(item.preco)}</p>
            {enc && (
              <p className={s.prazo}>
                Encomenda: pede {textoPrazo(enc.prazoHoras)} de antecedência. A data e a janela você escolhe ao finalizar.
              </p>
            )}

            {item.opcoes?.map((g) => (
              <fieldset key={g.id} className={s.grupo}>
                <legend>
                  {g.titulo} <span className={s.obrig}>escolha 1</span>
                </legend>
                <div className={s.pills}>
                  {g.itens.map((o) => {
                    const id = `${item.id}-${g.id}-${o.id}`;
                    return (
                      <label key={o.id} htmlFor={id} className={s.pillOp}>
                        <input
                          id={id}
                          type="radio"
                          name={`${item.id}-${g.id}`}
                          checked={c.opcoes[g.id] === o.id}
                          onChange={() => setC((p) => ({ ...p, opcoes: { ...p.opcoes, [g.id]: o.id } }))}
                        />
                        <span>
                          {o.nome}
                          {enc && g.id === "tamanho" ? (
                            <em>{formatarPreco(precoCom(g.id, o.id))}</em>
                          ) : (
                            o.acrescimo !== 0 && <em>{o.acrescimo > 0 ? `+${formatarPreco(o.acrescimo)}` : `−${formatarPreco(-o.acrescimo)}`}</em>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            {!!item.remover?.length && (
              <fieldset className={s.grupo}>
                <legend>Tirar algum ingrediente?</legend>
                <div className={s.lista}>
                  {item.remover.map((r) => {
                    const id = `${item.id}-sem-${r}`;
                    return (
                      <label key={r} htmlFor={id} className={s.check}>
                        <input id={id} type="checkbox" checked={c.remover.includes(r)} onChange={() => toggleRemover(r)} />
                        <span className={s.box} aria-hidden="true" />
                        <span>Sem {r.charAt(0).toLowerCase() + r.slice(1)}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {!!item.adicionais?.length && (
              <fieldset className={s.grupo}>
                <legend>Turbinar</legend>
                <div className={s.lista}>
                  {item.adicionais.map((a) => {
                    const q = c.adicionais[a.id] ?? 0;
                    const max = a.max ?? 1;
                    const preco = a.preco ? `+${formatarPreco(a.preco)}` : "grátis";
                    if (max <= 1) {
                      const id = `${item.id}-ad-${a.id}`;
                      return (
                        <label key={a.id} htmlFor={id} className={s.check}>
                          <input id={id} type="checkbox" checked={q > 0} onChange={() => setAd(a.id, q > 0 ? 0 : 1)} />
                          <span className={s.box} aria-hidden="true" />
                          <span className={s.adNome}>{a.nome}</span>
                          <span className={s.adPreco}>{preco}</span>
                        </label>
                      );
                    }
                    return (
                      <div key={a.id} className={s.check} role="group" aria-label={a.nome}>
                        <span className={s.adNome}>
                          {a.nome} <small>até {max}</small>
                        </span>
                        <span className={s.adPreco}>{preco}</span>
                        <Stepper valor={q} min={0} max={max} onChange={(v) => setAd(a.id, v)} rotulo={a.nome} pequeno />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {enc?.mensagem && (
              <div className={s.grupo}>
                <label htmlFor={`${item.id}-msg`} className={s.legend}>
                  {enc.mensagem.rotulo} <span className={s.obrig}>{enc.mensagem.preco ? `opcional · +${formatarPreco(enc.mensagem.preco)}` : "opcional"}</span>
                </label>
                {enc.mensagem.dica && (
                  <p id={`${item.id}-msg-dica`} className={s.dica}>
                    {enc.mensagem.dica}
                  </p>
                )}
                <textarea
                  id={`${item.id}-msg`}
                  className={s.obs}
                  rows={enc.mensagem.limite > 60 ? 3 : 1}
                  maxLength={enc.mensagem.limite}
                  aria-describedby={enc.mensagem.dica ? `${item.id}-msg-dica ${item.id}-msg-cont` : `${item.id}-msg-cont`}
                  value={c.mensagem ?? ""}
                  onChange={(e) => setC((p) => ({ ...p, mensagem: e.target.value }))}
                />
                <span id={`${item.id}-msg-cont`} className={s.contador}>
                  {(c.mensagem ?? "").length}/{enc.mensagem.limite} caracteres
                </span>
              </div>
            )}

            <div className={s.grupo}>
              <label htmlFor={`${item.id}-obs`} className={s.legend}>
                {enc ? "Alguma observação para a cozinha?" : "Algum recado para o balcão?"}
              </label>
              <textarea
                id={`${item.id}-obs`}
                className={s.obs}
                rows={2}
                maxLength={140}
                placeholder={enc ? "Ex.: alergia a amendoim, sem velas" : "Ex.: bem passado, pouco gelo, cortar ao meio"}
                value={c.obs}
                onChange={(e) => setC((p) => ({ ...p, obs: e.target.value }))}
              />
              <span className={s.contador}>{c.obs.length}/140</span>
            </div>
          </div>
        </div>

        <div className={s.rodape}>
          <Stepper valor={qtd} min={1} max={20} onChange={setQtd} rotulo="Quantidade" />
          <button className={`btn btn-dark ${s.add}`} onClick={confirmar}>
            <span>{editando ? "Salvar" : "Adicionar"}</span>
            <span className={s.sep} aria-hidden="true" />
            <Preco centavos={total} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function Stepper({ valor, min, max, onChange, rotulo, pequeno }: { valor: number; min: number; max: number; onChange: (v: number) => void; rotulo: string; pequeno?: boolean }) {
  return (
    <div className={s.stepper} data-pequeno={pequeno || undefined}>
      <button type="button" onClick={() => onChange(valor - 1)} disabled={valor <= min} aria-label={`Diminuir ${rotulo}`}>
        −
      </button>
      <output aria-live="polite" aria-label={rotulo}>
        {valor}
      </output>
      <button type="button" onClick={() => onChange(valor + 1)} disabled={valor >= max} aria-label={`Aumentar ${rotulo}`}>
        +
      </button>
    </div>
  );
}
