import { Fragment } from "react";

const STEP = 70; // ms between words

// The plain space between word boxes is what lets the headline wrap.
function Words({ text, start }) {
  return text.split(" ").map((word, i) => (
    <Fragment key={i}>
      <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
        <span className="inline-block animate-word" style={{ animationDelay: `${(start + i) * STEP}ms` }}>
          {word}
        </span>
      </span>{" "}
    </Fragment>
  ));
}

export default function Headline() {
  return (
    <h1 className="text-[2.4rem] leading-[1.06] font-bold tracking-tight text-white sm:text-5xl xl:text-[3.75rem] 2xl:text-[4.25rem]">
      <Words text="Pick a language." start={0} />
      <br className="hidden sm:block" />
      <Words text="In" start={3} />
      <span className="mx-0.5 inline-block sm:-rotate-2">
        <span
          className="inline-block animate-pop-in rounded-2xl bg-white px-3 py-0.5 text-secondary shadow-[0_5px_0_0_var(--color-navy)]"
          style={{ animationDelay: `${4 * STEP + 150}ms` }}
        >
          2 minutes,
        </span>
      </span>{" "}
      <Words text="Renald tells you" start={6} />
      <span className="relative inline-block text-secondary">
        <Words text="exactly where you stand." start={9} />
        <svg
          aria-hidden="true"
          viewBox="0 0 300 20"
          preserveAspectRatio="none"
          className="absolute -bottom-1 left-0 h-3 w-[calc(100%-0.4em)] md:h-4"
        >
          <path
            d="M4 14 C 60 4, 120 4, 170 10 S 260 16, 296 6"
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="1"
            className="draw-path animate-draw"
            style={{ animationDelay: "1.3s" }}
          />
        </svg>
      </span>
    </h1>
  );
}
