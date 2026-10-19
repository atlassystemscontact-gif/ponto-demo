"use client";

import { useEffect, type RefObject } from "react";

// Comportamento de janela modal: Esc fecha, foco preso dentro, rolagem da página travada,
// foco volta para onde estava ao fechar.
export function useModal(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const antes = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    // o resto da página fica inerte enquanto a janela está aberta (leitor de tela e teclado)
    const fundo = [...document.querySelectorAll<HTMLElement>("body > header, body > main, body > footer, body > a")];
    fundo.forEach((el) => (el.inert = true));

    const foco = () => {
      const el = ref.current;
      if (!el) return;
      const alvo = el.querySelector<HTMLElement>("[data-autofocus]") ?? el;
      alvo.focus({ preventScroll: true });
    };
    const t = window.setTimeout(foco, 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const f = [...ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),textarea,select,[tabindex]:not([tabindex="-1"])')].filter(
        (x) => x.offsetParent !== null,
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      html.style.overflow = overflow;
      fundo.forEach((el) => (el.inert = false));
      antes?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, ref]);
}
