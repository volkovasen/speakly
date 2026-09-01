import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { haptic } from "@/lib/telegram";
import type { NativeLanguage, TargetLanguage } from "@/types";

const nativeOptions: { value: NativeLanguage; label: string }[] = [
  { value: "ru", label: "Русский" },
  { value: "en", label: "Английский" },
  { value: "de", label: "Немецкий" },
];

const targetOptions: { value: TargetLanguage; label: string }[] = [
  { value: "en", label: "Английский" },
  { value: "de", label: "Немецкий" },
];

function getAllowedTargets(nativeLanguage: NativeLanguage | null) {
  if (nativeLanguage === "en") {
    return ["de"] as TargetLanguage[];
  }
  if (nativeLanguage === "de") {
    return ["en"] as TargetLanguage[];
  }
  return ["en", "de"] as TargetLanguage[];
}

interface LanguagePairStepProps {
  nativeLanguage: NativeLanguage | null;
  targetLanguage: TargetLanguage | null;
  onSelectNative: (native: NativeLanguage) => void;
  onSelectTarget: (target: TargetLanguage) => void;
  onContinue: () => void;
}

export function LanguagePairStep({
  nativeLanguage,
  targetLanguage,
  onSelectNative,
  onSelectTarget,
  onContinue,
}: LanguagePairStepProps) {
  const allowedTargets = getAllowedTargets(nativeLanguage);
  const isContinueEnabled = !!nativeLanguage && !!targetLanguage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-[calc(100vh-8rem)] flex-col px-6 py-8"
    >
      <div className="flex-1">
        <div className="mb-6">
          <span className="text-xs font-medium uppercase tracking-wider text-indigo-500">
            Языковая пара
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Выбери язык обучения
          </h1>
          <p className="mt-3 text-muted-foreground">
            Твой родной язык:{" "}
            <span className="font-semibold">
              {nativeOptions.find((o) => o.value === nativeLanguage)?.label ?? "—"}
            </span>
          </p>
        </div>

        {/* Родной язык */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold">Родной язык</h2>
          <div className="grid gap-3">
            {nativeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  haptic("selection");
                  onSelectNative(option.value);
                }}
                className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 active:scale-[0.98] ${
                  nativeLanguage === option.value
                    ? "border-indigo-500 bg-indigo-50 shadow-glow dark:bg-indigo-950/30"
                    : "border-border bg-card shadow-soft hover:border-indigo-200"
                }`}
              >
                <p className="font-semibold">{option.label}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Язык изучения — такой же список */}
        <section>
          <h2 className="mb-3 text-sm font-semibold">Язык изучения</h2>
          <div className="grid gap-3">
            {targetOptions.map((option) => {
              const allowed = allowedTargets.includes(option.value);
              const isSelected = targetLanguage === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={!allowed}
                  onClick={() => {
                    if (!allowed) return;
                    haptic("selection");
                    onSelectTarget(option.value);
                  }}
                  className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 active:scale-[0.98] ${
                    !allowed
                      ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground opacity-50"
                      : isSelected
                        ? "border-indigo-500 bg-indigo-50 shadow-glow dark:bg-indigo-950/30"
                        : "border-border bg-card shadow-soft hover:border-indigo-200"
                  }`}
                >
                  <p className="font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="mt-8">
        <Button
          size="xl"
          className="w-full"
          disabled={!isContinueEnabled}
          onClick={onContinue}
        >
          Продолжить
        </Button>
      </div>
    </motion.div>
  );
}