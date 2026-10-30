import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { PROMO } from "../../data/boost";
import { useReducedMotion } from "../../hooks";
import ScratchCard from "./ScratchCard";
import Confetti from "./Confetti";

const COUNTDOWN = 3;

export default function LuckScreen({ onDone }) {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [left, setLeft] = useState(COUNTDOWN);
  const [copied, setCopied] = useState(false);

  const reveal = () => {
    if (revealed) return;
    setRevealed(true);
    navigator.vibrate?.(60);
    window.dataLayer?.push({ event: "luck_reveal", promo: PROMO.code });
  };

  useEffect(() => {
    if (!revealed) return;
    if (left === 0) {
      onDone(PROMO);
      return;
    }
    const id = setTimeout(() => setLeft((s) => s - 1), reduced ? 1000 : 1400);
    return () => clearTimeout(id);
  }, [revealed, left, onDone, reduced]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROMO.code);
      setCopied(true);
    } catch {}
  };

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#eff8fe] to-[#cfe9fc] px-4 py-8 text-center text-navy">
      {/* Sun rays */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 left-1/2 size-[160vmax] -translate-x-1/2 -translate-y-1/2 animate-spin-slow transition-opacity duration-700 ${
          revealed ? "opacity-100" : "opacity-40"
        }`}
        style={{
          background:
            "repeating-conic-gradient(from 0deg, rgba(69,173,237,0.22) 0deg 7deg, transparent 7deg 18deg)",
          maskImage: "radial-gradient(circle, black 0%, transparent 55%)",
          WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 55%)",
        }}
      />
      {revealed && <Confetti />}

      <div className={`relative w-full max-w-sm ${revealed ? "animate-[prize-pop_0.6s_cubic-bezier(0.34,1.56,0.64,1)]" : "animate-pop-in"}`}>
        <div className="rounded-[2rem] bg-gradient-to-b from-primary to-secondary p-4 pt-6 shadow-[0_24px_60px_-12px_rgba(21,79,137,0.5)]">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Try your luck</h2>

          <ScratchCard revealed={revealed} onReveal={reveal} className="mt-4 rounded-2xl">
            <div
              className="flex aspect-[4/4.2] flex-col items-center justify-center rounded-2xl border border-white/25 px-4 text-white"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-60deg, rgba(255,255,255,0.05) 0 6px, transparent 6px 14px), linear-gradient(160deg, #2f8fd6, #154f89)",
              }}
            >
              <p className="text-7xl leading-none font-bold tracking-tight sm:text-8xl">{PROMO.percent}%</p>
              <p className="mt-1 text-3xl font-bold sm:text-4xl">off</p>
              <p className="mt-6 text-white/80">on your Speakeasy BOOST plan</p>
            </div>
          </ScratchCard>

          <div className="mt-4 rounded-2xl bg-white px-4 py-3">
            <p className="text-sm text-secondary/70">promo code</p>
            {revealed ? (
              <button
                type="button"
                onClick={copy}
                className="group inline-flex animate-pop-in items-center gap-2 text-3xl font-bold tracking-tight text-navy"
                aria-label={`Copy promo code ${PROMO.code}`}
              >
                {PROMO.code}
                <Copy className="size-4 text-primary opacity-60 group-hover:opacity-100" />
              </button>
            ) : (
              <p aria-label="Hidden until you scratch" className="text-3xl font-bold tracking-[0.2em] text-[#bfe2fa]">
                ••••••••
              </p>
            )}
            {copied && <p className="text-xs font-bold text-emerald-600">Copied!</p>}
          </div>
        </div>
      </div>

      <div className="relative mt-8 h-24">
        {revealed ? (
          <div className="animate-pop-in">
            <p className="text-lg font-medium text-secondary" role="status">
              Applied automatically at checkout
            </p>
            <div className="relative mx-auto mt-3 size-12">
              <svg viewBox="0 0 48 48" className="size-full -rotate-90" aria-hidden="true">
                <circle cx="24" cy="24" r="20" fill="white" stroke="#dbeefc" strokeWidth="3" />
                <circle
                  key={left}
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#45aded"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength="1"
                  strokeDasharray="1"
                  className="animate-[countdown-ring_1.4s_linear_forwards]"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold tabular-nums">{Math.max(left, 1)}</span>
            </div>
          </div>
        ) : (
          <div className="animate-pop-in" style={{ animationDelay: "400ms" }}>
            <p className="font-medium text-secondary">Scratch the card to see what you won 🎁</p>
            <button type="button" onClick={reveal} className="mt-2 text-sm font-bold text-primary underline-offset-4 hover:underline">
              or tap to reveal
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
