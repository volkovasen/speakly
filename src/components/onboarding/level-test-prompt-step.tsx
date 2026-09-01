import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { haptic } from "@/lib/telegram";

interface LevelTestPromptStepProps {
  onStartQuick: () => void;
  onStartFull: () => void;
  onUploadResults: () => void;
  onSkip: () => void;
}

export function LevelTestPromptStep({
  onStartQuick,
  onStartFull,
  onUploadResults,
  onSkip,
}: LevelTestPromptStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6 py-8"
    >
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Сейчас будет тест на определение уровня
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Этот тест поможет подобрать правильный уровень и план обучения.
          Занимает пару минут.
        </p>

        <div className="mt-8 grid gap-3">
          <Button
            size="xl"
            className="w-full"
            onClick={() => {
              haptic("selection");
              onStartQuick();
            }}
          >
            Быстрая проверка
          </Button>

          <Button
            variant="outline"
            size="xl"
            className="w-full"
            onClick={() => {
              haptic("selection");
              onStartFull();
            }}
          >
            Полная проверка
          </Button>

          <Button
            variant="secondary"
            size="xl"
            className="w-full"
            onClick={() => {
              haptic("selection");
              onUploadResults();
            }}
          >
            Загрузить результаты теста
          </Button>

          <Button
            variant="ghost"
            size="xl"
            className="w-full"
            onClick={() => {
              haptic("light");
              onSkip();
            }}
          >
            Пройти позже
          </Button>
        </div>
      </div>
    </motion.div>
  );
}