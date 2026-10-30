// Speaking report heuristics, adapted from the speakeasy-cro call. Grammar
// checking there is English-only, so here "Sentences" scores answer length and
// linking words, which works for every language we offer.

export const SKILLS = {
  fluency: {
    label: "Fluency",
    strong: "You keep going without long pauses, which makes you easy to follow.",
    focus: "Give longer answers. Keep talking even when you're searching for a word.",
  },
  vocabulary: {
    label: "Vocabulary",
    strong: "You use a nice range of words instead of repeating the same ones.",
    focus: "Learn a few new words for your topic each day and use them out loud.",
  },
  sentences: {
    label: "Sentences",
    strong: "You build full sentences and link your ideas together.",
    focus: "Link ideas with words like “and”, “because” and “so” to build longer sentences.",
  },
  confidence: {
    label: "Confidence",
    strong: "You answer quickly and don't hold back. That's half the battle!",
    focus: "Answer straight away, even if it isn't perfect. Speed builds confidence.",
  },
};

const LEVELS = [
  { cefr: "C2", name: "Mastery", min: 88, text: "Outstanding! You speak with real ease. Keep it sharp with fast, native-speed conversations." },
  { cefr: "C1", name: "Advanced", min: 76, text: "Impressive! You can hold a real conversation. Now it's about sounding natural: slang, idioms and fast-paced talk." },
  { cefr: "B2", name: "Upper intermediate", min: 62, text: "You express yourself well on most topics. More real conversations will make you sound effortless." },
  { cefr: "B1", name: "Intermediate", min: 48, text: "You've got the basics down and you can get your point across. Real conversations will take you to the next level." },
  { cefr: "A2", name: "Elementary", min: 32, text: "You can handle simple chats. Short daily practice will grow your vocabulary and confidence fast." },
  { cefr: "A1", name: "Beginner", min: 0, text: "You're just getting started, and that's perfect! Everyday phrases and short daily chats will build your confidence fast." },
];

const LINKERS = {
  en: /\b(and|because|but|so|then|when|which|although|if)\b/gi,
  es: /\b(y|porque|pero|entonces|cuando|que|aunque|si|luego)\b/gi,
  fr: /\b(et|parce que|mais|donc|alors|quand|qui|que|si|puis)\b/gi,
  de: /\b(und|weil|aber|also|dann|wenn|dass|obwohl|denn)\b/gi,
  ja: /(から|ので|けど|でも|そして|それから|たら|て、|し、)/g,
};

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const scale = (v, a, b, lo, hi) => lo + (hi - lo) * clamp((v - a) / (b - a), 0, 1);

// Japanese has no spaces, so roughly two characters stand in for a word.
export function words(text, lang) {
  if (lang === "ja") {
    const chars = (text.match(/[\p{L}\p{N}]/gu) ?? []).length;
    return Array.from({ length: Math.round(chars / 2) }, (_, i) => text.slice(i * 2, i * 2 + 2));
  }
  return text.match(/[\p{L}']+/gu) ?? [];
}

export function hasEnoughAnswers(answers) {
  return answers.filter((a) => a.scored).length >= 2;
}

export function buildReport(answers, lang) {
  const scored = answers.filter((a) => a.scored);
  const n = Math.max(scored.length, 1);
  const allWords = scored.flatMap((a) => words(a.text, lang));
  const unique = new Set(allWords.map((w) => w.toLowerCase()));
  const longWords = [...unique].filter((w) => w.length >= (lang === "ja" ? 2 : 7)).length;
  const perAnswer = allWords.length / n;

  const voiced = scored.filter((a) => a.mode === "voice" && a.speakingMs);
  const voicedWords = voiced.reduce((s, a) => s + words(a.text, lang).length, 0);
  const voicedMs = voiced.reduce((s, a) => s + a.speakingMs, 0);
  const wpm = voicedMs > 0 ? Math.round(voicedWords / (voicedMs / 60000)) : null;

  const linkers = scored.reduce((s, a) => s + (a.text.match(LINKERS[lang]) ?? []).length, 0);
  const latency = scored.reduce((s, a) => s + a.latencyMs, 0) / n;

  const skills = {
    fluency: wpm === null ? scale(perAnswer, 3, 18, 30, 90) : scale(wpm, 50, 140, 35, 96),
    vocabulary: clamp(scale(unique.size, 8, 45, 30, 90) + Math.min(longWords * 2, 8), 20, 98),
    sentences: clamp(scale(perAnswer, 3, 16, 30, 86) + Math.min((linkers / n) * 6, 12), 20, 98),
    confidence: clamp(
      scale(latency, 8000, 1500, 40, 92) + (voiced.length > 0 ? 5 : 0) + (perAnswer >= 10 ? 3 : 0),
      25,
      voiced.length > 0 ? 98 : 78,
    ),
  };
  for (const k of Object.keys(skills)) skills[k] = Math.round(skills[k]);

  // Typing isn't speaking: without a voice answer the estimate tops out at B2.
  const spoken = voiced.length > 0;
  const overall = Math.min(
    Math.round(skills.fluency * 0.3 + skills.vocabulary * 0.25 + skills.sentences * 0.25 + skills.confidence * 0.2),
    spoken ? 100 : 70,
  );
  const ranked = Object.keys(skills).sort((a, b) => skills[b] - skills[a]);

  return {
    overall,
    level: LEVELS.find((l) => overall >= l.min),
    skills,
    wordsSpoken: allWords.length,
    wpm,
    spoken,
    strengths: ranked.slice(0, 2),
    focusAreas: ranked.slice(-2).reverse(),
  };
}

const TOPIC_PRACTICE = {
  daily: { roleplay: "small talk and everyday chats", module: "Everyday expressions from songs and series" },
  travel: { roleplay: "airports, hotels and cafés", module: "Travel phrases from real movie scenes" },
  work: { roleplay: "job interviews and meetings", module: "Movie and series scenes set at work" },
  movies: { roleplay: "your favourite shows", module: "Movie and series lessons with slang and idioms" },
  food: { roleplay: "restaurants, cafés and markets", module: "Food vocabulary from real conversations" },
};

// 4-week plan, mirroring the one on speakeasy-cro's report page.
export function buildPlan(topicId, report, langName) {
  const { roleplay, module } = TOPIC_PRACTICE[topicId];
  const focus = SKILLS[report.focusAreas[0]].label.toLowerCase();
  return [
    {
      title: "Week 1 · Warm up",
      items: [`${report.level.cefr} ${langName} lessons, 10 minutes a day`, `2 calls with Renald about ${roleplay}`, "Start your streak with the daily challenge"],
    },
    {
      title: "Week 2 · Build the habit",
      items: [module, `Focused practice for your ${focus}`, "Review the mistakes from your calls"],
    },
    {
      title: "Week 3 · Real-life practice",
      items: [`Role-plays with Renald: ${roleplay}`, "Mini games for vocabulary and speed", "Climb out of the Rookie league"],
    },
    {
      title: "Week 4 · Level check",
      items: ["Call Renald again and compare your reports", "Take the full level test in the app", "Unlock your next learning path"],
    },
  ];
}
