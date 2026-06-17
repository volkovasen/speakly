import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateAssessedLevel } from "@/data/onboarding";
import { CEFR_LEVELS, haptic } from "@/lib/telegram";
import { cn } from "@/lib/utils";
import type { CEFRLevel } from "@/types";

import type { LevelTestQuestion } from "@/types";

interface LevelTestStepProps {
  questions: LevelTestQuestion[];
  answers: Record<string, string>;
  onAnswer: (questionId: string, answerId: string) => void;
  onComplete: (level: CEFRLevel, score: number) => void;
  onContinue: () => void;
}

export function LevelTestStep({
  questions,
  answers,
  onAnswer,
  onComplete,
  onContinue,
}: LevelTestStepProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<{ level: CEFRLevel; score: number } | null>(
    null
  );

  const question = questions[currentIndex];
  const selectedAnswer = question ? answers[question.id] : undefined;
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleSelect = (answerId: string) => {
    if (selectedAnswer) return;
    haptic("selection");
    if (!question) return;
    onAnswer(question.id, answerId);
    setShowExplanation(true);
  };

  const handleNext = () => {
    haptic("light");
    setShowExplanation(false);

    if (!question || !selectedAnswer) return;

    if (isLastQuestion) {
      const assessment = calculateAssessedLevel(questions, {
        ...answers,
        [question.id]: selectedAnswer,
      });
      setResult(assessment);
      setIsFinished(true);
      onComplete(assessment.level, assessment.score);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  if (isFinished && result) {
    const levelInfo = CEFR_LEVELS.find((l) => l.level === result.level);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6 py-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 shadow-glow"
        >
          <span className="text-3xl font-bold text-white">{result.level}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-bold">{levelInfo?.label}</h2>
          <p className="text-muted-foreground">{levelInfo?.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Результат теста</span>
            <span className="text-lg font-semibold text-indigo-500">
              {result.score}%
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.score}%` }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-500"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Мы подберём уроки под уровень {result.level} и будем адаптировать прогресс.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 w-full max-w-sm"
        >
          <Button
            size="xl"
            className="w-full"
            onClick={() => {
              haptic("light");
              onContinue();
            }}
          >
            Продолжить
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col px-6 py-6">
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-indigo-500">
            Оценка уровня
          </span>
          <span className="text-xs text-muted-foreground">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-1 flex-col"
        >
          <div className="mb-6">
            <span className="mb-2 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              {question.type === "self-assessment"
              ? "Самооценка"
              : ({
                  "vocabulary": "Словарный запас",
                  "grammar": "Грамматика",
                  "reading": "Чтение"
                }[question.type] || question.type)}
            </span>
            <h2 className="mt-3 text-xl font-semibold leading-snug text-balance">
              {question.prompt}
            </h2>
          </div>

          <div className="flex flex-1 flex-col gap-2.5">
            {question.options.map((option, i) => {
              const isSelected = selectedAnswer === option.id;
              const isCorrect = option.isCorrect;
              const showResult = showExplanation && selectedAnswer;

              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelect(option.id)}
                  disabled={!!selectedAnswer}
                  className={cn(
                    "group relative flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-all duration-200",
                    !selectedAnswer &&
                      "border-border bg-card shadow-soft hover:border-indigo-200 hover:shadow-soft-lg active:scale-[0.99] dark:hover:border-indigo-800",
                    isSelected &&
                      !showResult &&
                      "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30",
                    showResult &&
                      isSelected &&
                      isCorrect &&
                      "border-teal-500 bg-teal-50 dark:bg-teal-950/30",
                    showResult &&
                      isSelected &&
                      !isCorrect &&
                      "border-red-300 bg-red-50 dark:bg-red-950/30",
                    showResult && !isSelected && "opacity-50"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition-colors",
                      !selectedAnswer &&
                        "bg-muted text-muted-foreground group-hover:bg-indigo-100 group-hover:text-indigo-600",
                      isSelected && !showResult && "bg-indigo-500 text-white",
                      showResult &&
                        isSelected &&
                        isCorrect &&
                        "bg-teal-500 text-white",
                      showResult &&
                        isSelected &&
                        !isCorrect &&
                        "bg-red-400 text-white"
                    )}
                  >
                    {showResult && isSelected ? (
                      isCorrect ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        "✕"
                      )
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className="text-sm font-medium leading-snug">
                    {option.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && question.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex items-start gap-2.5 rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-950/30"
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="pt-6">
        <Button
          size="xl"
          className="w-full"
          disabled={!selectedAnswer}
          onClick={handleNext}
        >
          {isLastQuestion ? "Узнать мой уровень" : "Продолжить"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
