import { motion } from "framer-motion";
import { Sparkles, Mic, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { haptic } from "@/lib/telegram";

interface WelcomeStepProps {
  userName?: string;
  onContinue: () => void;
}

export function WelcomeStep({ userName, onContinue }: WelcomeStepProps) {
  const handleContinue = () => {
    haptic("light");
    onContinue();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-between px-6 py-8"
    >
      <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-teal-500 shadow-glow"
        >
          <Mic className="h-10 w-10 text-white" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <p className="text-sm font-medium text-indigo-500">
            {userName ? `Добро пожаловать, ${userName}` : "Добро пожаловать в Speakly"}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-balance">
            Это твой репетитор по языкам
          </h1>
          <p className="mx-auto max-w-xs text-base text-muted-foreground leading-relaxed">
            Практикуй говорение, улучшай произношение и учись по индивидуальному плану.
          </p>
        </motion.div>

{/* Карточки */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.35 }}
  className="mt-10 grid w-full gap-3"
>
  {[
    { icon: Mic, text: "Практика говорения с ИИ" },
    { icon: TrendingUp, text: "Адаптивный план обучения" },
    { icon: Sparkles, text: "Персональная обратная связь" },
  ].map(({ icon: Icon, text }) => (
    <div
      key={text}
      className="flex h-14 w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 shadow-soft"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50">
        <Icon className="h-4 w-4 text-indigo-500" />
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  ))}
</motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full pt-6"
      >
<Button
  size="xl"
  className="h-14 w-full border border-transparent"  // ← вот это важно
  onClick={handleContinue}
>
  Начать
</Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Займёт около 2 минут · Учётная запись не требуется
        </p>
      </motion.div>
    </motion.div>
  );
}
