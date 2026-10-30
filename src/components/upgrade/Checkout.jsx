import { useState } from "react";
import { ArrowLeft, Check, Loader2, Lock, ShieldCheck, Tag } from "lucide-react";
import boostLogo from "../../assets/boost-logo.svg";
import { FEATURES, PLANS, discounted, formatIDR } from "../../data/boost";

// Free plan = start learning in the app without BOOST (same link as speakeasy-cro's "Start learning free").
const FREE_PLAN_URL = "https://apps.speakeasy.mobi/en/";

// Mock checkout. The payment method is picked on Stripe's hosted page, so the
// pay button will redirect there once it's wired to be.speakeasy.mobi /payment.
export default function Checkout({ promo, onBack, onPaid }) {
  const [planId, setPlanId] = useState("annual");
  const [paying, setPaying] = useState(false);
  const plan = PLANS.find((p) => p.id === planId);
  const total = discounted(plan.price, promo);

  const pay = () => {
    setPaying(true);
    window.dataLayer?.push({ event: "checkout_submit", plan: plan.id, promo: promo?.code, value: total });
    setTimeout(() => onPaid(plan), 1600);
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

          <button
            type="button"
            onClick={pay}
            disabled={paying}
            className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-secondary text-lg font-bold text-white shadow-[0_6px_0_0_var(--color-navy)] transition-all hover:translate-y-0.5 hover:shadow-[0_4px_0_0_var(--color-navy)] active:translate-y-1.5 active:shadow-none disabled:opacity-80"
          >
            {paying ? (
              <>
                <Loader2 className="size-5 animate-spin" /> Redirecting to Stripe…
              </>
            ) : (
              <>
                <Lock className="size-4" /> Pay {formatIDR(total)}
              </>
            )}
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
          <p className="mt-3 rounded-xl bg-amber-50 p-2.5 text-center text-xs font-medium text-amber-800">
            Demo checkout: no Stripe redirect or real payment yet.
          </p>
        </aside>
      </div>
    </main>
  );
}
