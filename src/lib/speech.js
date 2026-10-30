// Browser speech helpers, modelled on the call on speakeasy-cro.

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function getRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

const NOVELTY_VOICES =
  /\b(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|grandma|grandpa|rocko|fred|junior|ralph|kathy)\b/i;

let voices = [];
let listening = false;

function loadVoices() {
  if (!listening) {
    listening = true;
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      voices = window.speechSynthesis.getVoices();
    });
  }
  if (voices.length === 0) voices = window.speechSynthesis.getVoices();
  return voices;
}

function score(voice, lang) {
  let s = 0;
  if (voice.lang.replace("_", "-").toLowerCase() === lang.toLowerCase()) s += 3;
  if (/natural|neural/i.test(voice.name)) s += 6;
  if (/premium|enhanced/i.test(voice.name)) s += 5;
  if (/google/i.test(voice.name)) s += 4;
  if (!voice.localService) s += 1;
  return s;
}

function pickVoice(lang) {
  const base = lang.split("-")[0].toLowerCase();
  return loadVoices()
    .filter((v) => v.lang.replace("_", "-").toLowerCase().startsWith(base) && !NOVELTY_VOICES.test(v.name))
    .sort((a, b) => score(b, lang) - score(a, lang))[0];
}

export function speak(text, lang, { onEnd } = {}) {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, ""));
  u.lang = lang;
  const voice = pickVoice(lang);
  if (voice) u.voice = voice;
  u.pitch = 1.15;
  u.rate = 1.0;
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}

// iOS/Safari only allow speech after a user gesture; call this inside the click.
export function unlockSpeech() {
  if (!canSpeak()) return;
  const u = new SpeechSynthesisUtterance("");
  u.volume = 0;
  window.speechSynthesis.speak(u);
}

// Classic two-tone phone ring. Returns a stop function.
export function playRingtone(rings = 2) {
  const Ctx = window.AudioContext ?? window.webkitAudioContext;
  if (!Ctx) return () => {};
  const ctx = new Ctx();
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(ctx.destination);
  const oscs = [440, 480].map((f) => {
    const o = ctx.createOscillator();
    o.frequency.value = f;
    o.connect(gain);
    o.start();
    return o;
  });
  const t0 = ctx.currentTime;
  for (let i = 0; i < rings; i++) {
    const t = t0 + i * 1.3;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.045, t + 0.05);
    gain.gain.setValueAtTime(0.045, t + 0.7);
    gain.gain.linearRampToValueAtTime(0, t + 0.75);
  }
  let stopped = false;
  return () => {
    if (stopped) return;
    stopped = true;
    oscs.forEach((o) => o.stop());
    ctx.close();
  };
}

export const MIC_ERRORS = {
  "not-allowed": "Your microphone is blocked. Allow it in the address bar, or just type your answer.",
  "service-not-allowed": "Your microphone is blocked. Allow it in the address bar, or just type your answer.",
  "audio-capture": "I can't find a microphone. You can type your answer instead.",
  network: "Voice answers aren't available in this browser right now. Please type your answer.",
  "language-not-supported": "Voice answers in this language aren't available in this browser. Please type your answer.",
};
