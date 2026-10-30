// Renald's call script, per language. English (`en`) doubles as the subtitle
// shown under non-English lines.

export const TOPICS = [
  { id: "daily", emoji: "💬", label: "Daily life", blurb: "Your routine, weekends, plans" },
  { id: "travel", emoji: "✈️", label: "Travel", blurb: "Trips, hotels, dream places" },
  { id: "work", emoji: "💼", label: "Work & career", blurb: "Your job, interviews, goals" },
  { id: "movies", emoji: "🍿", label: "Movies & series", blurb: "Favourites, plots, movie night" },
  { id: "food", emoji: "☕", label: "Food & cafés", blurb: "Dishes, ordering, memorable meals" },
];

export const HELLO = {
  ask: {
    en: "Hi, I'm Renald, your AI language tutor! Can you hear me okay? Say hi and tell me your name.",
    es: "¡Hola! Soy Renald, tu tutor de idiomas con IA. ¿Me escuchas bien? Salúdame y dime cómo te llamas.",
    fr: "Salut ! Moi, c'est Renald, ton tuteur de langues IA. Tu m'entends bien ? Dis bonjour et dis-moi comment tu t'appelles.",
    ja: "こんにちは！AI語学チューターのレナルドです。声は聞こえますか？あいさつして、お名前を教えてください。",
    de: "Hallo! Ich bin Renald, dein KI-Sprachtutor. Hörst du mich gut? Sag Hallo und verrate mir deinen Namen.",
  },
  starter: {
    en: "Hi Renald, my name is …",
    es: "Hola Renald, me llamo …",
    fr: "Salut Renald, je m'appelle …",
    ja: "こんにちは、…です。",
    de: "Hallo Renald, ich heiße …",
  },
};

const NICE_TO_MEET = {
  en: (n) => `Nice to meet you${n ? `, ${n}` : ""}!`,
  es: (n) => `¡Mucho gusto${n ? `, ${n}` : ""}!`,
  fr: (n) => `Enchanté${n ? `, ${n}` : ""} !`,
  ja: (n) => (n ? `${n}さん、はじめまして！` : "はじめまして！"),
  de: (n) => `Schön, dich kennenzulernen${n ? `, ${n}` : ""}!`,
};

const CLOSING = {
  en: (n) => `Thank you${n ? `, ${n}` : ""}! That was fun. Your speaking report is ready.`,
  es: (n) => `¡Gracias${n ? `, ${n}` : ""}! Ha sido divertido. Tu informe de expresión oral está listo.`,
  fr: (n) => `Merci${n ? `, ${n}` : ""} ! C'était super. Ton bilan à l'oral est prêt.`,
  ja: (n) => `${n ? `${n}さん、` : ""}ありがとうございました！楽しかったです。スピーキングレポートができました。`,
  de: (n) => `Danke${n ? `, ${n}` : ""}! Das hat Spaß gemacht. Dein Sprechbericht ist fertig.`,
};

const REACTIONS = {
  en: ["Nice answer!", "Great, that sounded natural.", "Love it!"],
  es: ["¡Muy buena respuesta!", "¡Genial, sonó muy natural!", "¡Me encanta!"],
  fr: ["Très bonne réponse !", "Super, c'était très naturel.", "J'adore !"],
  ja: ["いい答えですね！", "すごい、自然でした！", "いいですね！"],
  de: ["Gute Antwort!", "Super, das klang sehr natürlich.", "Toll!"],
};

const OPEN_HINT = "Two or three sentences is perfect. Mistakes are okay!";

