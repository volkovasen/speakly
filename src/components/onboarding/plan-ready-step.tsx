import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CEFR_LEVELS, haptic } from "@/lib/telegram";
import { LEARNING_GOALS } from "@/data/onboarding";
import type { OnboardingState } from "@/types";

interface PlanReadyStepProps {
  onboarding: OnboardingState;
  onFinish: () => void;
}

const LOADING_STEPS = [
  "Анализируем твой уровень...",
  "Подбираем специализированные треки...",
  "Создаём упражнения для говорения...",
  "Персонализируем расписание...",
];

export function PlanReadyStep({ onboarding, onFinish }: PlanReadyStepProps) {
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  const [loadingIndex, setLoadingIndex] = useState(0);

  useEffect(() => {
    if (phase !== "loading") return;

    const interval = setInterval(() => {
      setLoadingIndex((i) => {
        if (i >= LOADING_STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => setPhase("ready"), 600);
          return i;
        }
        return i + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [phase]);

  const levelInfo = CEFR_LEVELS.find((l) => l.level === onboarding.assessedLevel);

  const goalsText =
    onboarding.goals.length > 0
      ? onboarding.goals
          .map((id) => LEARNING_GOALS.find((g) => g.id === id)?.label ?? id)
          .join(", ")
      : "Не указана";

  if (phase === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6 py-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-teal-500 shadow-glow"
        >
          <Sparkles className="h-9 w-9 text-white" />
        </motion.div>

        <h2 className="text-xl font-semibold">Создаём твой план</h2>
        <motion.p
          key={loadingIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-muted-foreground"
        >
          {LOADING_STEPS[loadingIndex]}
        </motion.p>

        <div className="mt-8 flex gap-1.5">
          {LOADING_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                i <= loadingIndex ? "bg-indigo-500" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-[calc(100vh-8rem)] flex-col px-6 py-8"
    >
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <CheckCircle2 className="h-16 w-16 text-teal-500" strokeWidth={1.5} />
        </motion.div>

        <h2 className="text-2xl font-bold">Твой план готов!</h2>
        <p className="mt-2 max-w-xs text-muted-foreground">
          {onboarding.assessedLevel
            ? `Персональный план на уровне ${onboarding.assessedLevel}${
                levelInfo ? ` · ${levelInfo.label}` : ""
              }.`
            : "Персональный план обучения готов."}
        </p>

        <div className="mt-8 w-full max-w-sm space-y-3">
          {[
            {
              label: "Уровень",
              value: onboarding.assessedLevel
                ? `${onboarding.assessedLevel}${levelInfo ? ` · ${levelInfo.label}` : ""}`
                : "Не определён",
            },
            {
              label: "Ежедневная цель",
              value: onboarding.dailyGoalMinutes
                ? `${onboarding.dailyGoalMinutes} минут`
                : "Не указана",
            },
            {
              label: "Длительность курса",
              value: onboarding.courseDuration
                ? `${onboarding.courseDuration} дней`
                : "Не указана",
            },
            {
              label: "Цель обучения",
              value: goalsText,
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 shadow-soft"
            >
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-semibold text-right max-w-[60%]">
                {item.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <Button
          size="xl"
          className="w-full"
          onClick={() => {
            haptic("success");
            onFinish();
          }}
        >
          Начать обучение
        </Button>
      </div>
    </motion.div>
  );
}
