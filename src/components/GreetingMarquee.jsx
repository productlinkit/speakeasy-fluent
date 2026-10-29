import { Sparkle } from "lucide-react";
import { LANGUAGES } from "../data/languages";

export default function GreetingMarquee() {
  const items = [...LANGUAGES, ...LANGUAGES];
  return (
    <div className="relative z-10 overflow-hidden border-y-4 border-navy bg-secondary py-4">
      <p className="sr-only">Practise {LANGUAGES.map((l) => l.name).join(", ")} with Renald.</p>
      <div aria-hidden="true" className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((l, i) => (
              <div key={`${copy}-${i}`} className="flex items-center gap-3 pl-6 text-white">
                <img src={l.flag} alt="" className="size-8 rounded-full object-cover ring-2 ring-white/40" />
                <span className="text-lg font-bold whitespace-nowrap">{l.greeting}</span>
                <span className="text-sm whitespace-nowrap text-white/60">{l.native}</span>
                <Sparkle className="ml-3 size-4 fill-current text-sky-tint" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
