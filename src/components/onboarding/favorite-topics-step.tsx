import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FAVORITE_TOPICS } from "@/data/onboarding";
import { haptic } from "@/lib/telegram";
import { cn } from "@/lib/utils";
import type { FavoriteTopic } from "@/types";

interface FavoriteTopicsStepProps {
  selected: FavoriteTopic[];
  onToggle: (topic: FavoriteTopic) => void;
  onContinue: () => void;
}

export function FavoriteTopicsStep({ selected, onToggle, onContinue }: FavoriteTopicsStepProps) {
  const isValid = selected.length >= 2 && selected.length <= 5;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <span className="text-xs font-medium uppercase tracking-wider text-emerald-500">
          Интересы
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Расскажи о своих интересах
        </h2>
        <p className="mt-2 text-muted-foreground">
          Выбери от 2 до 5 тем для персонализации контента. Это помогает нам подобрать примеры и упражнения, которые тебе нравятся.
        </p>
        {selected.length > 0 && (
          <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Выбрано: {selected.length}/5
          </p>
        )}
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-wrap gap-2">
          {FAVORITE_TOPICS.map((topic, i) => {
            const isSelected = selected.includes(topic.id);
            const canDeselect = selected.length > 2;
            const canSelect = selected.length < 5;
            const isDisabled = !isSelected && !canSelect;

            return (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => {
                  if (isSelected && !canDeselect) return;
                  if (!isSelected && !canSelect) return;
                  haptic("selection");
                  onToggle(topic.id);
                }}
                disabled={isDisabled}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95",
                  isSelected
                    ? "border-emerald-500 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 shadow-soft"
                    : isDisabled
                      ? "border-border bg-muted/40 text-muted-foreground cursor-not-allowed opacity-50"
                      : "border-border bg-card shadow-soft hover:border-emerald-200"
                )}
              >
                {topic.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="pt-6">
        <p className="mb-3 text-xs text-muted-foreground">
          * Выбор интересов необязателен и может быть обновлён позже
        </p>
        <Button
          size="xl"
          className="w-full"
          disabled={!isValid}
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
