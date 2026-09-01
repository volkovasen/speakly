import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Mic,
  BookOpen,
  BarChart3,
  Flame,
  Flag,
  Lock,
  TrendingUp,
  ArrowRight,
  Plus,
  X,
  Clock,
  Calendar,
  Languages,
  Sparkles,
  Target,
  Heart,
} from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { CEFR_LEVELS, getTelegramUser, haptic } from "@/lib/telegram";
import {
  FAVORITE_TOPICS,
  LEARNING_GOALS,
  AI_TUTOR_PERSONALITIES,
  DAILY_GOALS,
  COURSE_DURATIONS,
} from "@/data/onboarding";
import { cn } from "@/lib/utils";
import type {
  CEFRLevel,
  DailyGoalMinutes,
  CourseDuration,
  TargetLanguage,
  NativeLanguage,
  AITutorPersonality,
  FavoriteTopic,
  LearningGoal,
} from "@/types";

import { LevelTestStep } from "@/components/onboarding/level-test-step";
import { UploadTestResultsStep } from "@/components/onboarding/upload-test-results-step";
import { getLevelTestQuestions } from "@/data/onboarding";

// в компоненте:
const { onboarding, resetOnboarding, updateOnboarding, addCourse, courses, setActiveCourse } =
  useAppStore();

const NATIVE_OPTIONS: { value: NativeLanguage; label: string }[] = [
  { value: "ru", label: "Русский" },
  { value: "en", label: "Английский" },
  { value: "de", label: "Немецкий" },
];

const TARGET_OPTIONS: { value: TargetLanguage; label: string }[] = [
  { value: "en", label: "Английский" },
  { value: "de", label: "Немецкий" },
];

function getAllowedTargets(native: NativeLanguage | null): TargetLanguage[] {
  if (native === "en") return ["de"];
  if (native === "de") return ["en"];
  return ["en", "de"];
}

