import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { haptic } from "@/lib/telegram";

interface LevelTestPromptStepProps {
  onStart: () => void;
  onSkip: () => void;
}

export function LevelTestPromptStep({ onStart, onSkip }: LevelTestPromptStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6 py-8"
    >
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold">Сейчас будет тест на определение уровня</h2>
        <p className="mt-3 text-muted-foreground">
          Этот тест поможет подобрать правильный уровень и план обучения. Он занимает пару минут.
        </p>

        <div className="mt-8 grid gap-3">
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              haptic("selection");
              onStart();
            }}
          >
            Пройти сейчас
          </Button>

          <Button
            variant="outline"
            size="lg"
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