export const QUESTIONS = {
  daily: [
    {
      hint: OPEN_HINT,
      en: "Let's start easy. Tell me about your typical day. What do you usually do?",
      es: "Empecemos fácil. Cuéntame cómo es un día normal para ti. ¿Qué sueles hacer?",
      fr: "On commence en douceur. Raconte-moi ta journée type. Qu'est-ce que tu fais d'habitude ?",
      ja: "まずは簡単に。あなたの普段の一日について教えてください。いつも何をしますか？",
      de: "Fangen wir leicht an. Erzähl mir von deinem normalen Tag. Was machst du normalerweise?",
    },
    {
      hint: "Use the past tense: what you did, where, and with whom.",
      en: "What did you do last weekend?",
      es: "¿Qué hiciste el fin de semana pasado?",
      fr: "Qu'est-ce que tu as fait le week-end dernier ?",
      ja: "先週末は何をしましたか？",
      de: "Was hast du letztes Wochenende gemacht?",
    },
    {
      hint: "Try: “I would …” and give a reason.",
      en: "Last one! If you had a completely free day tomorrow, how would you spend it?",
      es: "¡La última! Si mañana tuvieras un día totalmente libre, ¿cómo lo pasarías?",
      fr: "Dernière question ! Si demain tu avais une journée complètement libre, comment tu la passerais ?",
      ja: "最後の質問です！明日一日まったく自由だったら、どう過ごしますか？",
      de: "Letzte Frage! Wenn du morgen einen ganz freien Tag hättest, wie würdest du ihn verbringen?",
    },
  ],
  travel: [
    {
      hint: OPEN_HINT,
      en: "Let's talk travel! What's the best place you've ever visited, and why?",
      es: "¡Hablemos de viajes! ¿Cuál es el mejor lugar que has visitado y por qué?",
      fr: "Parlons voyages ! Quel est le plus bel endroit que tu as visité, et pourquoi ?",
      ja: "旅行の話をしましょう！今まで行った中で一番よかった場所はどこですか？どうしてですか？",
      de: "Lass uns übers Reisen reden! Was ist der schönste Ort, den du je besucht hast, und warum?",
    },
    {
      hint: "Role-play: check in, or ask for something you need.",
      en: "Role-play time! I'm the receptionist at your hotel. Welcome! How can I help you?",
      es: "¡Hora de un juego de rol! Soy el recepcionista de tu hotel. ¡Bienvenido! ¿En qué puedo ayudarte?",
      fr: "Petit jeu de rôle ! Je suis le réceptionniste de ton hôtel. Bienvenue ! Comment puis-je t'aider ?",
      ja: "ロールプレイをしましょう！私はホテルの受付です。いらっしゃいませ！ご用件は何でしょうか？",
      de: "Rollenspiel! Ich bin der Rezeptionist in deinem Hotel. Willkommen! Wie kann ich dir helfen?",
    },
    {
      hint: "Talk about the future: where, when, and what you'll do.",
      en: "Last one! Where do you want to travel next, and what will you do there?",
      es: "¡La última! ¿Adónde quieres viajar después y qué vas a hacer allí?",
      fr: "Dernière question ! Où est-ce que tu veux voyager ensuite, et qu'est-ce que tu vas y faire ?",
      ja: "最後の質問です！次はどこに旅行したいですか？そこで何をしたいですか？",
      de: "Letzte Frage! Wohin möchtest du als Nächstes reisen, und was willst du dort machen?",
    },
  ],
  work: [
    {
      hint: OPEN_HINT,
      en: "Let's talk about work. What do you do, or what do you study?",
      es: "Hablemos de trabajo. ¿A qué te dedicas o qué estudias?",
      fr: "Parlons boulot. Qu'est-ce que tu fais dans la vie, ou qu'est-ce que tu étudies ?",
      ja: "仕事の話をしましょう。お仕事は何をしていますか？それとも何を勉強していますか？",
      de: "Reden wir über die Arbeit. Was machst du beruflich, oder was studierst du?",
    },
    {
      hint: "Role-play: sell yourself with two or three strengths.",
      en: "Role-play time! I'm interviewing you for your dream job. Why are you the right person for it?",
      es: "¡Juego de rol! Te estoy entrevistando para el trabajo de tus sueños. ¿Por qué eres la persona ideal?",
      fr: "Jeu de rôle ! Je te fais passer un entretien pour le job de tes rêves. Pourquoi est-ce que tu es la bonne personne ?",
      ja: "ロールプレイです！私はあなたの夢の仕事の面接官です。どうしてあなたがこの仕事にぴったりなのですか？",
      de: "Rollenspiel! Ich führe ein Vorstellungsgespräch für deinen Traumjob. Warum bist du die richtige Person dafür?",
    },
    {
      hint: "Say what the skill is and why it matters to you.",
      en: "Last one! What's one skill you'd love to get better at this year?",
      es: "¡La última! ¿Qué habilidad te gustaría mejorar este año?",
      fr: "Dernière question ! Quelle compétence est-ce que tu aimerais améliorer cette année ?",
      ja: "最後の質問です！今年上達したいスキルは何ですか？",
      de: "Letzte Frage! Welche Fähigkeit möchtest du dieses Jahr verbessern?",
    },
  ],
  movies: [
    {
      hint: OPEN_HINT,
      en: "Let's talk movies! What's a film or series you really love?",
      es: "¡Hablemos de cine! ¿Qué película o serie te encanta?",
      fr: "Parlons cinéma ! C'est quoi un film ou une série que tu adores ?",
      ja: "映画の話をしましょう！大好きな映画やドラマは何ですか？",
      de: "Reden wir über Filme! Welchen Film oder welche Serie liebst du?",
    },
    {
      hint: "Describe the story and one character you like.",
      en: "Without spoilers, what is it about, and who's your favourite character?",
      es: "Sin spoilers, ¿de qué trata y quién es tu personaje favorito?",
      fr: "Sans spoiler, ça parle de quoi, et c'est qui ton personnage préféré ?",
      ja: "ネタバレなしで、どんな話ですか？好きなキャラクターは誰ですか？",
      de: "Ohne Spoiler: Worum geht es, und wer ist deine Lieblingsfigur?",
    },
    {
      hint: "Persuade Renald: pick a title and give reasons.",
      en: "Last one! Movie night tonight: convince me to watch something with you.",
      es: "¡La última! Esta noche hay noche de cine: convénceme para ver algo contigo.",
      fr: "Dernière question ! Ce soir, c'est soirée ciné : convaincs-moi de regarder quelque chose avec toi.",
      ja: "最後の質問です！今夜は映画の夜です。一緒に何かを見るように私を説得してください。",
      de: "Letzte Frage! Heute ist Filmabend: Überzeug mich, etwas mit dir anzuschauen.",
    },
  ],
  food: [
    {
      hint: OPEN_HINT,
      en: "Let's talk food! What's your favourite dish, and how would you describe it?",
      es: "¡Hablemos de comida! ¿Cuál es tu plato favorito y cómo lo describirías?",
      fr: "Parlons cuisine ! C'est quoi ton plat préféré, et comment tu le décrirais ?",
      ja: "食べ物の話をしましょう！好きな料理は何ですか？どんな料理か説明してください。",
      de: "Reden wir übers Essen! Was ist dein Lieblingsgericht, und wie würdest du es beschreiben?",
    },
    {
      hint: "Role-play: order a drink, and maybe something to eat too.",
      en: "Role-play! I'm the barista at Café Speakeasy. Welcome! What can I get for you today?",
      es: "¡Juego de rol! Soy el barista del Café Speakeasy. ¡Bienvenido! ¿Qué te pongo hoy?",
      fr: "Jeu de rôle ! Je suis le barista du Café Speakeasy. Bienvenue ! Qu'est-ce que je te sers aujourd'hui ?",
      ja: "ロールプレイです！私はカフェ・スピークイージーの店員です。いらっしゃいませ！ご注文は何になさいますか？",
      de: "Rollenspiel! Ich bin der Barista im Café Speakeasy. Willkommen! Was darf ich dir heute bringen?",
    },
    {
      hint: "Use the past tense: where, who with, and what made it special.",
      en: "Last one! Tell me about a meal you'll never forget.",
      es: "¡La última! Háblame de una comida que nunca olvidarás.",
      fr: "Dernière question ! Parle-moi d'un repas que tu n'oublieras jamais.",
      ja: "最後の質問です！忘れられない食事について教えてください。",
      de: "Letzte Frage! Erzähl mir von einem Essen, das du nie vergessen wirst.",
    },
  ],
};

