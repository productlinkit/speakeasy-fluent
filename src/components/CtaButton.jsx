import { useState } from "react";
import { Phone } from "lucide-react";
import { useReducedMotion } from "../hooks";

const COLORS = ["#ffffff", "#d78bfd", "#9389f0", "#fcd34d", "#6ee7b7", "#154f89"];

function burst() {
  return Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 90 + Math.random() * 110;
    return {
      id: i,
      color: COLORS[i % COLORS.length],
      dx: `${Math.cos(angle) * dist}px`,
      dy: `${Math.sin(angle) * dist * 0.7 - 30}px`,
      rot: `${Math.random() * 540 - 270}deg`,
      size: 6 + Math.random() * 6,
      round: i % 3 === 0,
    };
  });
}

export default function CtaButton({ href, lang }) {
  const reduced = useReducedMotion();
  const [pieces, setPieces] = useState([]);
  const [calling, setCalling] = useState(false);

  const onClick = (e) => {
    window.dataLayer?.push({ event: "call_cta_click", location: "campaign_hero", language: lang.code });
    // Modified clicks (new tab etc.) keep native behaviour.
    if (reduced || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setPieces(burst());
    setCalling(true);
    setTimeout(() => window.location.assign(href), 750);
  };

  return (
    <div className="relative inline-flex w-full sm:w-auto">
      {/* Idle attention pulse */}
      <span aria-hidden="true" className="absolute inset-0 animate-cta-pulse rounded-full bg-white/50" />

      <a
        href={href}
        onClick={onClick}
        className="button-3d group relative inline-flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-secondary px-9 text-lg font-bold whitespace-nowrap text-white outline-none focus-visible:ring-4 focus-visible:ring-white/70 sm:w-auto md:h-[4.25rem] md:px-11 md:text-xl"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
        <span className="relative flex size-9 items-center justify-center rounded-full bg-white text-secondary">
          <Phone
            className={`size-[18px] fill-current ${calling ? "animate-ring" : "animate-[ring_1.6s_ease-in-out_infinite_2s]"}`}
          />
        </span>
        <span className="relative">{calling ? "Calling Renald…" : "Call Renald Now"}</span>
      </a>

      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        {pieces.map((p) => (
          <span
            key={p.id}
            className="confetti-piece"
            style={{
              "--dx": p.dx,
              "--dy": p.dy,
              "--rot": p.rot,
              width: p.size,
              height: p.round ? p.size : p.size * 0.45,
              background: p.color,
              borderRadius: p.round ? "999px" : "2px",
            }}
          />
        ))}
      </span>
    </div>
  );
}
