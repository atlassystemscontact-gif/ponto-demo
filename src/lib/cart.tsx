"use client";

// Estado do pedido: linhas do carrinho, gaveta do carrinho e painel do item.
// Carrinho salvo no navegador (localStorage, sempre em try/catch).
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { acharItem, chaveLinha, precoUnitario, type Config, type Linha } from "./pedido";

type Painel = { id: string; editando?: string } | null;

type Ctx = {
  linhas: Linha[];
  adicionar: (id: string, config: Config, qtd: number) => void;
  substituir: (chaveAntiga: string, id: string, config: Config, qtd: number) => void;
  setQtd: (chave: string, qtd: number) => void;
  remover: (chave: string) => void;
  limpar: () => void;
  qtdTotal: number;
  subtotal: number;
  gavetaAberta: boolean;
  setGaveta: (v: boolean) => void;
  painel: Painel;
  abrirItem: (id: string, editando?: string) => void;
  fecharItem: () => void;
  pulso: number; // muda a cada item adicionado (anima o botão flutuante)
  ultimo: string | null; // id do último item adicionado
};

const C = createContext<Ctx | null>(null);
const KEY = "ponto-pedido-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [gavetaAberta, setGaveta] = useState(false);
  const [painel, setPainel] = useState<Painel>(null);
  const [pulso, setPulso] = useState(0);
  const [ultimo, setUltimo] = useState<string | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const salvo = JSON.parse(raw) as Linha[];
        setLinhas(salvo.filter((l) => acharItem(l.id)));
      }
    } catch {}
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(linhas));
    } catch {}
  }, [linhas, pronto]);

  const adicionar = useCallback((id: string, config: Config, qtd: number) => {
    const chave = chaveLinha(id, config);
    setLinhas((prev) => {
      const achou = prev.find((l) => l.chave === chave);
      if (achou) return prev.map((l) => (l === achou ? { ...l, qtd: Math.min(l.qtd + qtd, 20) } : l));
      return [...prev, { chave, id, qtd, config }];
    });
    setPulso((p) => p + 1);
    setUltimo(id);
  }, []);

  const substituir = useCallback((antiga: string, id: string, config: Config, qtd: number) => {
    const chave = chaveLinha(id, config);
    setLinhas((prev) => {
      const sem = prev.filter((l) => l.chave !== antiga);
      const igual = sem.find((l) => l.chave === chave);
      if (igual) return sem.map((l) => (l === igual ? { ...l, qtd: Math.min(l.qtd + qtd, 20) } : l));
      const idx = prev.findIndex((l) => l.chave === antiga);
      const nova = { chave, id, qtd, config };
      const out = [...sem];
      out.splice(Math.max(0, idx), 0, nova);
      return out;
    });
  }, []);

  const setQtd = useCallback((chave: string, qtd: number) => {
    setLinhas((prev) => prev.map((l) => (l.chave === chave ? { ...l, qtd: Math.max(1, Math.min(20, qtd)) } : l)));
  }, []);
  const remover = useCallback((chave: string) => setLinhas((prev) => prev.filter((l) => l.chave !== chave)), []);
  const limpar = useCallback(() => setLinhas([]), []);
  const abrirItem = useCallback((id: string, editando?: string) => setPainel({ id, editando }), []);
  const fecharItem = useCallback(() => setPainel(null), []);

  const value = useMemo(() => {
    const qtdTotal = linhas.reduce((n, l) => n + l.qtd, 0);
    const subtotal = linhas.reduce((s, l) => {
      const item = acharItem(l.id);
      return s + (item ? precoUnitario(item, l.config) * l.qtd : 0);
    }, 0);
    return { linhas, adicionar, substituir, setQtd, remover, limpar, qtdTotal, subtotal, gavetaAberta, setGaveta, painel, abrirItem, fecharItem, pulso, ultimo };
  }, [linhas, adicionar, substituir, setQtd, remover, limpar, gavetaAberta, painel, abrirItem, fecharItem, pulso, ultimo]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useCart() {
  const v = useContext(C);
  if (!v) throw new Error("useCart fora do CartProvider");
  return v;
}
