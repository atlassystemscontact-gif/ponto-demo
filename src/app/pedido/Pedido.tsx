"use client";

// Finalizar pedido: retirada ou entrega, dados mínimos, resumo e envio pelo WhatsApp.
// Nada é cobrado aqui; o pedido chega pronto como mensagem para o balcão.
// Com encomenda na sacola: escolhe data e janela (Agenda), mostra o sinal via Pix e a mensagem
// sai no formato de encomenda, com o código de rastreio no final.
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useCart } from "@/lib/cart";
import { acharItem, codigoPedido, mensagemEncomenda, mensagemWhatsApp, precoUnitario, resumoConfig, taxaDoPedido, valorSinal } from "@/lib/pedido";
import { formatarPreco } from "@/lib/cardapio";
import { WHATSAPP, loja } from "@/lib/data";
import { agenda } from "@/lib/encomendas";
import { avaliarDia, dataCurta, ehEncomenda, modoPossivel, textoJanela, unicos } from "@/lib/agenda";
import { Agenda } from "@/components/encomendas/Agenda";
import { Preco } from "@/components/ui/Counter";
import s from "./pedido.module.css";

type Erros = Partial<Record<"nome" | "whats" | "endereco" | "horario" | "data" | "janela", string>>;

const HORARIOS = ["O quanto antes", "7h00", "7h30", "8h00", "8h30", "9h00", "9h30", "10h00", "11h00", "12h00", "13h00", "14h00", "15h00", "16h00", "17h00", "18h00"];

