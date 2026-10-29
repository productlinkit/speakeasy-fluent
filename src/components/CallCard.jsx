import { useEffect, useState } from "react";
import { FileText, Mic, Zap } from "lucide-react";
import foxWave from "../assets/fox-wave.webp";
import { LEVELS } from "../data/languages";
import { useCountdown, useReducedMotion, useTypewriter } from "../hooks";

const TOTAL = 120;
const floatingCard =
  "card-3d relative flex items-center gap-3 p-3 animate-pop-in";

function Avatar({ speaking }) {
  return (
    <div className="relative">
      {speaking && (
        <>
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/70" />
          <span
            className="absolute inset-0 animate-pulse-ring rounded-full bg-white/50"
            style={{ animationDelay: "0.7s" }}
          />
        </>
      )}
      <div className="relative size-16 overflow-hidden rounded-full border-4 border-white bg-[#fde8d7] sm:size-20">
        <img src={foxWave} alt="Renald the fox" className="absolute top-[-22%] left-1/2 w-[190%] max-w-none -translate-x-1/2" />
      </div>
      <span className="absolute right-0.5 bottom-0.5 size-4 rounded-full border-2 border-white bg-emerald-400" />
    </div>
  );
}

function Equalizer({ active }) {
  return (
    <span aria-hidden="true" className="flex h-5 items-end gap-[3px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`h-full w-1 origin-bottom rounded-full bg-white ${active ? "animate-equalizer" : "scale-y-[0.3]"}`}
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  );
}

function TimerRing() {
  const left = useCountdown(TOTAL);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/15 py-1 pr-3 pl-1 text-sm font-bold text-white tabular-nums">
      <svg viewBox="0 0 36 36" className="size-7 -rotate-90" aria-hidden="true">
        <circle cx="18" cy="18" r="15" fill="none" stroke="rgb(255 255 255 / 0.25)" strokeWidth="4" />
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - left / TOTAL}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <span aria-label={`${mm} minutes ${ss} seconds left`}>
        {mm}:{ss}
      </span>
    </div>
  );
}

