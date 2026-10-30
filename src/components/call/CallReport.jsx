import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Clock, Lock, MessageSquareText, RotateCcw, Shuffle, Sparkles, Target, Zap } from "lucide-react";
import foxCelebrate from "../../assets/fox-celebrate.png";
import boostLogo from "../../assets/boost-logo.svg";
import { SKILLS, buildPlan, buildReport } from "../../lib/report";
import { FEATURES } from "../../data/boost";
import { useReducedMotion } from "../../hooks";
import EmailReport from "./EmailReport";

const APP_URL = "https://apps.speakeasy.mobi/en/";
const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];
// Placeholder scores rendered under the blur, so locked numbers can't be read from the page.
const LOCKED_SKILLS = { fluency: 72, vocabulary: 64, sentences: 58, confidence: 81 };

function useCountUp(target, ms = 1200) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);
  useEffect(() => {
    if (reduced) return setValue(target);
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / ms, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, reduced]);
  return value;
}

function ScoreRing({ score }) {
  const shown = useCountUp(score);
  return (
    <div className="relative size-36 shrink-0 sm:size-40">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-sky-tint)" strokeWidth="12" />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="12"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={100 - shown}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground tabular-nums">{shown}</span>
        <span className="text-xs font-bold text-muted">/ 100</span>
      </div>
    </div>
  );
}

function SkillBar({ label, value, delay }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setOn(true), 300 + delay);
    return () => clearTimeout(id);
  }, [delay]);
  return (
    <div>
      <div className="flex justify-between text-sm font-bold">
        <span>{label}</span>
        <span className="text-secondary tabular-nums">{value}</span>
      </div>
      <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-sky-tint">
        <div
          className="h-full origin-left rounded-full bg-primary transition-transform duration-700 ease-out"
          style={{ transform: `scaleX(${on ? value / 100 : 0})` }}
        />
      </div>
    </div>
  );
}

