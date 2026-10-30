import en from "../assets/flags/en.svg";
import es from "../assets/flags/es.svg";
import fr from "../assets/flags/fr.svg";
import ja from "../assets/flags/ja.svg";
import de from "../assets/flags/de.svg";

// `line` is Renald's opening line in the call; `level` drives the demo meter.
export const LANGUAGES = [
  {
    code: "en",
    speechLang: "en-US",
    name: "English",
    native: "English",
    greeting: "Hello!",
    flag: en,
    line: "Hi, I'm Renald! Tell me about your weekend.",
    translation: null,
    level: "B1",
  },
  {
    code: "es",
    speechLang: "es-ES",
    name: "Spanish",
    native: "Español",
    greeting: "¡Hola!",
    flag: es,
    line: "¡Hola! Soy Renald. ¿Qué hiciste el fin de semana?",
    translation: "Hi! I'm Renald. What did you do this weekend?",
    level: "A2",
  },
  {
    code: "fr",
    speechLang: "fr-FR",
    name: "French",
    native: "Français",
    greeting: "Bonjour !",
    flag: fr,
    line: "Bonjour ! Moi, c'est Renald. Tu fais quoi ce week-end ?",
    translation: "Hi! I'm Renald. What are you up to this weekend?",
    level: "A2",
  },
  {
    code: "ja",
    speechLang: "ja-JP",
    name: "Japanese",
    native: "日本語",
    greeting: "こんにちは！",
    flag: ja,
    line: "こんにちは！レナルドです。週末は何をしましたか？",
    translation: "Hi! I'm Renald. What did you do this weekend?",
    level: "A1",
  },
  {
    code: "de",
    speechLang: "de-DE",
    name: "German",
    native: "Deutsch",
    greeting: "Hallo!",
    flag: de,
    line: "Hallo! Ich bin Renald. Was hast du am Wochenende gemacht?",
    translation: "Hi! I'm Renald. What did you do this weekend?",
    level: "B2",
  },
];

export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