export function Pedido() {
  const { linhas, subtotal, abrirItem, remover, limpar } = useCart();
  const [tipo, setTipo] = useState<"retirada" | "entrega">("retirada");
  const [nome, setNome] = useState("");
  const [whats, setWhats] = useState("");
  const [endereco, setEndereco] = useState("");
  const [horario, setHorario] = useState(HORARIOS[0]);
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState<{ numero: number; link: string; codigo?: string; sinal?: number } | null>(null);
  const [numero, setNumero] = useState(0);
  const [codigo, setCodigo] = useState("");
  const [quando, setQuando] = useState<{ data?: string; janela?: string }>({});
  const [copiou, setCopiou] = useState(false);

  useEffect(() => {
    setNumero(1000 + Math.floor(Math.random() * 9000));
    setCodigo(codigoPedido());
  }, []);

  const itensEnc = useMemo(() => unicos(linhas.map((l) => acharItem(l.id)).filter(ehEncomenda)), [linhas]);
  const temEncomenda = itensEnc.length > 0;
  const modos = useMemo(() => ({ retirada: modoPossivel(itensEnc, "retirada"), entrega: modoPossivel(itensEnc, "entrega") }), [itensEnc]);

  // se algum item da encomenda não aceita o modo marcado (ex.: só entrega), troca para o outro
  useEffect(() => {
    if (!temEncomenda || modos[tipo].ok) return;
    const outro = tipo === "retirada" ? "entrega" : "retirada";
    if (modos[outro].ok) setTipo(outro);
  }, [temEncomenda, modos, tipo]);

  const taxa = taxaDoPedido(tipo, temEncomenda);
  const total = subtotal + taxa;
  const sinal = temEncomenda ? valorSinal(total) : 0;
  const janelaEscolhida = quando.janela ? agenda.janelas[tipo].find((j) => j.id === quando.janela) : undefined;

  const validar = (): Erros => {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Diga seu nome para chamarmos no balcão.";
    const dig = whats.replace(/\D/g, "");
    if (dig.length < 10 || dig.length > 11) e.whats = "WhatsApp com DDD, ex.: (11) 91234-5678.";
    if (tipo === "entrega" && endereco.trim().length < 8) e.endereco = "Rua, número e complemento para a entrega.";
    if (temEncomenda) {
      if (!modos[tipo].ok) e.data = modos[tipo].motivo;
      else if (!quando.data) e.data = "Escolha o dia da encomenda no calendário.";
      else {
        const r = avaliarDia(quando.data, itensEnc, tipo, new Date());
        if (!r.ok) e.data = r.motivo;
        else if (!quando.janela || !r.janelas.some((j) => j.ok && j.janela.id === quando.janela)) e.janela = "Escolha a janela de horário.";
      }
    }
    return e;
  };

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    if (Object.keys(e).length) {
      const primeiro = Object.keys(e)[0];
      document.getElementById(primeiro)?.focus();
      return;
    }
    const msg =
      temEncomenda && quando.data && janelaEscolhida
        ? mensagemEncomenda(linhas, { codigo, tipo, nome: nome.trim(), data: quando.data, janela: janelaEscolhida, endereco: endereco.trim(), obs })
        : mensagemWhatsApp(
            linhas,
            { numero, tipo, nome: nome.trim(), horario: tipo === "retirada" ? horario : undefined, endereco: endereco.trim(), obs },
            loja.taxaEntrega,
          );
    const link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(link, "_blank", "noopener,noreferrer");
    setEnviado(temEncomenda ? { numero, link, codigo, sinal } : { numero, link });
    // encomenda enviada: esvazia a sacola para não mandar a mesma encomenda duas vezes
    // (a mensagem continua no botão "Abrir o WhatsApp de novo")
    if (temEncomenda) limpar();
    window.scrollTo({ top: 0 });
  };

  const mascara = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  };

  const resumo = useMemo(
    () =>
      linhas
        .map((l) => {
          const item = acharItem(l.id);
          return item ? { l, item, det: resumoConfig(item, l.config), sub: precoUnitario(item, l.config) * l.qtd } : null;
        })
        .filter(Boolean) as { l: (typeof linhas)[number]; item: NonNullable<ReturnType<typeof acharItem>>; det: string[]; sub: number }[],
    [linhas],
  );

  if (enviado?.codigo) {
    const copiar = async () => {
      try {
        await navigator.clipboard.writeText(loja.encomendas.chavePix);
        setCopiou(true);
      } catch {}
    };
    return (
      <section className={`wrap ${s.feito}`} role="status">
        <p className={`label ${s.kicker}`}>Pedido #{enviado.codigo}</p>
        <h1 className={`display ${s.titulo}`}>
          Encomenda montada. <em>Falta o sinal.</em>
        </h1>
        <p className={s.sub}>
          Abrimos o WhatsApp com tudo escrito. Envie a mensagem e faça o Pix de {formatarPreco(enviado.sinal ?? 0)} ({loja.encomendas.sinalPercentual}%). A encomenda só entra na agenda
          depois do sinal; o restante você paga na {tipo === "retirada" ? "retirada" : "entrega"}.
        </p>
        <div className={s.pix}>
          <p className="label">Chave Pix</p>
          <p className={s.chave}>{loja.encomendas.chavePix}</p>
          <button type="button" className="btn btn-ghost" onClick={copiar}>
            {copiou ? "Chave copiada" : "Copiar chave"}
          </button>
          <p className={s.aviso}>Mande o comprovante na mesma conversa do WhatsApp. Sua sacola foi esvaziada para a encomenda não sair duplicada.</p>
        </div>
        <div className={s.botoes}>
          <a href={enviado.link} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
            Abrir o WhatsApp de novo
          </a>
          <Link href="/encomendas" className="btn btn-ghost" onClick={() => limpar()}>
            Fazer outra encomenda
          </Link>
        </div>
        <p className={s.aviso}>Site de demonstração: número do WhatsApp e chave Pix são de exemplo. Nada é cobrado aqui.</p>
      </section>
    );
  }

  if (enviado) {
    return (
      <section className={`wrap ${s.feito}`} role="status">
        <p className={`label ${s.kicker}`}>Pedido #{enviado.numero}</p>
        <h1 className={`display ${s.titulo}`}>
          Pedido montado. <em>Agora é com o balcão.</em>
        </h1>
        <p className={s.sub}>
          Abrimos o WhatsApp com tudo escrito. É só tocar em enviar. {tipo === "retirada" ? `Fica pronto em ${loja.tempoPreparo}.` : "A entrega na Penha leva de 20 a 35 minutos."}
        </p>
        <div className={s.botoes}>
          <a href={enviado.link} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
            Abrir o WhatsApp de novo
          </a>
          <Link
            href="/cardapio"
            className="btn btn-ghost"
            onClick={() => {
              limpar();
            }}
          >
            Fazer outro pedido
          </Link>
        </div>
        <p className={s.aviso}>Site de demonstração: o número do WhatsApp é de exemplo e nenhum pagamento é feito aqui.</p>
      </section>
    );
  }

  if (!linhas.length) {
    return (
      <section className={`wrap ${s.feito}`}>
        <h1 className={`display ${s.titulo}`}>
          Sacola vazia. <em>Por enquanto.</em>
        </h1>
        <p className={s.sub}>Escolha alguma coisa no cardápio e volte aqui para finalizar.</p>
        <div className={s.botoes}>
          <Link href="/cardapio" className="btn btn-dark">
            Ver o cardápio
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className={`wrap ${s.pagina}`}>
      <header className={s.topo}>
        <p className={`label ${s.kicker}`}>Finalizar</p>
        <h1 className={`display ${s.titulo}`}>
          Quase no <em>ponto.</em>
        </h1>
      </header>

      <form className={s.form} onSubmit={enviar} noValidate>
        <fieldset className={s.bloco}>
          <legend className={s.legend}>Como você quer receber?</legend>
          <div className={s.tipos} role="radiogroup">
            {(["retirada", "entrega"] as const).map((t) => {
              const off = temEncomenda && !modos[t].ok;
              const det = !temEncomenda
                ? t === "retirada"
                  ? `Sem taxa · pronto em ${loja.tempoPreparo}`
                  : `${formatarPreco(loja.taxaEntrega)} · 20 a 35 min`
                : off
                  ? modos[t].motivo
                  : t === "retirada"
                    ? "Sem taxa · no dia e na janela que você marcar"
                    : `${formatarPreco(loja.encomendas.taxaEntrega)} · no dia e na janela que você marcar`;
              return (
                <label key={t} className={s.tipo} data-on={tipo === t || undefined} data-off={off || undefined}>
                  <input type="radio" name="tipo" value={t} checked={tipo === t} disabled={off} onChange={() => setTipo(t)} />
                  <span className={s.tipoNome}>{t === "retirada" ? "Retirar no balcão" : temEncomenda ? `Entrega na ${loja.encomendas.areaEntrega}` : "Entrega na Penha"}</span>
                  <span className={s.tipoDet}>{det}</span>
                </label>
              );
            })}
          </div>
          {temEncomenda && modos[tipo].ok && <Agenda itens={itensEnc} modo={tipo} valor={quando} onChange={setQuando} erroData={erros.data} erroJanela={erros.janela} />}
          {temEncomenda && !modos.retirada.ok && !modos.entrega.ok && (
            <p id="data" tabIndex={-1} className={s.erro}>
              {modos.retirada.motivo} {modos.entrega.motivo}
            </p>
          )}
        </fieldset>

        <fieldset className={s.bloco}>
          <legend className={s.legend}>Seus dados</legend>
          <Campo id="nome" rotulo="Nome" erro={erros.nome}>
            <input id="nome" autoComplete="given-name" value={nome} onChange={(e) => setNome(e.target.value)} aria-invalid={!!erros.nome} aria-describedby={erros.nome ? "nome-erro" : undefined} />
          </Campo>
          <Campo id="whats" rotulo="WhatsApp" erro={erros.whats}>
            <input
              id="whats"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(11) 91234-5678"
              value={whats}
              onChange={(e) => setWhats(mascara(e.target.value))}
              aria-invalid={!!erros.whats}
              aria-describedby={erros.whats ? "whats-erro" : undefined}
            />
          </Campo>
          <AnimatePresence initial={false} mode="wait">
            {tipo === "retirada" ? (
              // encomenda: o horário sai da janela escolhida no calendário
              !temEncomenda && <motion.div key="h" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                <Campo id="horario" rotulo="Horário de retirada">
                  <select id="horario" value={horario} onChange={(e) => setHorario(e.target.value)}>
                    {HORARIOS.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </Campo>
              </motion.div>
            ) : (
              <motion.div key="e" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                <Campo id="endereco" rotulo="Endereço de entrega" erro={erros.endereco}>
                  <input
                    id="endereco"
                    autoComplete="street-address"
                    placeholder="Rua, número, complemento"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    aria-invalid={!!erros.endereco}
                    aria-describedby={erros.endereco ? "endereco-erro" : undefined}
                  />
                </Campo>
              </motion.div>
            )}
          </AnimatePresence>
          <Campo id="obs" rotulo="Observação (opcional)">
            <textarea id="obs" rows={2} maxLength={200} value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Ex.: troco para R$ 50, interfone quebrado" />
          </Campo>
        </fieldset>

        <aside className={s.resumo} aria-labelledby="resumo-titulo">
          <h2 id="resumo-titulo" className={s.resumoTit}>
            Seu pedido
          </h2>
          <ul>
            {resumo.map(({ l, item, det, sub }) => (
              <li key={l.chave}>
                <img src={item.foto} alt="" />
                <div>
                  <p className={s.rNome}>
                    {l.qtd}x {item.nome}
                  </p>
                  {det.length > 0 && <p className={s.rDet}>{det.join(" · ")}</p>}
                  <p className={s.rAcoes}>
                    <button type="button" onClick={() => abrirItem(l.id, l.chave)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => remover(l.chave)}>
                      Remover
                    </button>
                  </p>
                </div>
                <span className={s.rPreco}>{formatarPreco(sub)}</span>
              </li>
            ))}
          </ul>
          <dl className={s.contas}>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatarPreco(subtotal)}</dd>
            </div>
            <div>
              <dt>Entrega</dt>
              <dd>{taxa ? formatarPreco(taxa) : "Grátis (retirada)"}</dd>
            </div>
            <div className={s.total}>
              <dt>Total</dt>
              <dd>
                <Preco centavos={total} />
              </dd>
            </div>
            {temEncomenda && (
              <>
                <div className={s.sinal}>
                  <dt>Sinal via Pix ({loja.encomendas.sinalPercentual}%)</dt>
                  <dd>
                    <Preco centavos={sinal} />
                  </dd>
                </div>
                <div>
                  <dt>Restante na {tipo === "retirada" ? "retirada" : "entrega"}</dt>
                  <dd>{formatarPreco(total - sinal)}</dd>
                </div>
              </>
            )}
          </dl>
          {temEncomenda && (
            <p className={s.confirma}>
              {quando.data && janelaEscolhida && (
                <strong>
                  {tipo === "retirada" ? "Retirada" : "Entrega"} {dataCurta(quando.data)} · {textoJanela(janelaEscolhida)}.{" "}
                </strong>
              )}
              A encomenda só é confirmada depois do sinal via Pix. A chave aparece quando você enviar o pedido.
            </p>
          )}
          <button type="submit" className={`btn btn-dark ${s.enviar}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2.1.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"
              />
            </svg>
            {temEncomenda ? "Enviar encomenda no WhatsApp" : "Enviar pedido no WhatsApp"}
          </button>
          <p className={s.aviso}>
            {temEncomenda
              ? "Você confere tudo no WhatsApp antes de enviar. Itens do balcão que estiverem na sacola saem junto, no dia da encomenda."
              : "Você confere tudo no WhatsApp antes de enviar. Pagamento no balcão ou na entrega (Pix, cartão ou dinheiro)."}
          </p>
        </aside>
      </form>
    </div>
  );
}

function Campo({ id, rotulo, erro, children }: { id: string; rotulo: string; erro?: string; children: React.ReactNode }) {
  return (
    <div className={s.campo} data-erro={erro ? true : undefined}>
      <label htmlFor={id}>{rotulo}</label>
      {children}
      {erro && (
        <p id={`${id}-erro`} className={s.erro}>
          {erro}
        </p>
      )}
    </div>
  );
}
