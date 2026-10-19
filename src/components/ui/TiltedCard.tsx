"use client";

// "Tilted Card" (Superdesign Library / React Bits): o cartão inclina levemente seguindo o mouse.
// Só em dispositivos com mouse; inclinação máxima pequena para não virar brinquedo.
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { ReactNode, PointerEvent } from "react";

export function TiltedCard({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 22 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22 });
  const reduz = useReducedMotion();

  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (reduz || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  };
  const sair = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div style={{ perspective: 900 }} onPointerMove={mover} onPointerLeave={sair} className={className}>
      <motion.div style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d", height: "100%" }}>{children}</motion.div>
    </div>
  );
}
