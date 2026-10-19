"use client";

// Cabeçalho: "Shrinking Sticky Header" + "Pill Nav" (Superdesign Library), com vidro escuro
// e pílula central inspirados na Morpho. No topo ocupa a largura toda; ao rolar, encolhe
// para uma pílula única centralizada.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";
import s from "./Header.module.css";

const links = [
  { href: "/", label: "Início" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/encomendas", label: "Encomendas" },
  { href: "/#historia", label: "A casa" },
  { href: "/#visite", label: "Visite" },
];

export function Header() {
  const [compacto, setCompacto] = useState(false);
  const [menu, setMenu] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const path = usePathname();
  const { qtdTotal, setGaveta, pulso } = useCart();
  const reduz = useReducedMotion();

  useEffect(() => {
    const on = () => setCompacto(window.scrollY > 72);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setMenu(false), [path]);

  const ativo = (href: string) => (href === "/" ? path === "/" : href.startsWith("/#") ? false : path.startsWith(href));

  return (
    <header className={s.header} data-compacto={compacto || undefined}>
      <div className={s.bar}>
        <Link href="/" className={s.logo} aria-label="Ponto, página inicial">
          <Logo />
        </Link>

        <nav aria-label="Principal" className={s.nav} onMouseLeave={() => setHover(null)}>
          <ul>
            {links.map((l) => {
              const on = hover ? hover === l.href : ativo(l.href);
              return (
                <li key={l.href}>
                  <Link href={l.href} onMouseEnter={() => setHover(l.href)} aria-current={ativo(l.href) ? "page" : undefined} className={s.link}>
                    {on && (
                      <motion.span
                        layoutId="pill"
                        className={s.pill}
                        transition={reduz ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 40 }}
                      />
                    )}
                    <span className={s.linkTxt}>{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={s.actions}>
          <button className={s.bag} onClick={() => setGaveta(true)} aria-label={`Abrir sacola, ${qtdTotal} ${qtdTotal === 1 ? "item" : "itens"}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 8h12l-1 12H7L6 8Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <span className={s.bagTxt}>Sacola</span>
            <motion.span
              key={pulso}
              className={s.count}
              initial={reduz || pulso === 0 ? false : { scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 18 }}
            >
              {qtdTotal}
            </motion.span>
          </button>
          <button className={s.burger} aria-expanded={menu} aria-controls="menu-movel" onClick={() => setMenu((v) => !v)}>
            <span className="sr-only">{menu ? "Fechar menu" : "Abrir menu"}</span>
            <span aria-hidden="true" className={s.burgerLines} data-open={menu || undefined} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.nav
            id="menu-movel"
            aria-label="Menu"
            className={s.mobile}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          >
            <ul>
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduz ? 0 : 0.04 * i + 0.05, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Link href={l.href} onClick={() => setMenu(false)}>
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