export function HomeScreen() {
  const { onboarding, resetOnboarding, updateOnboarding, addCourse } =
    useAppStore();

  const user = getTelegramUser();
  const displayName =
    user?.first_name ||
    (user?.username ? `@${user.username}` : "Пользователь");

  const levelInfo = CEFR_LEVELS.find(
    (l) => l.level === onboarding.assessedLevel
  );
  const hasLevel = !!onboarding.assessedLevel;

  const targetLabel =
    TARGET_OPTIONS.find((t) => t.value === onboarding.targetLanguage)?.label ??
    "Язык";

  const dailyMinutes = onboarding.dailyGoalMinutes ?? 15;
  const courseDays = onboarding.courseDuration ?? 60;
  const streak = 0;
  const progressPercent = 0;

  // ── Edit modal ──────────────────────────────────────
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState({
    nativeLanguage: (onboarding.nativeLanguage ?? "ru") as NativeLanguage,
    targetLanguage: (onboarding.targetLanguage ?? "en") as TargetLanguage,
    assessedLevel: (onboarding.assessedLevel ?? "A1") as CEFRLevel,
    dailyGoalMinutes: (onboarding.dailyGoalMinutes ?? 15) as DailyGoalMinutes,
    courseDuration: (onboarding.courseDuration ?? 60) as CourseDuration,
    tutorPersonality: (onboarding.tutorPersonality ??
      "friend") as AITutorPersonality,
    favoriteTopics: [...(onboarding.favoriteTopics ?? [])] as FavoriteTopic[],
    goals: [...(onboarding.goals ?? [])] as LearningGoal[],
  });

  const openEdit = () => {
    setForm({
      nativeLanguage: (onboarding.nativeLanguage ?? "ru") as NativeLanguage,
      targetLanguage: (onboarding.targetLanguage ?? "en") as TargetLanguage,
      assessedLevel: (onboarding.assessedLevel ?? "A1") as CEFRLevel,
      dailyGoalMinutes: (onboarding.dailyGoalMinutes ?? 15) as DailyGoalMinutes,
      courseDuration: (onboarding.courseDuration ?? 60) as CourseDuration,
      tutorPersonality: (onboarding.tutorPersonality ??
        "friend") as AITutorPersonality,
      favoriteTopics: [...(onboarding.favoriteTopics ?? [])] as FavoriteTopic[],
      goals: [...(onboarding.goals ?? [])] as LearningGoal[],
    });
    setIsEditOpen(true);
    haptic("light");
  };

  const saveEdit = () => {
    updateOnboarding({
      nativeLanguage: form.nativeLanguage,
      targetLanguage: form.targetLanguage,
      assessedLevel: form.assessedLevel,
      dailyGoalMinutes: form.dailyGoalMinutes,
      courseDuration: form.courseDuration,
      tutorPersonality: form.tutorPersonality,
      favoriteTopics: form.favoriteTopics,
      goals: form.goals,
    });
    setIsEditOpen(false);
    haptic("success");
  };

  const toggleFormTopic = (topic: FavoriteTopic) => {
    setForm((f) => {
      const has = f.favoriteTopics.includes(topic);
      if (has) {
        if (f.favoriteTopics.length <= 3) return f;
        return {
          ...f,
          favoriteTopics: f.favoriteTopics.filter((t) => t !== topic),
        };
      }
      if (f.favoriteTopics.length >= 5) return f;
      return { ...f, favoriteTopics: [...f.favoriteTopics, topic] };
    });
    haptic("selection");
  };

  const toggleFormGoal = (goal: LearningGoal) => {
    setForm((f) => {
      const has = f.goals.includes(goal);
      return {
        ...f,
        goals: has ? f.goals.filter((g) => g !== goal) : [...f.goals, goal],
      };
    });
    haptic("selection");
  };

  const allowedTargets = getAllowedTargets(form.nativeLanguage);
  const topicsValid =
    form.favoriteTopics.length >= 3 && form.favoriteTopics.length <= 5;
  const canSave =
    !!form.nativeLanguage &&
    !!form.targetLanguage &&
    !!form.dailyGoalMinutes &&
    !!form.courseDuration &&
    !!form.tutorPersonality &&
    topicsValid &&
    form.goals.length > 0;

  // ── Add course wizard ───────────────────────────────
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addStep, setAddStep] = useState(0);
  const [addForm, setAddForm] = useState({
    nativeLanguage: (onboarding.nativeLanguage ?? "ru") as NativeLanguage,
    targetLanguage: (onboarding.targetLanguage ?? "en") as TargetLanguage,
    assessedLevel: "A1" as CEFRLevel,
    dailyGoalMinutes: 15 as DailyGoalMinutes,
    courseDuration: 60 as CourseDuration,
    tutorPersonality: "friend" as AITutorPersonality,
    favoriteTopics: [] as FavoriteTopic[],
    goals: [] as LearningGoal[],
  });

  const openAdd = () => {
    setAddForm({
      nativeLanguage: (onboarding.nativeLanguage ?? "ru") as NativeLanguage,
      targetLanguage: (onboarding.targetLanguage ?? "en") as TargetLanguage,
      assessedLevel: "A1",
      dailyGoalMinutes: 15,
      courseDuration: 60,
      tutorPersonality: "friend",
      favoriteTopics: [],
      goals: [],
    });
    setAddStep(0);
    setIsAddOpen(true);
    haptic("light");
  };

  const addAllowedTargets = getAllowedTargets(addForm.nativeLanguage);

  const addTopicsValid =
    addForm.favoriteTopics.length >= 3 && addForm.favoriteTopics.length <= 5;

  const canNextAdd = () => {
    if (addStep === 0)
      return !!addForm.nativeLanguage && !!addForm.targetLanguage;
    if (addStep === 1) return !!addForm.assessedLevel;
    if (addStep === 2)
      return (
        !!addForm.dailyGoalMinutes &&
        !!addForm.courseDuration &&
        !!addForm.tutorPersonality
      );
    if (addStep === 3) return addTopicsValid;
    if (addStep === 4) return addForm.goals.length > 0;
    return false;
  };

  const finishAdd = () => {
    addCourse({
      nativeLanguage: addForm.nativeLanguage,
      targetLanguage: addForm.targetLanguage,
      assessedLevel: addForm.assessedLevel,
      dailyGoalMinutes: addForm.dailyGoalMinutes,
      courseDuration: addForm.courseDuration,
      tutorPersonality: addForm.tutorPersonality,
      favoriteTopics: addForm.favoriteTopics,
      goals: addForm.goals,
    });
    setIsAddOpen(false);
    haptic("success");
  };

  const toggleAddTopic = (topic: FavoriteTopic) => {
    setAddForm((f) => {
      const has = f.favoriteTopics.includes(topic);
      if (has) {
        if (f.favoriteTopics.length <= 3) return f;
        return {
          ...f,
          favoriteTopics: f.favoriteTopics.filter((t) => t !== topic),
        };
      }
      if (f.favoriteTopics.length >= 5) return f;
      return { ...f, favoriteTopics: [...f.favoriteTopics, topic] };
    });
    haptic("selection");
  };

  const toggleAddGoal = (goal: LearningGoal) => {
    setAddForm((f) => {
      const has = f.goals.includes(goal);
      return {
        ...f,
        goals: has ? f.goals.filter((g) => g !== goal) : [...f.goals, goal],
      };
    });
    haptic("selection");
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Привет, {displayName}
          </h1>
          <img
            src={user?.photo_url || "https://via.placeholder.com/40"}
            alt="avatar"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
          />
        </div>
        <div className="mt-5 flex gap-2">
          <button className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-sm">
            Курсы
          </button>
          <button className="rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-muted-foreground">
            План обучения
          </button>
        </div>
      </header>

      <div className="space-y-4 px-5">
        {/* Personal plan card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border bg-card p-5 shadow-soft"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                {targetLabel}
                {hasLevel ? ` · ${onboarding.assessedLevel}` : ""}
              </p>
              {levelInfo && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {levelInfo.label}
                </p>
              )}
            </div>
            <button
              onClick={openEdit}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted active:bg-muted"
              aria-label="Настройки курса"
            >
              <span className="text-lg leading-none tracking-widest">···</span>
            </button>
          </div>

          <div className="mt-5">
            <p className="text-sm text-muted-foreground">
              {progressPercent}% выполнено
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2">
              <div className="rounded-full border border-border bg-background px-3.5 py-2 text-sm font-semibold">
                {dailyMinutes} мин
              </div>
              <div className="rounded-full border border-border bg-background px-3.5 py-2 text-sm font-semibold">
                {courseDays} дней
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                <Flame className="h-4 w-4" />
                {streak}
              </div>
            </div>
            <button
              onClick={() => haptic("light")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition active:scale-95"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Add course */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          onClick={openAdd}
          className="flex w-full items-center justify-between rounded-3xl border border-border bg-card p-5 shadow-soft transition active:scale-[0.99]"
        >
          <h3 className="text-xl font-bold tracking-tight">Добавить курс</h3>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
            <Plus className="h-5 w-5" />
          </div>
        </motion.button>

        {/* Weekly goal banner */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onClick={() => haptic("light")}
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-left shadow-soft transition active:scale-[0.99]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10">
            <Flag className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Установи недельную цель!
          </span>
        </motion.button>

        {/* Assess card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="relative overflow-hidden rounded-3xl bg-[#D4C4F5] p-5 dark:bg-indigo-950/60"
        >
          <div className="relative z-10 max-w-[65%]">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700/70 dark:text-indigo-300">
              Оценка
            </p>
            <h2 className="mt-2 text-xl font-bold leading-snug text-foreground">
              {hasLevel
                ? `Твой уровень: ${onboarding.assessedLevel}`
                : "Ответь на несколько вопросов, чтобы узнать уровень"}
            </h2>
            {hasLevel && levelInfo && (
              <p className="mt-1 text-sm text-indigo-800/70 dark:text-indigo-300">
                {levelInfo.label}
              </p>
            )}
            <button
              onClick={() => haptic("selection")}
              className="mt-5 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition active:scale-95"
            >
              {hasLevel ? "Пройти снова" : "Узнать уровень"}
            </button>
          </div>
          <div className="absolute -right-2 bottom-2 flex h-28 w-28 items-center justify-center rounded-full bg-white/30 dark:bg-white/10">
            <TrendingUp className="h-12 w-12 text-indigo-600/80 dark:text-indigo-300" />
          </div>
        </motion.div>

        {/* Lessons grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              title: "Урок 1",
              subtitle: "Приветствия · Часть 1",
              color: "bg-[#F5E6A3] dark:bg-yellow-950/40",
              locked: false,
            },
            {
              title: "Урок 2",
              subtitle: "Приветствия · Часть 2",
              color: "bg-[#A8E6CF] dark:bg-emerald-950/40",
              locked: true,
            },
          ].map((lesson, i) => (
            <motion.button
              key={lesson.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.05 }}
              onClick={() => haptic("light")}
              className={`relative rounded-3xl p-4 text-left transition active:scale-[0.98] ${lesson.color}`}
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-foreground/80">
                  {lesson.title}
                </p>
                {lesson.locked && (
                  <Lock className="h-4 w-4 text-foreground/40" />
                )}
              </div>
              <p className="mt-6 text-base font-bold leading-snug text-foreground">
                {lesson.subtitle}
              </p>
            </motion.button>
          ))}
        </div>

        <button
          onClick={resetOnboarding}
          className="w-full py-2 text-center text-xs text-muted-foreground underline"
        >
          Reset onboarding (dev)
        </button>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/90 px-6 pb-6 pt-3 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {[
            { icon: Home, label: "Главная", active: true },
            { icon: Mic, label: "Практика", active: false },
            { icon: BookOpen, label: "Уроки", active: false },
            { icon: BarChart3, label: "Прогресс", active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`flex flex-col items-center gap-1 px-3 py-1 ${
                active ? "text-orange-500" : "text-muted-foreground"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  active ? "bg-orange-500 text-white" : ""
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── Edit course modal ─────────────────────────── */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsEditOpen(false)}
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-2xl sm:rounded-3xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">
                  Настройки курса
                </h2>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition active:scale-95"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Languages className="h-3.5 w-3.5" />
                    Родной язык
                  </label>
                  <div className="flex gap-2">
                    {NATIVE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          const next = opt.value;
                          const allowed = getAllowedTargets(next);
                          setForm((f) => ({
                            ...f,
                            nativeLanguage: next,
                            targetLanguage: allowed.includes(f.targetLanguage)
                              ? f.targetLanguage
                              : allowed[0],
                          }));
                          haptic("selection");
                        }}
                        className={cn(
                          "flex-1 rounded-2xl border px-3 py-3 text-sm font-semibold transition",
                          form.nativeLanguage === opt.value
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-border bg-card text-foreground hover:bg-muted/50"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-muted-foreground">
                    Язык изучения
                  </label>
                  <div className="flex gap-2">
                    {TARGET_OPTIONS.map((opt) => {
                      const allowed = allowedTargets.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          disabled={!allowed}
                          onClick={() => {
                            if (!allowed) return;
                            setForm((f) => ({
                              ...f,
                              targetLanguage: opt.value,
                            }));
                            haptic("selection");
                          }}
                          className={cn(
                            "flex-1 rounded-2xl border px-3 py-3 text-sm font-semibold transition",
                            !allowed &&
                              "cursor-not-allowed opacity-40 border-border bg-muted/40",
                            allowed &&
                              form.targetLanguage === opt.value &&
                              "border-orange-500 bg-orange-500 text-white",
                            allowed &&
                              form.targetLanguage !== opt.value &&
                              "border-border bg-card text-foreground hover:bg-muted/50"
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-muted-foreground">
                    Уровень
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {CEFR_LEVELS.map((lvl) => (
                      <button
                        key={lvl.level}
                        onClick={() => {
                          setForm((f) => ({
                            ...f,
                            assessedLevel: lvl.level,
                          }));
                          haptic("selection");
                        }}
                        className={cn(
                          "flex flex-col items-center rounded-2xl border px-2 py-2.5 transition",
                          form.assessedLevel === lvl.level
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-border bg-card text-foreground hover:bg-muted/50"
                        )}
                      >
                        <span className="text-sm font-bold">{lvl.level}</span>
                        <span
                          className={cn(
                            "mt-0.5 text-[10px] leading-tight",
                            form.assessedLevel === lvl.level
                              ? "text-white/80"
                              : "text-muted-foreground"
                          )}
                        >
                          {lvl.label.split(" ")[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Ежедневная цель
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAILY_GOALS.map((goal) => (
                      <button
                        key={goal.minutes}
                        onClick={() => {
                          setForm((f) => ({
                            ...f,
                            dailyGoalMinutes: goal.minutes,
                          }));
                          haptic("selection");
                        }}
                        className={cn(
                          "rounded-xl border px-4 py-2.5 text-sm font-medium transition active:scale-95",
                          form.dailyGoalMinutes === goal.minutes
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-border bg-card text-foreground hover:bg-muted/50"
                        )}
                      >
                        {goal.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Длительность курса
                  </label>
                  <div className="flex gap-2">
                    {COURSE_DURATIONS.map((d) => (
                      <button
                        key={d.days}
                        onClick={() => {
                          setForm((f) => ({
                            ...f,
                            courseDuration: d.days,
                          }));
                          haptic("selection");
                        }}
                        className={cn(
                          "flex flex-1 flex-col items-center rounded-2xl border py-3 transition",
                          form.courseDuration === d.days
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-border bg-card text-foreground hover:bg-muted/50"
                        )}
                      >
                        <span className="text-sm font-bold">{d.days}</span>
                        <span
                          className={cn(
                            "text-[10px]",
                            form.courseDuration === d.days
                              ? "text-white/80"
                              : "text-muted-foreground"
                          )}
                        >
                          дней
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5" />
                    Характер ИИ-преподавателя
                  </label>
                  <div className="space-y-2">
                    {AI_TUTOR_PERSONALITIES.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setForm((f) => ({
                            ...f,
                            tutorPersonality: p.id,
                          }));
                          haptic("selection");
                        }}
                        className={cn(
                          "w-full rounded-2xl border px-4 py-3.5 text-left transition active:scale-[0.98]",
                          form.tutorPersonality === p.id
                            ? "border-orange-500 bg-orange-500/10"
                            : "border-border bg-card hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{p.emoji}</span>
                          <div>
                            <p className="text-sm font-semibold">{p.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Heart className="h-3.5 w-3.5" />
                    Интересы
                    <span className="ml-auto text-xs font-normal">
                      {form.favoriteTopics.length}/5
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FAVORITE_TOPICS.map((topic) => {
                      const isSelected = form.favoriteTopics.includes(topic.id);
                      const canDeselect = form.favoriteTopics.length > 3;
                      const canSelect = form.favoriteTopics.length < 5;
                      const isDisabled = !isSelected && !canSelect;
                      return (
                        <button
                          key={topic.id}
                          disabled={isDisabled}
                          onClick={() => {
                            if (isSelected && !canDeselect) return;
                            if (!isSelected && !canSelect) return;
                            toggleFormTopic(topic.id);
                          }}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-95",
                            isSelected
                              ? "border-orange-500 bg-orange-500/15 text-orange-700 dark:text-orange-400"
                              : isDisabled
                                ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground opacity-50"
                                : "border-border bg-card hover:border-orange-200"
                          )}
                        >
                          {topic.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Выбери от 3 до 5 тем
                  </p>
                </div>

                <div>
                  <label className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Target className="h-3.5 w-3.5" />
                    Цели обучения
                  </label>
                  <div className="space-y-2">
                    {LEARNING_GOALS.map((goal) => {
                      const isSelected = form.goals.includes(goal.id);
                      return (
                        <button
                          key={goal.id}
                          onClick={() => toggleFormGoal(goal.id)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition active:scale-[0.98]",
                            isSelected
                              ? "border-orange-500 bg-orange-500/10"
                              : "border-border bg-card hover:bg-muted/50"
                          )}
                        >
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{goal.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {goal.description}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3 pb-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 rounded-2xl border border-border py-3.5 text-sm font-semibold transition active:scale-[0.98]"
                >
                  Отмена
                </button>
                <button
                  onClick={saveEdit}
                  disabled={!canSave}
                  className={cn(
                    "flex-1 rounded-2xl py-3.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]",
                    canSave
                      ? "bg-orange-500"
                      : "cursor-not-allowed bg-orange-500/40"
                  )}
                >
                  Сохранить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Add course wizard ─────────────────────────── */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsAddOpen(false)}
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:rounded-3xl"
            >
              <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">
                    Новый курс
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Шаг {addStep + 1} из 5
                  </p>
                </div>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-6 pt-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        i <= addStep ? "bg-orange-500" : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {addStep === 0 && (
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2.5 text-sm font-medium text-muted-foreground">
                        Родной язык
                      </p>
                      <div className="flex gap-2">
                        {NATIVE_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              const next = opt.value;
                              const allowed = getAllowedTargets(next);
                              setAddForm((f) => ({
                                ...f,
                                nativeLanguage: next,
                                targetLanguage: allowed.includes(
                                  f.targetLanguage
                                )
                                  ? f.targetLanguage
                                  : allowed[0],
                              }));
                              haptic("selection");
                            }}
                            className={cn(
                              "flex-1 rounded-2xl border px-3 py-3 text-sm font-semibold transition",
                              addForm.nativeLanguage === opt.value
                                ? "border-orange-500 bg-orange-500 text-white"
                                : "border-border bg-card hover:bg-muted/50"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2.5 text-sm font-medium text-muted-foreground">
                        Язык изучения
                      </p>
                      <div className="flex gap-2">
                        {TARGET_OPTIONS.map((opt) => {
                          const allowed = addAllowedTargets.includes(
                            opt.value
                          );
                          return (
                            <button
                              key={opt.value}
                              disabled={!allowed}
                              onClick={() => {
                                if (!allowed) return;
                                setAddForm((f) => ({
                                  ...f,
                                  targetLanguage: opt.value,
                                }));
                                haptic("selection");
                              }}
                              className={cn(
                                "flex-1 rounded-2xl border px-3 py-3 text-sm font-semibold transition",
                                !allowed && "cursor-not-allowed opacity-40",
                                allowed &&
                                  addForm.targetLanguage === opt.value &&
                                  "border-orange-500 bg-orange-500 text-white",
                                allowed &&
                                  addForm.targetLanguage !== opt.value &&
                                  "border-border bg-card hover:bg-muted/50"
                              )}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {addStep === 1 && (
                  <div>
                    <p className="mb-3 text-sm font-medium text-muted-foreground">
                      Твой уровень
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {CEFR_LEVELS.map((lvl) => (
                        <button
                          key={lvl.level}
                          onClick={() => {
                            setAddForm((f) => ({
                              ...f,
                              assessedLevel: lvl.level,
                            }));
                            haptic("selection");
                          }}
                          className={cn(
                            "flex flex-col items-center rounded-2xl border px-2 py-2.5 transition",
                            addForm.assessedLevel === lvl.level
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-border bg-card hover:bg-muted/50"
                          )}
                        >
                          <span className="text-sm font-bold">
                            {lvl.level}
                          </span>
                          <span
                            className={cn(
                              "mt-0.5 text-[10px]",
                              addForm.assessedLevel === lvl.level
                                ? "text-white/80"
                                : "text-muted-foreground"
                            )}
                          >
                            {lvl.label.split(" ")[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {addStep === 2 && (
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        Ежедневная цель
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {DAILY_GOALS.map((g) => (
                          <button
                            key={g.minutes}
                            onClick={() => {
                              setAddForm((f) => ({
                                ...f,
                                dailyGoalMinutes: g.minutes,
                              }));
                              haptic("selection");
                            }}
                            className={cn(
                              "rounded-xl border px-4 py-2.5 text-sm font-medium transition",
                              addForm.dailyGoalMinutes === g.minutes
                                ? "border-orange-500 bg-orange-500 text-white"
                                : "border-border bg-card hover:bg-muted/50"
                            )}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        Длительность курса
                      </p>
                      <div className="flex gap-2">
                        {COURSE_DURATIONS.map((d) => (
                          <button
                            key={d.days}
                            onClick={() => {
                              setAddForm((f) => ({
                                ...f,
                                courseDuration: d.days,
                              }));
                              haptic("selection");
                            }}
                            className={cn(
                              "flex flex-1 flex-col items-center rounded-2xl border py-3 transition",
                              addForm.courseDuration === d.days
                                ? "border-orange-500 bg-orange-500 text-white"
                                : "border-border bg-card hover:bg-muted/50"
                            )}
                          >
                            <span className="text-sm font-bold">{d.days}</span>
                            <span
                              className={cn(
                                "text-[10px]",
                                addForm.courseDuration === d.days
                                  ? "text-white/80"
                                  : "text-muted-foreground"
                              )}
                            >
                              дней
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5" />
                        Характер ИИ-преподавателя
                      </p>
                      <div className="space-y-2">
                        {AI_TUTOR_PERSONALITIES.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setAddForm((f) => ({
                                ...f,
                                tutorPersonality: p.id,
                              }));
                              haptic("selection");
                            }}
                            className={cn(
                              "w-full rounded-2xl border px-4 py-3 text-left transition",
                              addForm.tutorPersonality === p.id
                                ? "border-orange-500 bg-orange-500/10"
                                : "border-border bg-card hover:bg-muted/50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{p.emoji}</span>
                              <div>
                                <p className="text-sm font-semibold">
                                  {p.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {p.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {addStep === 3 && (
                  <div>
                    <p className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                      <Heart className="h-3.5 w-3.5" />
                      Интересы
                      <span className="ml-auto text-xs font-normal">
                        {addForm.favoriteTopics.length}/5
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {FAVORITE_TOPICS.map((topic) => {
                        const isSelected = addForm.favoriteTopics.includes(
                          topic.id
                        );
                        const canDeselect = addForm.favoriteTopics.length > 3;
                        const canSelect = addForm.favoriteTopics.length < 5;
                        const isDisabled = !isSelected && !canSelect;
                        return (
                          <button
                            key={topic.id}
                            disabled={isDisabled}
                            onClick={() => {
                              if (isSelected && !canDeselect) return;
                              if (!isSelected && !canSelect) return;
                              toggleAddTopic(topic.id);
                            }}
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                              isSelected
                                ? "border-orange-500 bg-orange-500/15 text-orange-700 dark:text-orange-400"
                                : isDisabled
                                  ? "cursor-not-allowed opacity-50"
                                  : "border-border bg-card hover:border-orange-200"
                            )}
                          >
                            {topic.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Выбери от 3 до 5 тем
                    </p>
                  </div>
                )}

                {addStep === 4 && (
                  <div>
                    <p className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                      <Target className="h-3.5 w-3.5" />
                      Цели обучения
                    </p>
                    <div className="space-y-2">
                      {LEARNING_GOALS.map((goal) => {
                        const isSelected = addForm.goals.includes(goal.id);
                        return (
                          <button
                            key={goal.id}
                            onClick={() => toggleAddGoal(goal.id)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
                              isSelected
                                ? "border-orange-500 bg-orange-500/10"
                                : "border-border bg-card hover:bg-muted/50"
                            )}
                          >
                            <div className="flex-1">
                              <p className="text-sm font-semibold">
                                {goal.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {goal.description}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                                ✓
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 border-t border-border/50 px-6 py-4">
                {addStep > 0 ? (
                  <button
                    onClick={() => {
                      setAddStep((s) => s - 1);
                      haptic("light");
                    }}
                    className="flex-1 rounded-2xl border border-border py-3.5 text-sm font-semibold"
                  >
                    Назад
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 rounded-2xl border border-border py-3.5 text-sm font-semibold"
                  >
                    Отмена
                  </button>
                )}
                <button
                  disabled={!canNextAdd()}
                  onClick={() => {
                    if (addStep < 4) {
                      setAddStep((s) => s + 1);
                      haptic("light");
                    } else {
                      finishAdd();
                    }
                  }}
                  className={cn(
                    "flex-1 rounded-2xl py-3.5 text-sm font-semibold text-white transition",
                    canNextAdd()
                      ? "bg-orange-500"
                      : "cursor-not-allowed bg-orange-500/40"
                  )}
                >
                  {addStep < 4 ? "Далее" : "Создать курс"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

