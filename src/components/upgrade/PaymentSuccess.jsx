import { useEffect, useMemo } from "react";
import { ArrowRight, Check, MailCheck, Smartphone } from "lucide-react";
import boostLogo from "../../assets/boost-logo.svg";
import foxCelebrate from "../../assets/fox-celebrate.png";
import { FEATURES, formatIDR } from "../../data/boost";
import Confetti from "./Confetti";

const APP_URL = "https://apps.speakeasy.mobi/en/";

// Shown after the (mock) payment goes through.
export default function PaymentSuccess({ order, onViewReport }) {
  const { plan, promo, total, method, email } = order;
  const orderId = useMemo(() => `SE-${Date.now().toString(36).toUpperCase().slice(-8)}`, []);
  const renews = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + plan.months);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }, [plan.months]);

  useEffect(() => {
    window.dataLayer?.push({ event: "purchase", plan: plan.id, promo: promo?.code, value: total, currency: "IDR", transaction_id: orderId });
  }, [plan.id, promo, total, orderId]);

  return (
    <main className="relative flex-1 overflow-y-auto bg-gradient-to-b from-[#eff8fe] to-[#cfe9fc] px-4 py-8 text-navy sm:px-6 sm:py-12">
      <Confetti />
      <div className="relative mx-auto w-full max-w-md text-center">
        <div className="relative mx-auto size-36 animate-pop-in">
          <span aria-hidden="true" className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/30" />
          <div className="relative flex size-full items-center justify-center rounded-full bg-white shadow-[0_10px_30px_-8px_rgba(21,79,137,0.4)]">
            <img src={foxCelebrate} alt="" className="size-28 object-contain" />
          </div>
          <span className="absolute -right-1 bottom-1 flex size-11 animate-pop-in items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-[#eff8fe]" style={{ animationDelay: "350ms" }}>
            <Check className="size-6" strokeWidth={4} />
          </span>
        </div>

        <img src={boostLogo} alt="BOOST" className="mx-auto mt-6 h-8 animate-pop-in" style={{ animationDelay: "150ms" }} />
        <h2 className="mt-3 animate-pop-in text-3xl font-bold sm:text-4xl" style={{ animationDelay: "200ms" }}>
          Payment successful!
        </h2>
        <p className="mt-2 animate-pop-in text-secondary" style={{ animationDelay: "250ms" }}>
          You're on BOOST {plan.label}. Your full report and unlimited calls with Renald are ready.
        </p>

        <div className="mt-6 animate-pop-in rounded-3xl bg-white p-5 text-left shadow-[0_6px_0_0_rgba(21,79,137,0.15)]" style={{ animationDelay: "320ms" }}>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Plan</dt>
              <dd className="font-bold">BOOST · {plan.label}</dd>
            </div>
            {promo && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Promo</dt>
                <dd className="font-bold text-emerald-700">
                  {promo.code} · {promo.percent}% off
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Renews on</dt>
              <dd className="font-bold">{renews}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Order ID</dt>
              <dd className="font-mono font-bold">{orderId}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-3 text-lg font-bold">
              <dt>Paid</dt>
              <dd className="text-secondary">{formatIDR(total)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-4 flex animate-pop-in gap-3 rounded-2xl bg-secondary p-4 text-left text-white" style={{ animationDelay: "380ms" }}>
          <MailCheck className="mt-0.5 size-6 shrink-0 text-primary" />
          {method === "google" ? (
            <p className="text-sm">
              <strong className="block text-base">Your account is ready</strong>
              Log in to the Speakeasy app with the same Google account to use BOOST.
            </p>
          ) : (
            <p className="min-w-0 text-sm">
              <strong className="block text-base">Check your inbox</strong>
              We sent a login link to <strong className="break-words">{email}</strong>. Open it to set your password and start using
              BOOST in the app.
            </p>
          )}
        </div>

        <ul className="mt-5 space-y-2 text-left text-sm">
          {FEATURES.map((f, i) => (
            <li key={f} className="flex animate-pop-in gap-2" style={{ animationDelay: `${420 + i * 60}ms` }}>
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Check className="size-3" strokeWidth={4} />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onViewReport}
          className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-secondary text-lg font-bold text-white shadow-[0_6px_0_0_var(--color-navy)] transition-all hover:translate-y-0.5 hover:shadow-[0_4px_0_0_var(--color-navy)] active:translate-y-1.5 active:shadow-none"
        >
          See my full report <ArrowRight className="size-5" />
        </button>
        <a
          href={APP_URL}
          onClick={() => window.dataLayer?.push({ event: "app_cta_click", location: "payment_success", plan: plan.id })}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-secondary underline-offset-4 hover:underline"
        >
          <Smartphone className="size-4" /> Continue learning in the Speakeasy app
        </a>
        <p className="mt-3 text-xs text-muted">
          {method === "google" ? "Your receipt is on its way to your Google email." : "Your receipt is in the same email."} Can't find it? Check spam.
        </p>
      </div>
    </main>
  );
}
