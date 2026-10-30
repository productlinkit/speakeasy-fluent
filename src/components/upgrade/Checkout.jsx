import { useState } from "react";
import { ArrowLeft, Check, Loader2, Lock, ShieldCheck, Tag } from "lucide-react";
import boostLogo from "../../assets/boost-logo.svg";
import { FEATURES, PLANS, discounted, formatIDR } from "../../data/boost";
import { isEmail } from "../../lib/email";

// Free plan = start learning in the app without BOOST (same link as speakeasy-cro's "Start learning free").
const FREE_PLAN_URL = "https://apps.speakeasy.mobi/en/";

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8Z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9Z" />
    </svg>
  );
}

// Mockup checkout: no login needed, the email (or Google) stands in for the
// account. Paying just waits a moment and moves on to the success page.
export default function Checkout({ promo, email, onEmailChange, onBack, onPaid }) {
  const [planId, setPlanId] = useState("annual");
  const [paying, setPaying] = useState(null); // null | "email" | "google"
  const [error, setError] = useState(null);
  const plan = PLANS.find((p) => p.id === planId);
  const total = discounted(plan.price, promo);

  const pay = (method) => {
    if (method === "email" && !isEmail(email)) {
      setError("Enter your email so we can set up your BOOST account.");
      document.getElementById("checkout-email")?.focus();
      return;
    }
    setError(null);
    setPaying(method);
    window.dataLayer?.push({ event: "checkout_submit", plan: plan.id, promo: promo?.code, value: total, auth: method });
    setTimeout(() => onPaid({ plan, promo, total, method, email: method === "email" ? email.trim() : null }), 1600);
  };

  return (
    <main className="relative flex-1 overflow-y-auto bg-[#eff8fe] px-4 py-6 text-foreground sm:px-6 sm:py-10">
      <div className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="animate-pop-in">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to report
          </button>
          <div className="mt-4 flex items-center gap-3">
            <img src={boostLogo} alt="BOOST" className="h-9" />
            <h2 className="text-2xl font-bold sm:text-3xl">Choose your plan</h2>
          </div>

          {promo && (
            <p className="mt-4 inline-flex animate-pop-in items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-800">
              <Tag className="size-4" /> {promo.code} applied · {promo.percent}% off
            </p>
          )}

          <div role="radiogroup" aria-label="BOOST plan" className="mt-5 space-y-3">
            {PLANS.map((p, i) => {
              const active = p.id === planId;
              const price = discounted(p.price, promo);
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setPlanId(p.id)}
                  className={`flex w-full animate-pop-in items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition-all ${
                    active
                      ? "border-primary shadow-[0_4px_0_0_var(--color-primary)]"
                      : "border-border shadow-[0_4px_0_0_var(--color-border)] hover:border-[#bfe2fa]"
                  }`}
                  style={{ animationDelay: `${120 + i * 70}ms` }}
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      active ? "border-primary bg-primary text-white" : "border-border"
                    }`}
                  >
                    {active && <Check className="size-3.5" strokeWidth={4} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 font-bold">
                      {p.label}
                      {p.badge && <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[11px] text-navy">{p.badge}</span>}
                    </span>
                    <span className="block text-sm text-muted">{formatIDR(price / p.months)}/month</span>
                  </span>
                  <span className="text-right">
                    {promo && <span className="block text-xs text-muted line-through">{formatIDR(p.price)}</span>}
                    <span className="block font-bold text-secondary">{formatIDR(price)}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" strokeWidth={3} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <aside className="animate-pop-in self-start rounded-3xl bg-white p-5 shadow-[0_6px_0_0_rgba(21,79,137,0.15)] sm:p-6 lg:sticky lg:top-6" style={{ animationDelay: "200ms" }}>
          <h3 className="font-bold">Order summary</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>BOOST · {plan.label}</dt>
              <dd>{formatIDR(plan.price)}</dd>
            </div>
            {promo && (
              <div className="flex justify-between font-bold text-emerald-700">
                <dt>Promo {promo.code}</dt>
                <dd>− {formatIDR(plan.price - total)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
              <dt>Total today</dt>
              <dd className="text-secondary">{formatIDR(total)}</dd>
            </div>
          </dl>

          <form
            className="mt-5"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              pay("email");
            }}
          >
            <label htmlFor="checkout-email" className="text-sm font-bold">
              Email for your BOOST account
            </label>
            <input
              id="checkout-email"
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
              aria-describedby="checkout-email-hint"
              className={`mt-1.5 h-12 w-full rounded-xl border-2 bg-white px-4 outline-none placeholder:text-muted/70 focus:border-primary ${
                error ? "border-red-400" : "border-border"
              }`}
            />
            <p id="checkout-email-hint" className={`mt-1.5 text-xs ${error ? "font-bold text-red-600" : "text-muted"}`}>
              {error ?? "No password needed now. We'll email you a link to log in. Already have an account? Use the same email."}
            </p>
            <button
              type="submit"
              disabled={!!paying}
              className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-secondary text-lg font-bold text-white shadow-[0_6px_0_0_var(--color-navy)] transition-all hover:translate-y-0.5 hover:shadow-[0_4px_0_0_var(--color-navy)] active:translate-y-1.5 active:shadow-none disabled:opacity-80"
            >
              {paying === "email" ? (
                <>
                  <Loader2 className="size-5 animate-spin" /> Redirecting to Stripe…
                </>
              ) : (
                <>
                  <Lock className="size-4" /> Pay {formatIDR(total)}
                </>
              )}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs font-bold text-muted" aria-hidden="true">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <button
            type="button"
            onClick={() => pay("google")}
            disabled={!!paying}
            className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full border-2 border-border bg-white font-bold shadow-[0_4px_0_0_var(--color-border)] transition-all hover:translate-y-0.5 hover:shadow-[0_2px_0_0_var(--color-border)] active:translate-y-1 active:shadow-none disabled:opacity-80"
          >
            {paying === "google" ? <Loader2 className="size-5 animate-spin" /> : <GoogleIcon className="size-5" />}
            Continue with Google
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
            <ShieldCheck className="size-3.5" /> Secure checkout with Stripe · cancel anytime
          </p>
          <p className="mt-4 text-center">
            <a
              href={FREE_PLAN_URL}
              onClick={() => window.dataLayer?.push({ event: "free_plan_click", location: "checkout", promo: promo?.code })}
              className="text-sm font-bold text-secondary underline-offset-4 hover:underline"
            >
              Continue with free plan
            </a>
          </p>
        </aside>
      </div>
    </main>
  );
}
