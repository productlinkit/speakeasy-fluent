import { useRef } from "react";
import { LANGUAGES } from "../data/languages";

export default function LanguagePicker({ value, onChange }) {
  const refs = useRef([]);

  const onKeyDown = (e, i) => {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + LANGUAGES.length) % LANGUAGES.length;
    onChange(LANGUAGES[next].code, true);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Pick a language"
      className="flex flex-wrap justify-center gap-2.5 lg:justify-start"
    >
      {LANGUAGES.map((lang, i) => {
        const active = lang.code === value;
        return (
          <span key={lang.code} className="animate-pop-in" style={{ animationDelay: `${900 + i * 70}ms` }}>
          <button
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(lang.code, true)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`group relative inline-flex h-12 items-center gap-2 rounded-full border-2 pr-4 pl-1.5 text-sm font-bold outline-none transition-all duration-150 focus-visible:ring-4 focus-visible:ring-white/60 ${
              active
                ? "-translate-y-0.5 border-navy bg-secondary text-white shadow-[0_5px_0_0_var(--color-navy)]"
                : "border-border bg-white text-secondary shadow-[0_4px_0_0_var(--color-border)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--color-border)] active:translate-y-1 active:shadow-none"
            }`}
          >
            <img
              src={lang.flag}
              alt=""
              key={active ? "on" : "off"}
              className={`size-8 rounded-full object-cover ring-2 ${
                active ? "animate-wiggle ring-white/60" : "ring-border group-hover:animate-wiggle"
              }`}
            />
            {lang.name}
          </button>
          </span>
        );
      })}
    </div>
  );
}
