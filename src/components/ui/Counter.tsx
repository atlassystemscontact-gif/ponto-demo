"use client";

// "Counter" (Superdesign Library / React Bits): dígitos que rolam até o novo valor.
// Usado nos preços que mudam ao vivo (painel do item, total da sacola).
import { formatarPreco } from "@/lib/cardapio";
import s from "./Counter.module.css";

export function Preco({ centavos, className }: { centavos: number; className?: string }) {
  const txt = formatarPreco(centavos);
  return (
    <span className={`${s.counter} ${className ?? ""}`} aria-label={txt} role="text">
      {txt.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i + "-" + (txt.length - i)} className={s.slot} aria-hidden="true">
            <span className={s.strip} style={{ transform: `translateY(${-Number(ch) * 10}%)` }}>
              {"0123456789".split("").map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i + "-" + (txt.length - i)} aria-hidden="true">
            {ch === " " ? " " : ch}
          </span>
        ),
      )}
    </span>
  );
}
