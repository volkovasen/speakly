import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { WelcomeStep } from "./welcome-step";
import { LanguagePairStep } from "./language-pair-step";
import { LevelTestStep } from "./level-test-step";
import { LevelTestPromptStep } from "./level-test-prompt-step";
import { UploadTestResultsStep } from "./upload-test-results-step";
import { GoalsStep } from "./goals-step";
import { PreferencesStep } from "./preferences-step";
import { FavoriteTopicsStep } from "./favorite-topics-step";
import { PlanReadyStep } from "./plan-ready-step";
import { ProgressBar } from "./progress-bar";
import { useAppStore, ONBOARDING_STEPS } from "@/stores/app-store";
import { getTelegramUser, haptic, getNativeLanguageFromTelegram } from "@/lib/telegram";
import { getLevelTestQuestions } from "@/data/onboarding";
import type { CEFRLevel } from "@/types";

type AssessmentMode = "quick" | "full" | "upload" | "skipped" | null;

export function OnboardingFlow() {
  const {
    onboarding,
    nextStep,
    prevStep,
    setNativeLanguage,
    setTargetLanguage,
    setLevelTestAnswer,
    setAssessedLevel,
    toggleGoal,
    setDailyGoalMinutes,
    setTutorPersonality,
    toggleFavoriteTopic,
    completeOnboarding,
  } = useAppStore();

  const [assessmentMode, setAssessmentMode] = useState<AssessmentMode>(null);

  const user = getTelegramUser();
  const step = onboarding.currentStep;
  const showBack = step > 0 && step < ONBOARDING_STEPS;
  const showProgress = step > 0 && step < ONBOARDING_STEPS;

  useEffect(() => {
    if (!onboarding.nativeLanguage) {
      const detectedLanguage = getNativeLanguageFromTelegram();
      setNativeLanguage(detectedLanguage);
    }
  }, []);

const handleBack = () => {
  haptic("light");

  // Если пришли с "Пройти позже" на Preferences — возвращаемся сразу на выбор теста
  if (step === 4 && assessmentMode === "skipped") {
    setAssessmentMode(null);
    prevStep(); // 4 → 3
    prevStep(); // 3 → 2
    return;
  }

  if (step === 3) {
    setAssessmentMode(null);
  }

  prevStep();
};

  const handleLevelComplete = (level: CEFRLevel, score: number) => {
    setAssessedLevel(level, score);
  };

  const handleUploadComplete = (level: CEFRLevel, source: string) => {
    // score = 0, потому что это не наш тест, а внешний результат
    setAssessedLevel(level, 0);
    setAssessmentMode(null);
    nextStep(); // переходим к Preferences
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <WelcomeStep
            userName={user?.first_name}
            onContinue={nextStep}
          />
        );

      case 1:
        return (
          <LanguagePairStep
            nativeLanguage={onboarding.nativeLanguage}
            targetLanguage={onboarding.targetLanguage}
            onSelectNative={setNativeLanguage}
            onSelectTarget={setTargetLanguage}
            onContinue={nextStep}
          />
        );

case 2:
  return (
    <LevelTestPromptStep
      onStartQuick={() => {
        setAssessmentMode("quick");
        nextStep();
      }}
      onStartFull={() => {
        setAssessmentMode("full");
        nextStep();
      }}
      onUploadResults={() => {
        setAssessmentMode("upload");
        nextStep();
      }}
onSkip={() => {
  setAssessmentMode("skipped");
  nextStep(); // → 3
  nextStep(); // → 4
}}
    />
  );

case 3:
  if (assessmentMode === "upload") {
    return (
      <UploadTestResultsStep
        onComplete={handleUploadComplete}
        onBack={() => {
          setAssessmentMode(null);
          prevStep();
        }}
      />
    );
  }

  if (assessmentMode === "quick" || assessmentMode === "full") {
    return (
      <LevelTestStep
        answers={onboarding.levelTestAnswers}
        questions={getLevelTestQuestions(
          onboarding.targetLanguage,
          assessmentMode === "quick" ? "quick" : "full"
        )}
        onAnswer={setLevelTestAnswer}
        onComplete={handleLevelComplete}
        onContinue={nextStep}
      />
    );
  }

  // Сюда не должны попадать (skipped / null)
  return null;

      case 4:
        return (
          <PreferencesStep
            dailyGoalMinutes={onboarding.dailyGoalMinutes}
            tutorPersonality={onboarding.tutorPersonality}
            onSelectDaily={setDailyGoalMinutes}
            onSelectTutor={setTutorPersonality}
            onContinue={nextStep}
          />
        );

      case 5:
        return (
          <FavoriteTopicsStep
            selected={onboarding.favoriteTopics}
            onToggle={toggleFavoriteTopic}
            onContinue={nextStep}
          />
        );

      case 6:
        return (
          <GoalsStep
            selected={onboarding.goals}
            onToggle={toggleGoal}
            onContinue={nextStep}
          />
        );

      case 7:
        return (
          <PlanReadyStep
            onboarding={onboarding}
            onFinish={completeOnboarding}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {(showBack || showProgress) && (
        <header className="sticky top-0 z-10 glass border-b border-border/50 px-4 py-3">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            {showBack && (
              <button
                onClick={handleBack}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95"
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {showProgress && (
              <ProgressBar
                current={step}
                total={ONBOARDING_STEPS - 1}
                className="flex-1"
              />
            )}
          </div>
        </header>
      )}

      <main className="mx-auto max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${step}-${assessmentMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}