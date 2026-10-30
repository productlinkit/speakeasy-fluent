import { useState } from "react";
import { Check, Loader2, Mail } from "lucide-react";
import { isEmail } from "../../lib/email";

// Lead capture for people who don't upgrade. Mockup: nothing is actually sent.
export default function EmailReport({ email, onEmailChange, lang, delay = 0 }) {
  const [state, setState] = useState("idle"); // idle | sending | sent
  const [error, setError] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    if (!isEmail(email)) return setError("Please enter a valid email address.");
    setError(null);
    setState("sending");
    window.dataLayer?.push({ event: "report_email_submit", language: lang.code });
    setTimeout(() => setState("sent"), 900);
  };

  return (
    <section
      className="animate-pop-in rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 sm:p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      {state === "sent" ? (
        <p role="status" className="flex animate-pop-in items-center justify-center gap-2 text-center font-bold">
          <span className="flex size-7 items-center justify-center rounded-full bg-emerald-500">
            <Check className="size-4" strokeWidth={4} />
          </span>
          Sent! Check {email.trim()} for your report.
        </p>
      ) : (
        <form onSubmit={submit} noValidate>
          <p className="flex items-center gap-2 font-bold">
            <Mail className="size-5" /> Not ready to upgrade? Email me my report
          </p>
          <p className="mt-1 text-sm text-white/70">Get your score, level and week 1 plan in your inbox.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <label htmlFor="report-email" className="sr-only">
              Email address
            </label>
            <input
              id="report-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => {
                onEmailChange(e.target.value);
                setError(null);
              }}
              aria-invalid={!!error}
              aria-describedby={error ? "report-email-error" : undefined}
              className="h-12 min-w-0 flex-1 rounded-full bg-white px-5 text-foreground outline-none placeholder:text-muted/70 focus:ring-4 focus:ring-primary/50"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-bold text-white shadow-[0_4px_0_0_var(--color-navy)] transition-all hover:translate-y-0.5 hover:shadow-[0_2px_0_0_var(--color-navy)] active:translate-y-1 active:shadow-none disabled:opacity-80"
            >
              {state === "sending" ? <Loader2 className="size-4 animate-spin" /> : null}
              Send my report
            </button>
          </div>
          {error && (
            <p id="report-email-error" className="mt-2 text-sm font-bold text-amber-300">
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
