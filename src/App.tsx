import { useEffect } from "react";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { HomeScreen } from "@/pages/home-screen";
import { useAppStore } from "@/stores/app-store";
import { initTelegramApp, getTelegramWebApp } from "@/lib/telegram";

export function App() {
  const { onboarding, theme } = useAppStore();

  useEffect(() => {
    initTelegramApp();
  }, []);

  useEffect(() => {
    const tg = getTelegramWebApp();
    const prefersDark =
      theme === "dark" ||
      (theme === "system" && (tg?.colorScheme === "dark" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches));

    document.documentElement.classList.toggle("dark", prefersDark);
  }, [theme]);

  if (!onboarding.isComplete) {
    return <OnboardingFlow />;
  }

  return <HomeScreen />;
}
