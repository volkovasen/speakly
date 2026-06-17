import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AI_TUTOR_PERSONALITIES, DAILY_GOALS } from "@/data/onboarding";
import { haptic } from "@/lib/telegram";
import { cn } from "@/lib/utils";
import type { AITutorPersonality, DailyGoalMinutes } from "@/types";

interface PreferencesStepProps {
  dailyGoalMinutes: DailyGoalMinutes | null;
  tutorPersonality: AITutorPersonality | null;
  onSelectDaily: (minutes: DailyGoalMinutes) => void;
  onSelectTutor: (personality: AITutorPersonality) => void;
  onContinue: () => void;
}

export function PreferencesStep({
  dailyGoalMinutes,
  tutorPersonality,
  onSelectDaily,
  onSelectTutor,
  onContinue,
}: PreferencesStepProps) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <span className="text-xs font-medium uppercase tracking-wider text-indigo-500">
          Твой ритм
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Установи темп занятий
        </h2>
        <p className="mt-2 text-muted-foreground">
          Малые ежедневные шаги ведут к большим результатам.
        </p>
      </motion.div>

      <div className="flex flex-1 flex-col gap-8 overflow-y-auto">
        {/* Daily Goals Section */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Ежедневная цель практики</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {DAILY_GOALS.map((goal, i) => (
              <motion.button
                key={goal.minutes}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => {
                  haptic("selection");
                  onSelectDaily(goal.minutes);
                }}
                className={cn(
                  "rounded-xl border px-4 py-2.5 text-sm font-medium transition-all active:scale-95",
                  dailyGoalMinutes === goal.minutes
                    ? "border-indigo-500 bg-indigo-500 text-white shadow-glow"
                    : "border-border bg-card shadow-soft hover:border-indigo-200"
                )}
              >
                {goal.label}
              </motion.button>
            ))}
          </div>
        </section>

        {/* AI Tutor Personality Section */}
        {dailyGoalMinutes && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Характер ИИ-преподавателя</h3>
            </div>
            <div className="space-y-2">
              {AI_TUTOR_PERSONALITIES.map((personality) => (
                <button
                  key={personality.id}
                  onClick={() => {
                    haptic("selection");
                    onSelectTutor(personality.id);
                  }}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200 active:scale-[0.98]",
                    tutorPersonality === personality.id
                      ? "border-indigo-500 bg-indigo-50 shadow-glow dark:bg-indigo-950/30"
                      : "border-border bg-card shadow-soft hover:border-indigo-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{personality.emoji}</span>
                    <div>
                      <p className="font-semibold">{personality.name}</p>
                      <p className="text-xs text-muted-foreground">{personality.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="pt-6">
        <Button
          size="xl"
          className="w-full"
          disabled={!dailyGoalMinutes || !tutorPersonality}
          onClick={() => {
            haptic("light");
            onContinue();
          }}
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
}
