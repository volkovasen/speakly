import type { CEFRLevel, LevelTestQuestion, TargetLanguage } from "@/types";
import { indexToLevel, levelToIndex } from "@/lib/telegram";

const ENGLISH_LEVEL_TEST_QUESTIONS: LevelTestQuestion[] = [
  {
    id: "q1",
    type: "self-assessment",
    difficulty: "A0",
    prompt: "How would you describe your current English level?",
    options: [
      { id: "a0", label: "I know almost no English", levelHint: "A0" },
      { id: "a1", label: "I know basic words and phrases", levelHint: "A1" },
      { id: "a2", label: "I can have simple conversations", levelHint: "A2" },
      { id: "b1", label: "I can discuss familiar topics comfortably", levelHint: "B1" },
      { id: "b2", label: "I can express myself fluently on many subjects", levelHint: "B2" },
      { id: "c1", label: "I use English professionally with ease", levelHint: "C1" },
    ],
  },
  {
    id: "q2",
    type: "vocabulary",
    difficulty: "A1",
    prompt: "Choose the correct word: \"Good ___!\"",
    options: [
      { id: "a", label: "night", isCorrect: false },
      { id: "b", label: "morning", isCorrect: true, levelHint: "A1" },
      { id: "c", label: "afternoon", isCorrect: false },
      { id: "d", label: "evening", isCorrect: false },
    ],
    explanation: "«Good morning» — распространённое приветствие, которое используют до полудня.",
  },
  {
    id: "q3",
    type: "grammar",
    difficulty: "A2",
    prompt: "She ___ to the gym every Tuesday.",
    options: [
      { id: "a", label: "go", isCorrect: false },
      { id: "b", label: "goes", isCorrect: true, levelHint: "A2" },
      { id: "c", label: "going", isCorrect: false },
      { id: "d", label: "gone", isCorrect: false },
    ],
    explanation: "В 3-м лице единственного числа к глаголу добавляется окончание -s: she goes.",
  },
  {
    id: "q4",
    type: "vocabulary",
    difficulty: "B1",
    prompt: "What does \"postpone\" mean?",
    options: [
      { id: "a", label: "To cancel permanently", isCorrect: false },
      { id: "b", label: "To delay to a later time", isCorrect: true, levelHint: "B1" },
      { id: "c", label: "To finish early", isCorrect: false },
      { id: "d", label: "To start immediately", isCorrect: false },
    ],
    explanation: "«Postpone» значит отложить что-то на более поздний срок.",
  },
  {
    id: "q5",
    type: "grammar",
    difficulty: "B2",
    prompt: "If I ___ more time, I would have finished the project.",
    options: [
      { id: "a", label: "have", isCorrect: false },
      { id: "b", label: "had", isCorrect: true, levelHint: "B2" },
      { id: "c", label: "will have", isCorrect: false },
      { id: "d", label: "would have", isCorrect: false },
    ],
    explanation: "В третьем условном предложении в if-части используется Past Perfect: If I had...",
  },
  {
    id: "q6",
    type: "reading",
    difficulty: "C1",
    prompt: "'The proposal was met with skepticism by the board.' What happened?",
    options: [
      { id: "a", label: "The board approved it immediately", isCorrect: false },
      { id: "b", label: "The board had doubts about it", isCorrect: true, levelHint: "C1" },
      { id: "c", label: "The board ignored it", isCorrect: false },
      { id: "d", label: "The board revised it", isCorrect: false },
    ],
    explanation: "«Skepticism» означает сомнение или недоверие.",
  },
  {
    id: "q7",
    type: "vocabulary",
    difficulty: "C2",
    prompt: "Which word is closest in meaning to \"ephemeral\"?",
    options: [
      { id: "a", label: "Permanent", isCorrect: false },
      { id: "b", label: "Fleeting", isCorrect: true, levelHint: "C2" },
      { id: "c", label: "Essential", isCorrect: false },
      { id: "d", label: "Abundant", isCorrect: false },
    ],
    explanation: "«Ephemeral» значит длящийся очень короткое время, мимолётный.",
  },
];