function Card({ children, className = "", delay = 0 }) {
  return (
    <section
      className={`animate-pop-in rounded-3xl bg-white p-5 text-foreground shadow-[0_6px_0_0_rgba(0,0,0,0.2)] sm:p-7 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
}

// Blurs its children behind a BOOST lock until the report is unlocked.
function Locked({ locked, title, onUnlock, children }) {
  if (!locked) return <div className="animate-[fade-in_0.5s_ease-out]">{children}</div>;
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div aria-hidden="true" inert="" className="pointer-events-none blur-[6px] select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/55 p-4 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-white shadow-[0_4px_0_0_var(--color-navy)]">
          <Lock className="size-5" />
        </span>
        <p className="mt-2.5 font-bold text-foreground">{title}</p>
        <button
          type="button"
          onClick={onUnlock}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-bold text-white shadow-[0_4px_0_0_var(--color-navy)] transition-transform hover:translate-y-0.5 active:translate-y-1 active:shadow-none"
        >
          Unlock with <img src={boostLogo} alt="BOOST" className="h-5" />
        </button>
      </div>
    </div>
  );
}

export default function CallReport({ result, lang, topic, unlocked, email, onEmailChange, onUnlock, onCallAgain, onNewTopic }) {
  const report = useMemo(() => buildReport(result.answers, lang.code), [result, lang.code]);
  const plan = useMemo(() => buildPlan(topic.id, report, lang.name), [topic.id, report, lang.name]);
  const locked = !unlocked;
  const minutes = Math.floor(result.durationMs / 60000);
  const seconds = Math.round((result.durationMs % 60000) / 1000);
  const levelIndex = CEFR.indexOf(report.level.cefr);
  const scoredAnswers = result.answers.filter((a) => a.scored);
  const skills = locked ? LOCKED_SKILLS : report.skills;

  const stats = [
    { icon: Clock, label: `${minutes}:${String(seconds).padStart(2, "0")} call` },
    { icon: MessageSquareText, label: `${report.wordsSpoken} words` },
    ...(report.wpm ? [{ icon: Zap, label: `${report.wpm} words/min` }] : []),
    { icon: Target, label: `${topic.emoji} ${topic.label}` },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 pb-28">
      <div className="text-center">
        <img src={foxCelebrate} alt="" className="mx-auto w-28 animate-float sm:w-36" />
        <p className="mt-2 animate-word text-sm font-bold text-white/70">
          Speaking report · {lang.name}
          {unlocked && " · BOOST"}
        </p>
        <h2 className="mt-1 animate-word text-3xl leading-tight font-bold sm:text-4xl" style={{ animationDelay: "80ms" }}>
          {result.name ? `${result.name}, here's` : "Here's"} where you stand
        </h2>
      </div>

      {/* Free: score + level */}
      <Card delay={150}>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <ScoreRing score={report.overall} />
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold tracking-wide text-muted uppercase">Your estimated level</p>
            <p className="mt-1 flex items-baseline justify-center gap-2 sm:justify-start">
              <span className="text-4xl font-bold text-secondary">{report.level.cefr}</span>
              <span className="text-lg font-bold">{report.level.name}</span>
            </p>
            <p className="mt-2 text-sm text-muted">{report.level.text}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-6 gap-1.5" aria-hidden="true">
          {CEFR.map((c, i) => (
            <div key={c} className="text-center">
              <div className={`h-2.5 rounded-full ${i <= levelIndex ? "bg-primary" : "bg-sky-tint"}`} />
              <span className={`mt-1 block text-[11px] font-bold ${i === levelIndex ? "text-secondary" : "text-muted/70"}`}>{c}</span>
            </div>
          ))}
        </div>
        <ul className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
          {stats.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-1.5 rounded-full bg-sky-tint px-3 py-1 text-xs font-bold text-secondary">
              <Icon className="size-3.5" />
              {label}
            </li>
          ))}
        </ul>
        {!report.spoken && (
          <p className="mt-5 rounded-2xl bg-amber-50 p-3 text-center text-sm font-medium text-amber-800">
            You typed your answers, so this is capped at B2. Call again and answer out loud for your full speaking score.
          </p>
        )}
      </Card>

      {/* Free: strengths */}
      <Card delay={220}>
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <Sparkles className="size-5 text-emerald-600" /> What you did well
        </h3>
        <ul className="mt-4 space-y-3">
          {report.strengths.map((k) => (
            <li key={k} className="flex gap-2.5">
              <Check className="mt-0.5 size-5 shrink-0 text-emerald-600" strokeWidth={3} />
              <span>
                <strong>{SKILLS[k].label}.</strong> {SKILLS[k].strong}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Locked: skill breakdown + focus areas */}
      <Card delay={290}>
        <h3 className="text-xl font-bold">Skill breakdown</h3>
        <p className="mt-1 text-sm text-muted">How you did across the four parts of speaking, and what to fix first.</p>
        <div className="mt-5">
          <Locked locked={locked} title="See your score for every skill" onUnlock={onUnlock}>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(skills).map(([k, v], i) => (
                <SkillBar key={k} label={SKILLS[k].label} value={v} delay={i * 120} />
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-purple-50 p-4">
              <p className="flex items-center gap-1.5 text-sm font-bold text-purple-700">
                <Target className="size-4" /> What to work on next
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                {(locked ? ["sentences", "fluency"] : report.focusAreas).map((k) => (
                  <li key={k}>
                    <strong>{SKILLS[k].label}.</strong> {SKILLS[k].focus}
                  </li>
                ))}
              </ul>
            </div>
          </Locked>
        </div>
      </Card>

      {/* Locked: conversation review */}
      <Card delay={360}>
        <h3 className="text-xl font-bold">Renald's notes on your answers</h3>
        <p className="mt-1 text-sm text-muted">Your full conversation, with feedback on each answer.</p>
        <div className="mt-5">
          <Locked locked={locked} title="Review every answer with Renald" onUnlock={onUnlock}>
            <ol className="space-y-4">
              {(locked ? scoredAnswers.map((a) => ({ ...a, text: "Your answer is waiting for you here." })) : scoredAnswers).map((a, i) => (
                <li key={i} className="space-y-2 text-sm">
                  <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-primary px-4 py-2.5 text-white">{a.question}</p>
                  <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-secondary px-4 py-2.5 text-white" lang={locked ? "en" : lang.code}>
                    {a.text}
                  </p>
                  <p className="ml-auto max-w-[85%] text-right text-xs text-muted">
                    {a.mode === "voice" ? "🎙 Spoken" : "⌨️ Typed"} · {Math.round(a.latencyMs / 100) / 10}s to start answering
                  </p>
                </li>
              ))}
            </ol>
          </Locked>
        </div>
      </Card>

      {/* Week 1 free, weeks 2–4 locked */}
      <Card delay={430}>
        <p className="text-sm font-bold text-primary">Personal plan</p>
        <h3 className="text-xl font-bold">
          Your 4-week plan for {topic.label.toLowerCase()} {topic.emoji}
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-primary bg-sky-tint/50 p-5">
            <p className="font-bold">{plan[0].title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {plan[0].items.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Locked locked={locked} title="Weeks 2–4 are ready for you" onUnlock={onUnlock}>
            <div className="h-full space-y-4 rounded-2xl border-2 border-dashed border-border p-5">
              {plan.slice(1).map((w) => (
                <div key={w.title}>
                  <p className="font-bold">{w.title}</p>
                  <p className="text-sm text-muted">{w.items.join(" · ")}</p>
                </div>
              ))}
            </div>
          </Locked>
        </div>
      </Card>

      {locked ? (
        <section className="animate-pop-in overflow-hidden rounded-3xl bg-secondary p-6 text-center shadow-[0_8px_0_0_var(--color-navy)] sm:p-8" style={{ animationDelay: "500ms" }}>
          <img src={boostLogo} alt="BOOST" className="mx-auto h-10" />
          <h3 className="mt-4 text-2xl font-bold sm:text-3xl">Unlock your full report</h3>
          <p className="mx-auto mt-2 max-w-md text-white/80">Upgrade to BOOST and Renald shows you everything, then keeps training you every day.</p>
          <ul className="mx-auto mt-5 max-w-sm space-y-2 text-left text-sm">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-300" strokeWidth={3} />
                {f}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onUnlock}
            className="button-3d group mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-accent text-lg font-bold text-navy sm:w-auto sm:px-10"
          >
            Unlock full report
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="mt-3 text-sm font-bold text-amber-300">🎁 Try your luck for a new-user discount first</p>
        </section>
      ) : (
        <a
          href={APP_URL}
          onClick={() => window.dataLayer?.push({ event: "app_cta_click", location: "call_report", language: lang.code })}
          className="button-3d group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-accent text-lg font-bold text-navy"
        >
          Continue learning {lang.name} in the app
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </a>
      )}

      {locked && <EmailReport email={email} onEmailChange={onEmailChange} lang={lang} delay={560} />}

      <div className="flex items-center justify-center gap-6 text-sm font-bold text-white/80">
        <button type="button" onClick={onCallAgain} className="inline-flex items-center gap-1.5 hover:text-white">
          <RotateCcw className="size-4" /> Call again
        </button>
        <button type="button" onClick={onNewTopic} className="inline-flex items-center gap-1.5 hover:text-white">
          <Shuffle className="size-4" /> Try another topic
        </button>
      </div>
      <p className="text-center text-xs text-white/60">
        This report is a quick estimate from a short call in your browser, not a formal test.
      </p>

      {locked && (
        <div className="fixed inset-x-4 bottom-4 z-10 mx-auto max-w-md sm:hidden">
          <button
            type="button"
            onClick={onUnlock}
            className="button-3d flex h-14 w-full items-center justify-center gap-2 rounded-full bg-accent text-base font-bold text-navy"
          >
            <Lock className="size-4" /> Unlock full report
          </button>
        </div>
      )}
    </div>
  );
}
