import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { haptic } from "@/lib/telegram";
import type {
  CEFRLevel,
  ExternalTestResult,
  ExternalTestSource,
  TargetLanguage,
} from "@/types";

const englishTestOptions: { value: ExternalTestSource; label: string }[] = [
  { value: "ielts", label: "IELTS" },
  { value: "toefl", label: "TOEFL iBT · шкала 0–120" },
  { value: "cambridge", label: "Cambridge English" },
  { value: "duolingo", label: "Duolingo English Test" },
  { value: "cefr", label: "Уровень CEFR из документа" },
  { value: "other", label: "Другой тест / не знаю" },
];

const germanTestOptions: { value: ExternalTestSource; label: string }[] = [
  { value: "cefr", label: "Уровень CEFR из документа" },
  { value: "other", label: "Другой тест / не знаю" },
];

const cambridgeOptions: { value: CEFRLevel; label: string }[] = [
  { value: "A2", label: "A2 Key (KET)" },
  { value: "B1", label: "B1 Preliminary (PET)" },
  { value: "B2", label: "B2 First (FCE)" },
  { value: "C1", label: "C1 Advanced (CAE)" },
  { value: "C2", label: "C2 Proficiency (CPE)" },
];

const cefrOptions: { value: CEFRLevel; label: string }[] = [
  { value: "A0", label: "A0 — начинаю с нуля" },
  { value: "A1", label: "A1 — Beginner" },
  { value: "A2", label: "A2 — Elementary" },
  { value: "B1", label: "B1 — Intermediate" },
  { value: "B2", label: "B2 — Upper-Intermediate" },
  { value: "C1", label: "C1 — Advanced" },
  { value: "C2", label: "C2 — Proficiency" },
];

