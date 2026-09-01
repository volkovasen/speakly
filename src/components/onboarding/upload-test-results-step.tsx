import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { haptic } from "@/lib/telegram";
import type { CEFRLevel } from "@/types";

type TestType = "ielts" | "toefl" | "cambridge" | "duolingo" | "cefr" | "other";

const testOptions: { value: TestType; label: string }[] = [
  { value: "ielts", label: "IELTS" },
  { value: "toefl", label: "TOEFL iBT" },
  { value: "cambridge", label: "Cambridge" },
  { value: "duolingo", label: "Duolingo English Test" },
  { value: "cefr", label: "CEFR (A1–C2)" },
  { value: "other", label: "Другой / Не знаю" },
];

const cambridgeOptions = [
  { value: "A2", label: "KET (A2)" },
  { value: "B1", label: "PET (B1)" },
  { value: "B2", label: "FCE (B2)" },
  { value: "C1", label: "CAE (C1)" },
  { value: "C2", label: "CPE (C2)" },
];

const cefrOptions: { value: CEFRLevel; label: string }[] = [
  { value: "A1", label: "A1 — Beginner" },
  { value: "A2", label: "A2 — Elementary" },
  { value: "B1", label: "B1 — Intermediate" },
  { value: "B2", label: "B2 — Upper-Intermediate" },
  { value: "C1", label: "C1 — Advanced" },
  { value: "C2", label: "C2 — Proficiency" },
];

/** Перевод баллов в CEFR */
function mapScoreToCefr(test: TestType, score: string): CEFRLevel | null {
  if (test === "cefr" || test === "other" || test === "cambridge") {
    return (score as CEFRLevel) || null;
  }

  const num = parseFloat(score.replace(",", "."));
  if (Number.isNaN(num)) return null;

  if (test === "ielts") {
    if (num >= 8.5) return "C2";
    if (num >= 7.0) return "C1";
    if (num >= 5.5) return "B2";
    if (num >= 4.0) return "B1";
    if (num >= 3.0) return "A2";
    return "A1";
  }

  if (test === "toefl") {
    if (num >= 95) return "C2";
    if (num >= 72) return "C1";
    if (num >= 42) return "B2";
    if (num >= 32) return "B1";
    if (num >= 19) return "A2";
    return "A1";
  }

  if (test === "duolingo") {
    if (num >= 145) return "C2";
    if (num >= 120) return "C1";
    if (num >= 90) return "B2";
    if (num >= 60) return "B1";
    if (num >= 10) return "A2";
    return "A1";
  }

  return null;
}

interface UploadTestResultsStepProps {
  onComplete: (level: CEFRLevel, source: string) => void;
  onBack: () => void;
}

export function UploadTestResultsStep({ onComplete, onBack }: UploadTestResultsStepProps) {
  const [testType, setTestType] = useState<TestType | null>(null);
  const [score, setScore] = useState("");
  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel | null>(null);

  const needsTextInput = testType === "ielts" || testType === "toefl" || testType === "duolingo";
  const needsCefrSelect = testType === "cefr" || testType === "other" || testType === "cambridge";

  const canSubmit =
    (needsTextInput && score.trim().length > 0) ||
    (needsCefrSelect && selectedCefr);

  const handleSubmit = () => {
    if (!testType) return;

    let level: CEFRLevel | null = null;

    if (needsTextInput) {
      level = mapScoreToCefr(testType, score);
    } else if (selectedCefr) {
      level = selectedCefr;
    }

    if (!level) return;

    haptic("success");
    onComplete(level, testType);
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
            Загрузить результаты
          </h1>
          <p className="mt-3 text-muted-foreground">
            Выбери тест и укажи свой результат — мы переведём его в уровень CEFR.
          </p>
        </div>

        {/* Выбор теста */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold">Какой тест ты сдавал?</h2>
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

        {/* Ввод балла */}
        {needsTextInput && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold">
              {testType === "ielts" && "Overall Band (например 6.5)"}
              {testType === "toefl" && "Балл TOEFL iBT (0–120)"}
              {testType === "duolingo" && "Балл Duolingo (10–160)"}
            </h2>
            <input
              type="text"
              inputMode="decimal"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder={
                testType === "ielts" ? "6.5" : testType === "toefl" ? "85" : "125"
              }
              className="w-full rounded-2xl border border-border bg-card px-4 py-4 text-base font-medium shadow-soft outline-none focus:border-indigo-500"
            />
          </section>
        )}

        {/* Выбор CEFR / Cambridge */}
        {needsCefrSelect && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold">
              {testType === "cambridge" ? "Какой экзамен Cambridge?" : "Твой уровень CEFR"}
            </h2>
            <div className="grid gap-3">
              {(testType === "cambridge" ? cambridgeOptions : cefrOptions).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    haptic("selection");
                    setSelectedCefr(option.value as CEFRLevel);
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

      <div className="mt-8 flex flex-col gap-3">
        <Button
          size="xl"
          className="w-full"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Применить уровень
        </Button>
      </div>
    </motion.div>
  );
}