const GERMAN_LEVEL_TEST_QUESTIONS: LevelTestQuestion[] = [
  {
    id: "q1",
    type: "self-assessment",
    difficulty: "A0",
    prompt: "Wie würdest du dein aktuelles Deutsch-Niveau beschreiben?",
    options: [
      { id: "a0", label: "Ich kenne fast kein Deutsch", levelHint: "A0" },
      { id: "a1", label: "Ich kenne einfache Wörter und Sätze", levelHint: "A1" },
      { id: "a2", label: "Ich kann einfache Gespräche führen", levelHint: "A2" },
      { id: "b1", label: "Ich kann vertraute Themen gut besprechen", levelHint: "B1" },
      { id: "b2", label: "Ich kann mich flüssig über verschiedene Themen ausdrücken", levelHint: "B2" },
      { id: "c1", label: "Ich verwende Deutsch sicher im Beruf", levelHint: "C1" },
    ],
  },
  {
    id: "q2",
    type: "vocabulary",
    difficulty: "A1",
    prompt: "Welches Wort passt? \"Ich habe ___ Appetit.\"",
    options: [
      { id: "a", label: "viel", isCorrect: true, levelHint: "A1" },
      { id: "b", label: "vieles", isCorrect: false },
      { id: "c", label: "vielen", isCorrect: false },
      { id: "d", label: "viele", isCorrect: false },
    ],
    explanation: "В немецком говорят «viel Appetit» — «большой аппетит».",
  },
  {
    id: "q3",
    type: "grammar",
    difficulty: "A2",
    prompt: "Er ___ jeden Morgen zur Arbeit.",
    options: [
      { id: "a", label: "fährt", isCorrect: true, levelHint: "A2" },
      { id: "b", label: "fahre", isCorrect: false },
      { id: "c", label: "fahren", isCorrect: false },
      { id: "d", label: "gefahren", isCorrect: false },
    ],
    explanation: "«Er fährt» — правильная форма 3-го лица единственного числа глагола fahren.",
  },
  {
    id: "q4",
    type: "vocabulary",
    difficulty: "B1",
    prompt: "Was bedeutet 'verschieben'?",
    options: [
      { id: "a", label: "etwas später machen", isCorrect: true, levelHint: "B1" },
      { id: "b", label: "etwas absagen", isCorrect: false },
      { id: "c", label: "etwas schneller machen", isCorrect: false },
      { id: "d", label: "etwas beenden", isCorrect: false },
    ],
    explanation: "«Verschieben» значит отложить что-то на более поздний срок.",
  },
  {
    id: "q5",
    type: "grammar",
    difficulty: "B2",
    prompt: "Wenn ich mehr Zeit ___, hätte ich es geschafft.",
    options: [
      { id: "a", label: "hätte", isCorrect: true, levelHint: "B2" },
      { id: "b", label: "hätte gehabt", isCorrect: false },
      { id: "c", label: "habe", isCorrect: false },
      { id: "d", label: "hatte", isCorrect: false },
    ],
    explanation: "В третьем условном предложении (Konjunktiv II) в придаточном используется «hätte».",
  },
  {
    id: "q6",
    type: "reading",
    difficulty: "C1",
    prompt: "'Der Vorschlag stieß auf Skepsis.' Was bedeutet das?",
    options: [
      { id: "a", label: "Der Vorschlag wurde sofort akzeptiert.", isCorrect: false },
      { id: "b", label: "Der Vorschlag wurde kritisch betrachtet.", isCorrect: true, levelHint: "C1" },
      { id: "c", label: "Der Vorschlag wurde ignoriert.", isCorrect: false },
      { id: "d", label: "Der Vorschlag wurde geändert.", isCorrect: false },
    ],
    explanation: "«Skepsis» означает сомнение или критическое отношение.",
  },
  {
    id: "q7",
    type: "vocabulary",
    difficulty: "C2",
    prompt: "Welches Wort bedeutet ähnlich wie 'vergänglich'?",
    options: [
      { id: "a", label: "dauerhaft", isCorrect: false },
      { id: "b", label: "flüchtig", isCorrect: true, levelHint: "C2" },
      { id: "c", label: "wichtig", isCorrect: false },
      { id: "d", label: "reichlich", isCorrect: false },
    ],
    explanation: "«Vergänglich» значит недолговечный, мимолётный.",
  },
];

