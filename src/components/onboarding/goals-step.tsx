import { motion } from "framer-motion";
import {
  Globe,
  Briefcase,
  HeartPulse,
  Code,
  Plane,
  GraduationCap,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEARNING_GOALS } from "@/data/onboarding";
import { haptic } from "@/lib/telegram";
import { cn } from "@/lib/utils";
import type { LearningGoal } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Briefcase,
  HeartPulse,
  Code,
  Plane,
  GraduationCap,
};

interface GoalsStepProps {
  selected: LearningGoal[];
  onToggle: (goal: LearningGoal) => void;
  onContinue: () => void;
}

export function GoalsStep({ selected, onToggle, onContinue }: GoalsStepProps) {
  const handleToggle = (goal: LearningGoal) => {
    haptic("selection");
    onToggle(goal);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <span className="text-xs font-medium uppercase tracking-wider text-indigo-500">
          Твои цели
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Что тебя сюда привело?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Выбери все подходящие варианты — мы подберём тебе персональный курс.
        </p>
      </motion.div>

      <div className="flex flex-1 flex-col gap-2.5">
        {LEARNING_GOALS.map((goal, i) => {
          const Icon = ICON_MAP[goal.icon];
          const isSelected = selected.includes(goal.id);

          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleToggle(goal.id)}
              className={cn(
                "flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-200 active:scale-[0.99]",
                isSelected
                  ? "border-indigo-500 bg-indigo-50 shadow-glow dark:bg-indigo-950/30"
                  : "border-border bg-card shadow-soft hover:border-indigo-200 dark:hover:border-indigo-800"
              )}
            >
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                  isSelected
                    ? "bg-indigo-500 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{goal.label}</p>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              </div>
              {isSelected && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="pt-6">
        <Button
          size="xl"
          className="w-full"
          disabled={selected.length === 0}
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