function LevelMeter({ level, show }) {
  const target = LEVELS.indexOf(level);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-bold">
        <span className="text-muted">Where you stand</span>
        <span
          className={`rounded-full bg-secondary px-2.5 py-0.5 text-white transition-all duration-500 ${
            show ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          You: {level}
        </span>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {LEVELS.map((l, i) => {
          const filled = show && i <= target;
          const isYou = show && i === target;
          return (
            <div key={l} className="text-center">
              <div className="h-2.5 overflow-hidden rounded-full bg-sky-tint">
                <div
                  className="h-full origin-left rounded-full bg-primary transition-transform duration-500 ease-out"
                  style={{ transform: `scaleX(${filled ? 1 : 0})`, transitionDelay: `${i * 140}ms` }}
                />
              </div>
              <span
                className={`mt-1 block text-[11px] font-bold transition-colors duration-300 ${
                  isYou ? "text-secondary" : "text-muted/70"
                }`}
                style={{ transitionDelay: `${i * 140}ms` }}
              >
                {l}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Remounted per language (via key) so the whole call replays.
function CallBody({ lang }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(reduced ? "speaking" : "dialing");
  const { typed, done } = useTypewriter(lang.line, { start: phase !== "dialing", speed: 34 });
  const [showLevel, setShowLevel] = useState(false);

  useEffect(() => {
    if (phase !== "dialing") return;
    const id = setTimeout(() => setPhase("speaking"), 900);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setShowLevel(true), 350);
    return () => clearTimeout(id);
  }, [done]);

  const speaking = phase === "speaking" && !done;

  return (
    <>
      {/* Call header */}
      <div className="relative bg-secondary px-5 pt-5 pb-14 text-white">
        <svg aria-hidden="true" viewBox="0 0 200 200" className="absolute -top-16 -right-16 size-56 animate-spin-slow opacity-15">
          <path
            fill="white"
            d="M100 0l12 68 62-30-44 54 70 8-70 8 44 54-62-30-12 68-12-68-62 30 44-54-70-8 70-8-44-54 62 30z"
          />
        </svg>
        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-white/80 uppercase">
            <img src={lang.flag} alt="" className="size-5 rounded-full object-cover" />
            {lang.native} call
          </span>
          <TimerRing />
        </div>
        <div className="relative mt-5 flex items-center gap-4">
          <Avatar speaking={speaking || phase === "dialing"} />
          <div>
            <p className="text-xl font-bold leading-tight">Renald</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-white/80">
              {phase === "dialing" ? (
                "Connecting…"
              ) : (
                <>
                  <Equalizer active={speaking} />
                  {speaking ? "Speaking" : "Your turn"}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="relative -mt-9 space-y-4 px-5 pb-5">
        <div className="min-h-[7.5rem] rounded-2xl rounded-tl-sm border-2 border-border bg-white p-4 shadow-[0_4px_0_0_var(--color-border)]">
          {phase === "dialing" ? (
            <span role="status" aria-label="Renald is typing" className="flex h-6 items-center gap-1 text-primary">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2 animate-typing-dot rounded-full bg-current" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </span>
          ) : (
            <>
              <p className="text-lg leading-snug font-bold text-foreground" lang={lang.code}>
                {typed}
                {!done && <span className="ml-0.5 inline-block h-5 w-0.5 translate-y-0.5 animate-blink bg-primary" />}
              </p>
              {lang.translation && (
                <p
                  className={`mt-1.5 text-sm text-muted transition-opacity duration-500 ${done ? "opacity-100" : "opacity-0"}`}
                >
                  {lang.translation}
                </p>
              )}
            </>
          )}
        </div>

        <div
          className={`flex items-center justify-end gap-2 transition-all duration-500 ${
            done ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <span className="rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm font-bold text-white">
            <Mic className="mr-1.5 inline size-4" />
            Just answer out loud…
          </span>
        </div>

        <LevelMeter level={lang.level} show={showLevel} />
      </div>
    </>
  );
}

export default function CallCard({ lang }) {
  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <div className="card-3d relative z-10 overflow-hidden rounded-[1.75rem] border-navy shadow-[0_8px_0_0_var(--color-navy)]">
        <CallBody key={lang.code} lang={lang} />
      </div>

      {/* Floating detail cards */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden sm:block">
        <div style={{ "--d": 18 }} className="parallax absolute -top-16 -left-10 xl:-left-20">
          <div className="animate-float">
            <div className={floatingCard} style={{ animationDelay: "1.4s" }}>
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-white">
                <FileText className="size-5" />
              </span>
              <div>
                <p className="text-sm leading-none font-bold">Speaking report</p>
                <p className="mt-1 text-[11px] text-muted">Level · Mistakes · Plan</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ "--d": 28 }} className="parallax absolute top-[17%] -right-12 xl:-right-24">
          <div className="animate-float" style={{ animationDelay: "1.2s" }}>
            <div className={floatingCard} style={{ animationDelay: "1.6s" }}>
              <span className="flex size-10 items-center justify-center rounded-xl bg-amber-300 text-navy">
                <Zap className="size-5 fill-current" />
              </span>
              <div>
                <p className="text-lg leading-none font-bold">+20 XP</p>
                <p className="mt-1 text-[11px] text-muted">Just for answering</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ "--d": 10 }} className="parallax absolute -bottom-7 -left-8 xl:-left-14">
          <div className="animate-float" style={{ animationDelay: "2.2s" }}>
            <div
              className="animate-pop-in rounded-full border-2 border-navy bg-white px-4 py-2 text-sm font-bold text-secondary shadow-[0_4px_0_0_var(--color-navy)]"
              style={{ animationDelay: "1.8s" }}
            >
              ⏱ ~2 min · no test
            </div>
          </div>
        </div>
      </div>

      <img
        src={foxWave}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -bottom-20 z-30 w-24 drop-shadow-xl sm:-right-24 sm:-bottom-20 sm:w-40"
      />
    </div>
  );
}
