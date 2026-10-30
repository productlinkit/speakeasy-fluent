import { ArrowRight } from "lucide-react";
import { LANGUAGES } from "../../data/languages";
import { TOPICS } from "../../data/callScript";

export default function TopicPicker({ lang, onLangChange, onPick }) {
  return (
    <main className="relative flex-1 overflow-y-auto px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-5xl text-center">
        <p className="animate-word text-xs font-bold tracking-[0.18em] text-white/70 uppercase">Step 2 · Pick a topic</p>
        <h2
          className="mt-3 animate-word text-3xl leading-tight font-bold text-balance sm:text-5xl"
          style={{ animationDelay: "80ms" }}
        >
          What do you want to talk about?
        </h2>
        <p className="mt-3 animate-word text-white/75" style={{ animationDelay: "160ms" }}>
          Renald asks you 4 quick questions about it. About 2 minutes, then you get your report.
        </p>

        {/* Language recap, still changeable here */}
        <div
          className="mt-6 inline-flex animate-pop-in flex-wrap items-center justify-center gap-2 rounded-full bg-white/10 p-1.5 pr-4 backdrop-blur-sm"
          style={{ animationDelay: "220ms" }}
        >
          <div role="radiogroup" aria-label="Call language" className="flex gap-1">
            {LANGUAGES.map((l) => {
              const active = l.code === lang.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={l.name}
                  title={l.name}
                  onClick={() => onLangChange(l.code)}
                  className={`rounded-full p-0.5 transition-all ${active ? "scale-110 bg-white" : "opacity-60 hover:opacity-100"}`}
                >
                  <img src={l.flag} alt="" className="size-7 rounded-full object-cover" />
                </button>
              );
            })}
          </div>
          <span className="text-sm font-medium">
            Call in <strong className="font-bold">{lang.name}</strong>
          </span>
        </div>

        <ul className="mt-8 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t, i) => (
            <li key={t.id} className="animate-pop-in" style={{ animationDelay: `${300 + i * 70}ms` }}>
              <button
                type="button"
                onClick={() => onPick(t)}
                className="group card-3d flex w-full items-center gap-4 p-4 text-left transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[0_6px_0_0_var(--color-primary)] focus-visible:ring-4 focus-visible:ring-white/60 focus-visible:outline-none active:translate-y-1 active:shadow-none"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky-tint text-2xl transition-transform group-hover:animate-wiggle">
                  {t.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-foreground">{t.label}</span>
                  <span className="block text-sm text-muted">{t.blurb}</span>
                </span>
                <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
              </button>
            </li>
          ))}
          <li className="animate-pop-in" style={{ animationDelay: `${300 + TOPICS.length * 70}ms` }}>
            <button
              type="button"
              onClick={() => onPick(TOPICS[Math.floor(Math.random() * TOPICS.length)])}
              className="flex h-full min-h-20 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/50 p-4 font-bold transition-colors hover:border-white hover:bg-white/10"
            >
              🎲 Surprise me
            </button>
          </li>
        </ul>

        <p className="mt-6 text-sm text-white/60">Free · no sign-up · speak or type your answers</p>
      </div>
    </main>
  );
}
