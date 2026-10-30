import { useEffect, useRef, useState } from "react";
import { Keyboard, Mic, PhoneOff, Send, Volume2, VolumeX, X } from "lucide-react";
import { LANGUAGES } from "../../data/languages";
import { TOPICS, buildSteps, closingFor, extractName, lineFor, reactionFor } from "../../data/callScript";
import { MIC_ERRORS, canSpeak, getRecognition, playRingtone, speak, stopSpeaking, unlockSpeech } from "../../lib/speech";
import { hasEnoughAnswers } from "../../lib/report";
import RenaldAvatar from "./RenaldAvatar";
import TopicPicker from "./TopicPicker";
import CallReport from "./CallReport";
import CallEndedEarly from "./CallEndedEarly";
import LuckScreen from "../upgrade/LuckScreen";
import Checkout from "../upgrade/Checkout";

const CONNECT_MS = 2600;
const THINK_MS = 800;
const SILENCE_AFTER_SPEECH_MS = 2200;
const NO_SPEECH_MS = 8000;
const MAX_LISTEN_MS = 30000;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function CallModal({ open, langCode, onLangChange, onClose }) {
  const lang = LANGUAGES.find((l) => l.code === langCode);
  const [hasMic] = useState(() => getRecognition() !== null);

  const [stage, setStage] = useState("topic"); // topic | connecting | live | ended
  const [topic, setTopic] = useState(null);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhaseState] = useState("speaking"); // speaking | waiting | listening | thinking
  const [line, setLine] = useState({ text: "", en: "" });
  const [heard, setHeard] = useState("");
  const [draft, setDraft] = useState("");
  const [inputMode, setInputMode] = useState(hasMic ? "voice" : "text");
  const [notice, setNotice] = useState(null);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [name, setName] = useState("");
  const [result, setResult] = useState(null); // { answers, durationMs, enough }
  const [upgrade, setUpgrade] = useState(null); // null | "luck" | "checkout"
  const [promo, setPromo] = useState(null);
  const [boosted, setBoosted] = useState(false);
  const [toast, setToast] = useState(null);

  const callId = useRef(0);
  const phaseRef = useRef("speaking");
  const mutedRef = useRef(false);
  const stepRef = useRef(0);
  const stepsRef = useRef([]);
  const recRef = useRef(null);
  const listenTimer = useRef();
  const session = useRef({ answers: [], name: "", startedAt: 0, promptEndedAt: 0, firstInputAt: 0 });

  const setPhase = (p) => {
    phaseRef.current = p;
    setPhaseState(p);
  };

  const stopListening = () => {
    clearTimeout(listenTimer.current);
    const rec = recRef.current;
    recRef.current = null;
    rec?.finish();
  };

  const resetAll = () => {
    callId.current++;
    stopListening();
    stopSpeaking();
  };

  // Reset to the topic step whenever the modal opens.
  useEffect(() => {
    if (!open) return;
    setStage("topic");
    setTopic(null);
    setResult(null);
    return resetAll;
  }, [open]);

  // Lock page scroll + Escape to close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  });

  useEffect(() => {
    if (stage !== "live") return;
    const id = setInterval(() => setElapsed(Math.floor((performance.now() - session.current.startedAt) / 1000)), 1000);
    return () => clearInterval(id);
  }, [stage]);

  function say(text) {
    return new Promise((resolve) => {
      const silent = mutedRef.current || !canSpeak();
      const estimate = Math.max(1800, text.length * (lang.code === "ja" ? 140 : 55));
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(fallback);
        resolve();
      };
      const fallback = setTimeout(finish, silent ? estimate : estimate * 2 + 3000);
      if (!silent) speak(text, lang.speechLang, { onEnd: finish });
    });
  }

  function markFirstInput() {
    const s = session.current;
    if (s.firstInputAt) return;
    const now = performance.now();
    if (phaseRef.current === "speaking") s.promptEndedAt = now;
    s.firstInputAt = now;
  }

  async function askStep(index, prefix = { text: "", en: "" }) {
    const id = callId.current;
    const step = stepsRef.current[index];
    const ctx = { name: session.current.name, index };
    stepRef.current = index;
    setStepIndex(index);
    setHeard("");
    setDraft("");
    setNotice(null);
    const next = {
      text: [prefix.text, lineFor(step, lang.code, ctx)].filter(Boolean).join(" "),
      en: lang.code === "en" ? "" : [prefix.en, lineFor(step, "en", ctx)].filter(Boolean).join(" "),
    };
    setLine(next);
    setPhase("speaking");
    await say(next.text);
    if (id === callId.current && stepRef.current === index && phaseRef.current === "speaking") {
      session.current.promptEndedAt = performance.now();
      session.current.firstInputAt = 0;
      setPhase("waiting");
    }
  }

  function endCall(reason) {
    resetAll();
    const s = session.current;
    const enough = hasEnoughAnswers(s.answers);
    setResult({ answers: s.answers, durationMs: performance.now() - s.startedAt, enough, name: s.name, reason });
    setStage("ended");
    window.dataLayer?.push({ event: "call_end", reason, answers: s.answers.length, language: lang.code, topic: topic?.id });
  }

  async function finishCall(prefix) {
    const id = callId.current;
    const closing = {
      text: [prefix.text, closingFor(lang.code, session.current.name)].filter(Boolean).join(" "),
      en: lang.code === "en" ? "" : [prefix.en, closingFor("en", session.current.name)].filter(Boolean).join(" "),
    };
    setHeard("");
    setLine(closing);
    setPhase("speaking");
    await say(closing.text);
    if (id === callId.current) endCall("completed");
  }

  async function submit(raw, mode, speakingMs = null) {
    const text = raw.trim();
    if (!text || phaseRef.current === "thinking") return;
    const id = callId.current;
    markFirstInput();
    if (phaseRef.current === "speaking") stopSpeaking();

    const s = session.current;
    const index = stepRef.current;
    const step = stepsRef.current[index];
    s.answers.push({
      question: step.en,
      text,
      mode,
      latencyMs: Math.max(0, s.firstInputAt - s.promptEndedAt),
      speakingMs,
      scored: step.kind === "open",
    });
    if (step.kind === "name") {
      s.name = extractName(text);
      setName(s.name);
    }
    window.dataLayer?.push({ event: "call_answer", step: index, mode });

    setHeard(text);
    setDraft("");
    setNotice(null);
    setPhase("thinking");
    await wait(THINK_MS);
    if (id !== callId.current) return;

    const prefix =
      step.kind === "open" ? { text: reactionFor(lang.code, index), en: reactionFor("en", index) } : { text: "", en: "" };
    if (index + 1 < stepsRef.current.length) askStep(index + 1, prefix);
    else finishCall(prefix);
  }

  function startListening() {
    const Recognition = getRecognition();
    if (!Recognition) {
      setInputMode("text");
      return;
    }
    const id = callId.current;
    if (phaseRef.current === "speaking") {
      stopSpeaking();
      session.current.promptEndedAt = performance.now();
    }

    let said = "";
    let firstResultAt = 0;
    let lastResultAt = 0;
    let error;
    let stopped = false;
    let rec = null;
    const stop = () => {
      stopped = true;
      clearTimeout(listenTimer.current);
      rec?.stop();
    };
    const stopIn = (ms) => {
      clearTimeout(listenTimer.current);
      listenTimer.current = setTimeout(stop, ms);
    };

    rec = new Recognition();
    rec.lang = lang.speechLang;
    rec.interimResults = true;
    rec.continuous = true;
    rec.onaudiostart = () => {
      if (!firstResultAt) stopIn(NO_SPEECH_MS);
    };
    rec.onresult = (e) => {
      const now = performance.now();
      if (!firstResultAt) {
        firstResultAt = now;
        markFirstInput();
      }
      lastResultAt = now;
      said = Array.from(e.results, (r) => r[0]?.transcript ?? "").join(" ").replace(/\s+/g, " ").trim();
      setHeard(said);
      stopIn(SILENCE_AFTER_SPEECH_MS);
    };
    rec.onerror = (e) => {
      error = e.error;
    };
    rec.onend = () => {
      clearTimeout(listenTimer.current);
      recRef.current = null;
      if (id !== callId.current || phaseRef.current !== "listening") return;
      if (said) {
        submit(said, "voice", Math.max(800, lastResultAt - firstResultAt + 600));
        return;
      }
      setPhase("waiting");
      setHeard("");
      const known = error ? MIC_ERRORS[error] : undefined;
      if (known) setInputMode("text");
      setNotice(known ?? (stopped ? "I didn't hear anything. Tap the mic and try again." : "I didn't catch that. Tap the mic and try again."));
    };

    try {
      rec.start();
    } catch {
      setInputMode("text");
      setNotice("Voice answers aren't available in this browser right now. Please type your answer.");
      return;
    }
    recRef.current = { finish: stop };
    setHeard("");
    setNotice(null);
    setPhase("listening");
    stopIn(MAX_LISTEN_MS);
  }

  function switchToText() {
    if (phaseRef.current === "listening") setPhase("waiting");
    stopListening();
    setInputMode("text");
  }

  function toggleMute() {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    if (next) stopSpeaking();
  }

  function startCall(t) {
    unlockSpeech();
    const id = ++callId.current;
    const s = buildSteps(t.id);
    stepsRef.current = s;
    session.current = { answers: [], name: "", startedAt: 0, promptEndedAt: 0, firstInputAt: 0 };
    setTopic(t);
    setSteps(s);
    setStepIndex(0);
    setName("");
    setElapsed(0);
    setLine({ text: "", en: "" });
    setHeard("");
    setNotice(null);
    setResult(null);
    setStage("connecting");
    window.dataLayer?.push({ event: "call_open", language: lang.code, topic: t.id });

    const stopRing = mutedRef.current ? () => {} : playRingtone();
    setTimeout(() => {
      stopRing();
      if (id !== callId.current) return;
      session.current.startedAt = performance.now();
      setStage("live");
      askStep(0);
    }, CONNECT_MS);
  }

  function startUpgrade() {
    window.dataLayer?.push({ event: "unlock_report_click", language: lang.code, topic: topic?.id });
    setUpgrade(promo ? "checkout" : "luck");
  }

  function handlePaid(plan) {
    setBoosted(true);
    setUpgrade(null);
    setToast(`Welcome to BOOST ${plan.label}! Your full report is unlocked.`);
    setTimeout(() => setToast(null), 4000);
  }

  function handleClose() {
    if (upgrade) return setUpgrade(null);
    if (stage === "live" || stage === "connecting") {
      if (stage === "live") return endCall("hung-up");
      resetAll();
      setStage("topic");
      return;
    }
    resetAll();
    onClose();
  }

  if (!open) return null;

  const live = stage === "live";
  const listening = phase === "listening";
  const renaldTalking = stage === "connecting" || (live && phase === "speaking");
  const step = steps[stepIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Call with Renald"
      className="fixed inset-0 z-[70] flex h-dvh animate-[fade-in_0.25s_ease-out] flex-col overflow-hidden bg-gradient-to-b from-navy via-secondary to-[#6d5fd6] text-white"
    >
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -right-32 bottom-0 size-[28rem] rounded-full bg-accent/25 blur-3xl" />
      </div>

      <header className="relative flex items-center gap-3 px-4 pt-4 sm:px-6 sm:pt-6">
        <RenaldAvatar className="size-10 ring-2 ring-white/40" />
        <div className="min-w-0 flex-1">
          <p className="leading-tight font-bold">Renald</p>
          <p className="truncate text-xs text-white/70">
            Speakeasy AI tutor · {lang.name}
            {topic && stage !== "topic" ? ` · ${topic.label}` : ""}
          </p>
        </div>
        {(live || stage === "ended") && (
          <span className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-bold tabular-nums">
            <span className={`size-2 rounded-full ${live ? "animate-pulse bg-emerald-400" : "bg-white/50"}`} />
            {formatTime(stage === "ended" ? Math.round((result?.durationMs ?? 0) / 1000) : elapsed)}
          </span>
        )}
        {!live && (
          <button
            type="button"
            onClick={handleClose}
            aria-label={stage === "connecting" ? "Cancel call" : "Close"}
            className="flex size-10 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
          >
            <X className="size-5" />
          </button>
        )}
      </header>

      {toast && (
        <p role="status" className="absolute top-20 left-1/2 z-30 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-pop-in rounded-2xl bg-emerald-500 px-4 py-3 text-center font-bold shadow-lg">
          🎉 {toast}
        </p>
      )}

      {upgrade && (
        <div className="absolute inset-0 z-20 flex animate-[fade-in_0.3s_ease-out] flex-col bg-[#eff8fe]">
          {upgrade === "luck" && (
            <button
              type="button"
              onClick={() => setUpgrade(null)}
              aria-label="Back to report"
              className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/70 text-secondary shadow transition-colors hover:bg-white sm:top-6 sm:right-6"
            >
              <X className="size-5" />
            </button>
          )}
          {upgrade === "luck" ? (
            <LuckScreen
              onDone={(won) => {
                setPromo(won);
                setUpgrade("checkout");
              }}
            />
          ) : (
            <Checkout promo={promo} onBack={() => setUpgrade(null)} onPaid={handlePaid} />
          )}
        </div>
      )}

      {stage === "topic" && <TopicPicker lang={lang} onLangChange={onLangChange} onPick={startCall} />}

      {stage === "ended" && result && (
        <main className="relative flex-1 overflow-y-auto px-4 py-8 sm:px-6">
          {result.enough ? (
            <CallReport
              result={result}
              lang={lang}
              topic={topic}
              unlocked={boosted}
              onUnlock={startUpgrade}
              onCallAgain={() => startCall(topic)}
              onNewTopic={() => setStage("topic")}
            />
          ) : (
            <CallEndedEarly onCallAgain={() => startCall(topic)} onClose={() => { resetAll(); onClose(); }} />
          )}
        </main>
      )}

      {(stage === "connecting" || live) && (
        <>
          <main className="relative flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto px-5 py-6 text-center">
            {live && (
              <div
                aria-hidden="true"
                className="absolute top-3 right-4 flex h-24 w-18 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-white/25 bg-white/10 backdrop-blur-sm sm:right-6 sm:h-32 sm:w-24"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                  {name ? name.charAt(0) : "?"}
                </span>
                {listening ? (
                  <span className="flex h-4 items-end gap-0.5">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className="h-full w-1 origin-bottom animate-equalizer rounded-full bg-emerald-300" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </span>
                ) : (
                  <span className="text-[11px] text-white/70">You</span>
                )}
              </div>
            )}

            <div className="relative">
              {renaldTalking && (
                <>
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/30" />
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/20" style={{ animationDelay: "0.8s" }} />
                </>
              )}
              <RenaldAvatar
                className={`relative size-32 border-4 border-white/80 shadow-2xl transition-transform duration-300 sm:size-44 ${renaldTalking ? "scale-105" : ""}`}
              />
            </div>

            {stage === "connecting" ? (
              <div>
                <p className="text-2xl font-bold">Calling Renald…</p>
                <p className="mt-1 text-white/70">
                  {topic.emoji} {topic.label} in {lang.name} · speak or type your answers
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5" aria-label={`Question ${stepIndex + 1} of ${steps.length}`}>
                  {steps.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i < stepIndex ? "w-4 bg-white" : i === stepIndex ? "w-8 bg-white" : "w-4 bg-white/30"
                      }`}
                    />
                  ))}
                </div>
                <div key={line.text} className="max-w-xl animate-pop-in">
                  <p aria-live="polite" lang={lang.code} className="text-xl leading-snug font-bold text-balance sm:text-2xl">
                    {line.text}
                  </p>
                  {line.en && <p className="mt-2 text-sm text-balance text-white/65">{line.en}</p>}
                </div>
                {(heard || listening) && (
                  <div className="max-w-md animate-pop-in rounded-2xl rounded-br-md bg-white px-4 py-3 text-left text-secondary shadow-lg">
                    <p className="text-[11px] font-bold text-primary uppercase">You</p>
                    <p lang={lang.code}>{heard || "Listening…"}</p>
                  </div>
                )}
                {phase === "thinking" && (
                  <span role="status" aria-label="Renald is thinking" className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="size-2 animate-typing-dot rounded-full bg-white" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </span>
                )}
                {notice && <p className="max-w-md rounded-2xl bg-white/15 px-4 py-2 text-sm">{notice}</p>}
              </>
            )}
          </main>

          <footer className="relative px-4 pb-6 sm:pb-8">
            {live && phase !== "thinking" && step && (
              <div className="mb-3 text-center text-sm text-white/75">
                {listening ? (
                  "Listening… tap the mic when you're done."
                ) : step.kind === "name" ? (
                  <>
                    Try:{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setInputMode("text");
                        setDraft(step.starter[lang.code].replace(" …", " ").replace("…", ""));
                      }}
                      className="rounded-full border-2 border-white/40 bg-white/10 px-3 py-1 font-bold text-white transition-colors hover:border-white hover:bg-white/20"
                      lang={lang.code}
                    >
                      “{step.starter[lang.code]}”
                    </button>
                  </>
                ) : (
                  step.hint
                )}
              </div>
            )}

            {live && inputMode === "text" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(draft, "text");
                }}
                className="mx-auto mb-4 flex max-w-md gap-2"
              >
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    markFirstInput();
                  }}
                  disabled={phase === "thinking"}
                  placeholder={`Type your answer in ${lang.name}…`}
                  aria-label="Your answer"
                  lang={lang.code}
                  className="h-12 min-w-0 flex-1 rounded-full bg-white px-5 text-secondary outline-none placeholder:text-muted focus:ring-4 focus:ring-white/40"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || phase === "thinking"}
                  aria-label="Send answer"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-500 shadow-[0_4px_0_0_#047857] transition-all active:translate-y-1 active:shadow-none disabled:opacity-40"
                >
                  <Send className="size-5" />
                </button>
              </form>
            )}

            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <RoundButton label={muted ? "Unmute Renald" : "Mute Renald"} onClick={toggleMute} pressed={muted}>
                {muted ? <VolumeX /> : <Volume2 />}
              </RoundButton>

              {live && hasMic && inputMode === "voice" && (
                <button
                  type="button"
                  onClick={listening ? () => recRef.current?.finish() : startListening}
                  disabled={phase === "thinking"}
                  aria-label={listening ? "Done answering" : "Answer by voice"}
                  aria-pressed={listening}
                  className={`relative flex size-20 items-center justify-center rounded-full shadow-[0_6px_0_0_rgba(0,0,0,0.25)] transition-all active:translate-y-1 disabled:opacity-50 ${
                    listening ? "bg-red-500" : "bg-emerald-500 hover:scale-105"
                  }`}
                >
                  {(listening || phase === "waiting") && (
                    <span className={`absolute inset-0 animate-pulse-ring rounded-full ${listening ? "bg-red-500" : "bg-emerald-400"}`} />
                  )}
                  <Mic className="relative size-8" />
                </button>
              )}

              {live && hasMic && (
                inputMode === "voice" ? (
                  <RoundButton label="Type instead" onClick={switchToText}>
                    <Keyboard />
                  </RoundButton>
                ) : (
                  <RoundButton label="Answer by voice" onClick={() => setInputMode("voice")}>
                    <Mic />
                  </RoundButton>
                )
              )}

              <button
                type="button"
                onClick={handleClose}
                aria-label="End call"
                title="End call"
                className="flex size-14 items-center justify-center rounded-full bg-red-500 shadow-[0_4px_0_0_#9f1d1d] transition-all hover:brightness-110 active:translate-y-1 active:shadow-none"
              >
                <PhoneOff className="size-6" />
              </button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

function RoundButton({ label, onClick, pressed, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={`flex size-14 items-center justify-center rounded-full transition-colors [&_svg]:size-6 ${
        pressed ? "bg-white text-secondary" : "bg-white/15 hover:bg-white/25"
      }`}
    >
      {children}
    </button>
  );
}
