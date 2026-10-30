import { useMemo } from "react";

const CONFETTI_COLORS = ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#45aded", "#154f89", "#fb923c"];

export default function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 2.6 + Math.random() * 2.4,
        drift: `${(Math.random() - 0.5) * 160}px`,
        spin: `${(Math.random() - 0.5) * 1080}deg`,
        w: 6 + Math.random() * 8,
        thin: i % 3 === 0,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    [],
  );
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute -top-6 rounded-[2px] opacity-80"
          style={{
            left: `${p.left}%`,
            width: p.thin ? 3 : p.w,
            height: p.thin ? p.w * 2 : p.w * 0.55,
            background: p.color,
            "--drift": p.drift,
            "--spin": p.spin,
            animation: `confetti-fall ${p.duration}s ${p.delay}s cubic-bezier(0.25, 0.6, 0.4, 1) forwards`,
          }}
        />
      ))}
    </div>
  );
}