function parseScore(score: string) {
  const normalized = score.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function getScoreError(test: ExternalTestSource | null, score: string) {
  if (!test || score.trim().length === 0) return null;
  const value = parseScore(score);
  if (value === null) return "Введи только число";

  if (test === "ielts" && (value < 0 || value > 9 || !Number.isInteger(value * 2))) {
    return "IELTS: от 0 до 9 с шагом 0,5";
  }
  if (test === "toefl" && (value < 0 || value > 120 || !Number.isInteger(value))) {
    return "TOEFL 0–120: целое число от 0 до 120";
  }
  if (
    test === "duolingo" &&
    (value < 10 || value > 160 || !Number.isInteger(value) || value % 5 !== 0)
  ) {
    return "Duolingo: от 10 до 160 с шагом 5";
  }
  return null;
}

function mapScoreToCefr(test: ExternalTestSource, score: string): CEFRLevel | null {
  const value = parseScore(score);
  if (value === null || getScoreError(test, score)) return null;

  if (test === "ielts") {
    if (value >= 8.5) return "C2";
    if (value >= 7) return "C1";
    if (value >= 5.5) return "B2";
    if (value >= 4) return "B1";
    if (value >= 3) return "A2";
    return "A1";
  }

  if (test === "toefl") {
    if (value >= 95) return "C2";
    if (value >= 72) return "C1";
    if (value >= 42) return "B2";
    if (value >= 32) return "B1";
    if (value >= 19) return "A2";
    return "A1";
  }

  if (test === "duolingo") {
    if (value >= 145) return "C2";
    if (value >= 120) return "C1";
    if (value >= 90) return "B2";
    if (value >= 60) return "B1";
    if (value >= 10) return "A2";
    return "A1";
  }

  return null;
}

interface UploadTestResultsStepProps {
  targetLanguage: TargetLanguage | null;
  initialResult?: ExternalTestResult | null;
  onComplete: (result: ExternalTestResult) => void;
}

export function UploadTestResultsStep({
  targetLanguage,
  initialResult,
  onComplete,
}: UploadTestResultsStepProps) {
  const [testType, setTestType] = useState<ExternalTestSource | null>(
    initialResult?.source ?? null
  );
  const [score, setScore] = useState(initialResult?.rawScore ?? "");
  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel | null>(
    initialResult?.cefrLevel ?? null
  );

  const testOptions = targetLanguage === "en" ? englishTestOptions : germanTestOptions;
  const needsTextInput =
    testType === "ielts" ||
    testType === "toefl" ||
    testType === "duolingo";
  const needsCefrSelect =
    testType === "cefr" || testType === "other" || testType === "cambridge";
  const scoreError = needsTextInput ? getScoreError(testType, score) : null;
  const suggestedLevel = useMemo(
    () => (testType && needsTextInput ? mapScoreToCefr(testType, score) : null),
    [needsTextInput, score, testType]
  );
  const canSubmit =
    (needsTextInput && score.trim().length > 0 && !scoreError && suggestedLevel) ||
    (needsCefrSelect && selectedCefr);

  const handleSubmit = () => {
    if (!testType) return;
    const level = needsTextInput ? suggestedLevel : selectedCefr;
    if (!level) return;

    haptic("success");
    onComplete({
      source: testType,
      rawScore: needsTextInput ? score.trim().replace(",", ".") : level,
      cefrLevel: level,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="flex min-h-[calc(100vh-8rem)] flex-col px-6 py-8"
    >
      <div className="flex-1">
        <div className="mb-6">
          <span className="text-xs font-medium uppercase tracking-wider text-indigo-500">
            Определение уровня
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Указать результат
          </h1>
          <p className="mt-3 text-muted-foreground">
            Выбери тест и введи балл вручную. Файл или скриншот загружать не нужно.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold">Какой результат у тебя есть?</h2>
          <div className="grid gap-3">
            {testOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  haptic("selection");
                  setTestType(option.value);
                  setScore("");
                  setSelectedCefr(null);
                }}
                className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 active:scale-[0.98] ${
                  testType === option.value
                    ? "border-indigo-500 bg-indigo-50 shadow-glow dark:bg-indigo-950/30"
                    : "border-border bg-card shadow-soft hover:border-indigo-200"
                }`}
              >
                <p className="font-semibold">{option.label}</p>
              </button>
            ))}
          </div>
        </section>

        {needsTextInput && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold">
              {testType === "ielts" && "Overall Band"}
              {testType === "toefl" && "Общий балл TOEFL по шкале 0–120"}
              {testType === "duolingo" && "Общий балл Duolingo"}
            </h2>
            <input
              type="text"
              inputMode="decimal"
              value={score}
              onChange={(event) => setScore(event.target.value)}
              placeholder={
                testType === "ielts"
                  ? "6.5"
                  : testType === "toefl"
                    ? "90"
                    : "125"
              }
              aria-invalid={!!scoreError}
              className={`w-full rounded-2xl border bg-card px-4 py-4 text-base font-medium shadow-soft outline-none ${
                scoreError ? "border-red-400" : "border-border focus:border-indigo-500"
              }`}
            />
            {scoreError && <p className="mt-2 text-sm text-red-500">{scoreError}</p>}
            {!scoreError && suggestedLevel && (
              <p className="mt-2 text-sm text-muted-foreground">
                Ориентировочный уровень:{" "}
                <span className="font-semibold text-foreground">{suggestedLevel}</span>
              </p>
            )}
          </section>
        )}

        {needsCefrSelect && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold">
              {testType === "cambridge"
                ? "Какой экзамен Cambridge?"
                : "Какой уровень указан в результате?"}
            </h2>
            <div className="grid gap-3">
              {(testType === "cambridge" ? cambridgeOptions : cefrOptions).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    haptic("selection");
                    setSelectedCefr(option.value);
                  }}
                  className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 active:scale-[0.98] ${
                    selectedCefr === option.value
                      ? "border-indigo-500 bg-indigo-50 shadow-glow dark:bg-indigo-950/30"
                      : "border-border bg-card shadow-soft hover:border-indigo-200"
                  }`}
                >
                  <p className="font-semibold">{option.label}</p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-8">
        <Button size="xl" className="w-full" disabled={!canSubmit} onClick={handleSubmit}>
          Применить уровень
        </Button>
      </div>
    </motion.div>
  );
}