export type LevelTestMode = "quick" | "full";

export function getLevelTestQuestions(
  targetLanguage: TargetLanguage | null,
  mode: LevelTestMode = "full"
): LevelTestQuestion[] {
  const all =
    targetLanguage === "de"
      ? GERMAN_LEVEL_TEST_QUESTIONS
      : ENGLISH_LEVEL_TEST_QUESTIONS;

  if (mode === "quick") {
    // Быстрая проверка: самооценка + 3 вопроса разной сложности
    return all.filter((q) =>
      ["q1", "q2", "q4", "q6"].includes(q.id)
    );
  }

  // Полная проверка — все вопросы
  return all;
}

export function calculateAssessedLevel(
  questions: LevelTestQuestion[],
  answers: Record<string, string>
): { level: CEFRLevel; score: number; correctCount: number } {
  const scoredQuestions = questions.filter((q) => q.type !== "self-assessment");
  let correctCount = 0;
  const levelScores: number[] = [];

  for (const question of scoredQuestions) {
    const answerId = answers[question.id];
    const selected = question.options.find((o) => o.id === answerId);
    if (selected?.isCorrect) {
      correctCount++;
      if (selected.levelHint) {
        levelScores.push(levelToIndex(selected.levelHint));
      }
    }
  }

  const selfAnswer = answers["q1"];
  const selfOption = questions[0].options.find((o) => o.id === selfAnswer);
  const selfLevel = selfOption?.levelHint ? levelToIndex(selfOption.levelHint) : 2;

  let assessedIndex: number;
  if (correctCount === 0) {
    assessedIndex = selfLevel;
  } else {
    const avgCorrectLevel =
      levelScores.reduce((a, b) => a + b, 0) / levelScores.length;
    assessedIndex = Math.round((avgCorrectLevel * 0.7 + selfLevel * 0.3));
  }

  const score = Math.round((correctCount / scoredQuestions.length) * 100);

  return {
    level: indexToLevel(assessedIndex),
    score,
    correctCount,
  };
}

export const LEARNING_GOALS = [
  { id: "general" as const, label: "Общий английский", icon: "Globe", description: "Повседневное общение" },
  { id: "business" as const, label: "Деловой английский", icon: "Briefcase", description: "Профессиональный английский на работе" },
  { id: "medicine" as const, label: "Медицина", icon: "HeartPulse", description: "Медицинская терминология и помощь пациентам" },
  { id: "it" as const, label: "IT и технологии", icon: "Code", description: "Софт, встречи, документация" },
  { id: "relocation" as const, label: "Переезд", icon: "Plane", description: "Переезд и жизнь за границей" },
  { id: "exams" as const, label: "Экзамены", icon: "GraduationCap", description: "IELTS, TOEFL и сертификаты" },
];

export const PRIORITY_SKILLS = [
  { id: "speaking" as const, label: "Говорение", icon: "Mic", description: "Беглость и уверенность" },
  { id: "pronunciation" as const, label: "Произношение", icon: "AudioLines", description: "Акцент и чёткость" },
  { id: "listening" as const, label: "Аудирование", icon: "Headphones", description: "Навыки понимания" },
  { id: "vocabulary" as const, label: "Словарный запас", icon: "BookOpen", description: "Мощность и выражения" },
  { id: "grammar" as const, label: "Грамматика", icon: "PenLine", description: "Структура и точность" },
];

export const DAILY_GOALS = [
  { minutes: 5 as const, label: "5 мин", description: "Быстрый ежедневный бонус" },
  { minutes: 10 as const, label: "10 мин", description: "Лёгкое и последовательное" },
  { minutes: 15 as const, label: "15 мин", description: "Стабильный прогресс" },
  { minutes: 20 as const, label: "20 мин", description: "Сосредоточенная практика" },
  { minutes: 30 as const, label: "30 мин", description: "Глубокое обучение" },
];

export const COURSE_DURATIONS = [
  { days: 30 as const, label: "30 дней", description: "Быстрый рывок" },
  { days: 60 as const, label: "60 дней", description: "Сбалансированный путь" },
  { days: 90 as const, label: "90 дней", description: "Полная трансформация" },
];

