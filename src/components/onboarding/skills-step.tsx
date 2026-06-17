import { motion } from "framer-motion";
import {
  Mic,
  AudioLines,
  Headphones,
  BookOpen,
  PenLine,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRIORITY_SKILLS } from "@/data/onboarding";
import { haptic } from "@/lib/telegram";
import { cn } from "@/lib/utils";
import type { PrioritySkill } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Mic,
  AudioLines,
  Headphones,
  BookOpen,
  PenLine,
};

interface SkillsStepProps {
  selected: PrioritySkill[];
  onToggle: (skill: PrioritySkill) => void;
  onContinue: () => void;
}

export function SkillsStep({ selected, onToggle, onContinue }: SkillsStepProps) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <span className="text-xs font-medium uppercase tracking-wider text-teal-500">
          Приоритетные навыки
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Что ты хочешь улучшить?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Выбери области для развития — говорение и произношение — наша специальность.
        </p>
      </motion.div>

      <div className="grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2">
        {PRIORITY_SKILLS.map((skill, i) => {
          const Icon = ICON_MAP[skill.icon];
          const isSelected = selected.includes(skill.id);

          return (
            <motion.button
              key={skill.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                haptic("selection");
                onToggle(skill.id);
              }}
              className={cn(
                "relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.98]",
                isSelected
                  ? "border-teal-500 bg-teal-50 shadow-glow-teal dark:bg-teal-950/30"
                  : "border-border bg-card shadow-soft hover:border-teal-200 dark:hover:border-teal-800"
              )}
            >
              {isSelected && (
                <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                  isSelected
                    ? "bg-teal-500 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{skill.label}</p>
                <p className="text-xs text-muted-foreground">{skill.description}</p>
              </div>
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
