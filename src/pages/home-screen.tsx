import { motion } from "framer-motion";
import {
  Home,
  Mic,
  BookOpen,
  BarChart3,
  Flame,
  Diamond,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";
import { CEFR_LEVELS, getTelegramUser } from "@/lib/telegram";
import { getWordOfTheDay } from "@/data/onboarding";

export function HomeScreen() {
  const { onboarding, resetOnboarding } = useAppStore();
  const user = getTelegramUser();
  const levelInfo = CEFR_LEVELS.find((l) => l.level === onboarding.assessedLevel);
  const diamonds = 0; // placeholder — в будущем брать из бэкенда или состояния
  const nickname = user?.username ? `@${user.username}` : user?.first_name ?? "Профиль";
  const targetLabel = onboarding.targetLanguage === "en" ? "английский" : onboarding.targetLanguage === "de" ? "немецкий" : "";
  const levelLabel = onboarding.assessedLevel ? `${onboarding.assessedLevel} · ${levelInfo?.label}` : "—";
  const wod = getWordOfTheDay(onboarding.goals[0] ?? null, onboarding.assessedLevel ?? null);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pb-4 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 rounded-3xl border border-border bg-card p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <img
                  src={user?.photo_url || "https://via.placeholder.com/48"}
                  alt="avatar"
                  className="h-12 w-12 rounded-3xl object-cover"
                />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Добро пожаловать</p>
                  <p className="truncate text-xl font-semibold">{nickname}</p>
                  {user?.first_name && user?.username && (
                    <p className="text-xs text-muted-foreground">{user.first_name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex h-20 min-w-[96px] flex-col items-center justify-center rounded-3xl border border-border bg-card px-4 text-center shadow-soft">
              <Diamond className="mb-1 h-5 w-5 text-indigo-500" />
              <p className="text-2xl font-semibold">{diamonds}</p>
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">алмазы</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Твой путь в Speakly</p>
              <h1 className="text-3xl font-bold tracking-tight">Начни с теста уровня</h1>
            </div>
            <Button variant="secondary" size="sm">
              Plus
            </Button>
          </div>
        </motion.div>
      </header>

      <div className="space-y-4 px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <div className="flex flex-col gap-4">
            <div className="text-sm text-muted-foreground">{targetLabel}</div>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold">{levelLabel}</h2>
              <button className="rounded-full bg-card border border-border p-3">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{onboarding.dailyGoalMinutes ?? "—"} min daily</p>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-3xl font-semibold">0</p>
                <Flame className="h-6 w-6 text-rose-500" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="space-y-3">
          <div>
            <button className="w-full rounded-2xl border border-border bg-card py-4 px-4 flex items-center justify-between">
              <span className="text-lg font-medium">добавить курс</span>
              <Plus className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <h3 className="text-sm font-semibold mb-2">слово дня</h3>
            <div className="mt-2">
              <p className="text-2xl font-bold">{wod.word}</p>
              <p className="text-sm text-muted-foreground mt-1">{wod.meaning} · {wod.pos}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-2"
        >
          <h2 className="mb-3 text-lg font-semibold">Ваши курсы</h2>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Английский · Средний</p>
                <h3 className="mt-2 text-lg font-bold">Travel English 360°: Практический курс для путешествий и жизни</h3>
              </div>
              <div className="text-right">
                <p className="text-sm">10 уровней</p>
                <p className="text-xs text-muted-foreground">8/1054 слова</p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-dashed border-border p-6 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Speaking practice, conversation simulator, and progress tracking
            coming in the next build.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={resetOnboarding}
          >
            Reset onboarding (dev)
          </Button>
        </motion.div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 px-6 py-3">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: Mic, label: "Practice", active: false },
            { icon: BookOpen, label: "Learn", active: false },
            { icon: BarChart3, label: "Progress", active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`flex flex-col items-center gap-1 px-3 py-1 ${
                active ? "text-indigo-500" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