export const AI_TUTOR_PERSONALITIES = [
  { id: "friend" as const, emoji: "😊", name: "Друг", description: "Поддерживает и мотивирует" },
  { id: "teacher" as const, emoji: "🎓", name: "Учитель", description: "Спокойно объясняет и помогает разобраться" },
  { id: "trainer" as const, emoji: "💪", name: "Тренер", description: "Подталкивает к регулярным занятиям" },
  { id: "coach" as const, emoji: "🚀", name: "Коуч", description: "Требовательный, прямой и ориентированный на результат" },
];

export const FAVORITE_TOPICS = [
  { id: "sport" as const, label: "Sport (Спорт)" },
  { id: "art" as const, label: "Art (Искусство)" },
  { id: "work" as const, label: "Work (Работа)" },
  { id: "travel" as const, label: "Travel (Путешествия)" },
  { id: "nature" as const, label: "Nature (Природа)" },
  { id: "animals" as const, label: "Animals (Животные)" },
  { id: "history" as const, label: "History (История)" },
  { id: "food" as const, label: "Food (Еда)" },
  { id: "daily_life" as const, label: "Daily life (Повседневная жизнь)" },
  { id: "music" as const, label: "Music (Музыка)" },
  { id: "fashion" as const, label: "Fashion (Мода)" },
  { id: "design" as const, label: "Design (Дизайн)" },
  { id: "literature" as const, label: "Literature (Литература)" },
  { id: "family" as const, label: "Family (Семья)" },
  { id: "it" as const, label: "IT (Информационные технологии)" },
  { id: "space" as const, label: "Space (Космос)" },
  { id: "urban" as const, label: "Urban (Городская жизнь)" },
  { id: "study" as const, label: "Study (Учёба)" },
  { id: "photo" as const, label: "Photo (Фотография)" },
  { id: "science" as const, label: "Science (Наука)" },
  { id: "media" as const, label: "Media (Медиа)" },
  { id: "slang" as const, label: "Slang (Сленг)" },
  { id: "film" as const, label: "Film (Кино)" },
  { id: "looks" as const, label: "Looks (Внешность)" },
];

export type WordOfDay = {
  word: string;
  meaning: string;
  pos?: string;
};

const WORDS_BY_GOAL_LEVEL: Record<string, Record<string, WordOfDay[]>> = {
  general: {
    A0: [
      { word: "hello", meaning: "привет", pos: "interj." },
      { word: "cat", meaning: "кот", pos: "noun" },
    ],
    A1: [
      { word: "travel", meaning: "путешествовать", pos: "verb" },
      { word: "friend", meaning: "друг", pos: "noun" },
    ],
    B1: [
      { word: "advice", meaning: "совет", pos: "noun" },
      { word: "improve", meaning: "улучшать", pos: "verb" },
    ],
  },
  business: {
    A1: [
      { word: "meeting", meaning: "встреча", pos: "noun" },
      { word: "contract", meaning: "контракт", pos: "noun" },
    ],
    B1: [
      { word: "deadline", meaning: "срок", pos: "noun" },
      { word: "negotiation", meaning: "переговоры", pos: "noun" },
    ],
  },
  travel: {
    A1: [
      { word: "ticket", meaning: "билет", pos: "noun" },
      { word: "airport", meaning: "аэропорт", pos: "noun" },
    ],
    B1: [
      { word: "itinerary", meaning: "маршрут", pos: "noun" },
      { word: "reservation", meaning: "бронирование", pos: "noun" },
    ],
  },
};

export function getWordOfTheDay(goal: string | null, level: string | null): WordOfDay {
  const g = goal ?? "general";
  const lvl = level ?? "A1";

  const byGoal = WORDS_BY_GOAL_LEVEL[g] || WORDS_BY_GOAL_LEVEL["general"];
  const list = byGoal[lvl] || Object.values(byGoal)[0] || WORDS_BY_GOAL_LEVEL["general"]["A1"];

  // Simple deterministic pick: choose based on today's date
  const day = new Date().getDate();
  return list[day % list.length];
}
