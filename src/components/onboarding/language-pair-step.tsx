import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  onSelectTarget: (target: TargetLanguage) => void;
  onContinue: () => void;
}

export function LanguagePairStep({
  nativeLanguage,
  targetLanguage,
  onSelectTarget,
  onContinue,
}: LanguagePairStepProps) {
  const allowedTargets = getAllowedTargets(nativeLanguage);
  const isContinueEnabled = !!nativeLanguage && !!targetLanguage;

  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
            Твой родной язык: <span className="font-semibold">{nativeOptions.find((o) => o.value === nativeLanguage)?.label}</span>
          </p>
        </div>

        <section>
          <h2 className="mb-3 text-sm font-semibold">Язык изучения</h2>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                haptic("selection");
                setIsSheetOpen(true);
              }}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 text-left shadow-soft transition-all duration-200 hover:border-emerald-200 active:scale-[0.98]"
            >
              <span className="font-semibold">
                {targetLanguage ? targetOptions.find((option) => option.value === targetLanguage)?.label : "Выберите язык"}
              </span>
              <span className="text-sm text-muted-foreground">›</span>
            </button>
          </div>
        </section>
      </div>

      <div className="mt-8">
        <Button size="xl" className="w-full" disabled={!isContinueEnabled} onClick={onContinue}>
          Продолжить
        </Button>
      </div>

      <AnimatePresence>
        {isSheetOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSheetOpen(false)}
            />
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border border-border border-t-0 bg-background p-4 shadow-2xl"
            >
              <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-muted" />
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Выберите язык</h3>
                  <p className="text-sm text-muted-foreground">Доступные языки для обучения</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSheetOpen(false)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted/50"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                {targetOptions.map((option) => {
                  const allowed = allowedTargets.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        if (!allowed) return;
                        haptic("selection");
                        onSelectTarget(option.value);
                        setIsSheetOpen(false);
                      }}
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200 active:scale-[0.98] ${
                        allowed
                          ? "border-border bg-card shadow-soft hover:border-emerald-200"
                          : "border-border bg-muted/40 text-muted-foreground cursor-not-allowed"
                      } ${targetLanguage === option.value ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" : ""}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{option.label}</p>
                        </div>
                        {targetLanguage === option.value && <span className="text-emerald-600">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
