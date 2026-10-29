import { useEffect, useRef, useState } from "react";
import { Check, Star } from "lucide-react";
import logo from "./assets/logo.png";
import t1 from "./assets/t1.jpg";
import t2 from "./assets/t2.jpg";
import t3 from "./assets/t3.jpg";
import t4 from "./assets/t4.jpg";
import Headline from "./components/Headline";
import LanguagePicker from "./components/LanguagePicker";
import CallCard from "./components/CallCard";
import CtaButton from "./components/CtaButton";
import GreetingMarquee from "./components/GreetingMarquee";
import { LANGUAGES } from "./data/languages";
import { useReducedMotion } from "./hooks";

// Where "Call Renald Now" sends people; the picked language is appended as ?lang=.
const CALL_URL = "https://speakeasy-cro.vercel.app/";
const AUTO_ROTATE_MS = 7000;
const PERKS = ["No sign-up", "Speak or type", "Free speaking report"];

function Sparkles() {
  const spots = [
    { c: "top-[18%] left-[6%] size-6", d: "0s" },
    { c: "top-[12%] right-[38%] size-4", d: "0.8s" },
    { c: "bottom-[24%] left-[44%] size-5", d: "1.6s" },
    { c: "top-[30%] right-[4%] size-7", d: "0.4s" },
    { c: "bottom-[30%] left-[3%] size-3", d: "1.2s" },
  ];
  return spots.map((s, i) => (
    <svg
      key={i}
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute animate-pulse text-white/70 ${s.c}`}
      style={{ animationDelay: s.d, animationDuration: "2.4s" }}
    >
      <path fill="currentColor" d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z" />
    </svg>
  ));
}

export default function App() {
  const reduced = useReducedMotion();
  const [code, setCode] = useState("en");
  const [touched, setTouched] = useState(false);
  const sectionRef = useRef(null);
  const lang = LANGUAGES.find((l) => l.code === code);

  // Cycle languages until the visitor picks one themselves.
  useEffect(() => {
    if (touched || reduced) return;
    const id = setInterval(() => {
      setCode((c) => LANGUAGES[(LANGUAGES.findIndex((l) => l.code === c) + 1) % LANGUAGES.length].code);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [touched, reduced]);

  const pick = (next, byUser) => {
    setCode(next);
    if (byUser) setTouched(true);
  };

  const onPointerMove = (e) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = sectionRef.current.getBoundingClientRect();
    sectionRef.current.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5) * 2);
    sectionRef.current.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      className="relative flex min-h-svh flex-col overflow-hidden bg-hero"
    >
      {/* Hand-drawn squiggle from the main site */}
      <svg
        aria-hidden="true"
        viewBox="0 0 390 248"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="pointer-events-none absolute top-1/2 left-1/2 h-auto w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-30"
      >
        <path
          d="M380.267 187.015C366.345 207.319 350.156 240.876 321.746 238.676C311.249 237.792 302.848 229.312 301.193 219.086C298.892 204.984 303.834 192.082 307.927 178.444C313.346 161.802 320.261 145.67 327.052 129.481C334.342 110.673 345.622 90.1765 341.54 69.5663C337.368 49.4663 314.321 43.5598 298.381 53.7969C271.241 76.7198 235.088 128.393 211.168 152.676C203.731 159.614 191.431 158.945 185.354 149.91C180.026 141.725 180.717 130.83 182.679 121.908C188.517 97.6927 202.031 59.5446 203.289 36.0436C204.808 19.9114 192.236 10.6833 177.623 9.11886C148.669 6.81751 114.205 38.4697 94.5356 57.6061C79.1404 73.3641 65.4683 91.1401 52.8845 109.778C29.4628 146.135 14.487 180.61 33.2606 201.208C40.7995 209.53 54.6303 215.13 66.4432 212.693C89.4454 209.008 100.283 187.525 104.251 166.223C108.253 147.382 108.82 128.313 105.158 109.392C94.0255 49.6363 45.1188 32.2118 9 85.7325"
          stroke="#3079AA"
          strokeWidth="18"
          strokeMiterlimit="10"
          strokeLinecap="round"
          pathLength="1"
          className="draw-path animate-draw"
          style={{ animationDuration: "3.5s" }}
        />
      </svg>
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute top-1/2 right-[-10%] size-[46rem] -translate-y-1/2 rounded-full bg-white/20 blur-3xl"
        style={{ "--d": -20 }}
      />
      <Sparkles />

      {/* Top bar */}
      <header className="site-container relative z-30 pt-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-border bg-white py-2.5 pr-2.5 pl-5 shadow-lg">
          <img src={logo} alt="Speakeasy" className="h-8" />
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-tint px-3 py-1.5 text-xs font-bold text-secondary sm:text-sm">
            <span className="relative flex size-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400" />
              <span className="relative size-2.5 rounded-full bg-emerald-500" />
            </span>
            Renald is online now
          </span>
        </div>
      </header>

      {/* Campaign content */}
      <div className="site-container relative z-10 grid flex-1 items-center gap-12 py-10 sm:gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:py-10">
        <div className="text-center lg:text-left">
          <Headline />

          <p
            className="mx-auto mt-6 max-w-xl animate-word text-lg font-medium text-white/90 md:text-xl lg:mx-0"
            style={{ animationDelay: "800ms" }}
          >
            No drama, no long tests — just a conversation.
          </p>

          <div className="mt-7">
            <p
              className="mb-3 animate-word text-xs font-bold tracking-[0.18em] text-white/80 uppercase"
              style={{ animationDelay: "850ms" }}
            >
              Step 1 · Pick your language
            </p>
            <LanguagePicker value={code} onChange={pick} />
          </div>

          <div className="mt-8 animate-pop-in" style={{ animationDelay: "1300ms" }}>
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <CtaButton href={`${CALL_URL}?lang=${lang.code}`} lang={lang} />
              <p className="flex items-center gap-2 text-sm font-medium text-white/90" aria-live="polite">
                <img key={lang.code} src={lang.flag} alt="" className="size-6 animate-pop-in rounded-full object-cover ring-2 ring-white/60" />
                <span>
                  Your call will be in <strong className="font-bold text-white">{lang.name}</strong>
                </span>
              </p>
            </div>

            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm font-medium text-white/90 lg:justify-start">
              {PERKS.map((p) => (
                <li key={p} className="flex items-center gap-1.5">
                  <Check className="size-4 text-emerald-300" strokeWidth={3} />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="mt-8 flex animate-word items-center justify-center gap-3 lg:justify-start"
            style={{ animationDelay: "1600ms" }}
          >
            <div className="flex -space-x-3">
              {[t1, t2, t3, t4].map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="size-10 rounded-full border-2 border-white object-cover transition-transform hover:z-10 hover:-translate-y-1"
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex text-amber-300" aria-label="Rated 5 out of 5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="text-sm font-medium text-white/90">Loved by learners around the world</p>
            </div>
          </div>
        </div>

        <div className="animate-pop-in pb-10 sm:px-12 lg:px-0" style={{ animationDelay: "500ms" }}>
          <div className="parallax" style={{ "--d": 8 }}>
            <CallCard lang={lang} />
          </div>
        </div>
      </div>

      <GreetingMarquee />
    </section>
  );
}