// Steps of one call: the hello, then the topic's open questions.
export function buildSteps(topicId) {
  return [{ kind: "name", ...HELLO.ask, hint: "Say it out loud, or type it.", starter: HELLO.starter }].concat(
    QUESTIONS[topicId].map((q) => ({ kind: "open", ...q })),
  );
}

export function lineFor(step, lang, { name, index }) {
  const text = step[lang];
  if (index === 1) return `${NICE_TO_MEET[lang](name)} ${text}`;
  return text;
}

export function reactionFor(lang, index) {
  const list = REACTIONS[lang];
  return list[index % list.length];
}

export function closingFor(lang, name) {
  return CLOSING[lang](name);
}

const NAME_PATTERNS = [
  /\b(?:my name is|name's|i am|i'm|im|call me|this is)\s+([\p{L}'-]+)/iu,
  /\b(?:me llamo|mi nombre es|soy)\s+([\p{L}'-]+)/iu,
  /\b(?:je m'appelle|je m’appelle|moi c'est|moi, c'est|je suis)\s+([\p{L}'-]+)/iu,
  /\b(?:ich heiße|ich heisse|mein name ist|ich bin)\s+([\p{L}'-]+)/iu,
  /(?:私は|わたしは)?([\p{Script=Han}\p{Script=Katakana}\p{Script=Hiragana}A-Za-z]{1,8})(?:です|と申します|といいます)/u,
];
const NOT_A_NAME =
  /^(hi|hello|hey|renald|yes|yeah|okay|ok|fine|good|great|here|you|i|me|my|name|and|so|very|not|from|hola|bonjour|salut|hallo|oui|si|sí|ja|bien|gut|muy|très|sehr|こんにちは|はい)$/i;

export function extractName(text) {
  for (const re of NAME_PATTERNS) {
    const m = text.match(re);
    if (m && !NOT_A_NAME.test(m[1])) return capitalize(m[1]);
  }
  const words = text.match(/[\p{L}'-]+/gu) ?? [];
  const guess = words.length <= 3 ? words.find((w) => !NOT_A_NAME.test(w)) : undefined;
  return guess ? capitalize(guess) : "";
}

function capitalize(w) {
  return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
}
