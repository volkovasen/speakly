import type { CEFRLevel, NativeLanguage } from "@/types";

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
  };
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  ready: () => void;
  expand: () => void;
  close: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    setText: (text: string) => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
}

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
}

export function initTelegramApp() {
  const tg = getTelegramWebApp();
  if (!tg) return null;

  tg.ready();
  tg.expand();
  tg.setHeaderColor("#6366F1");
  tg.setBackgroundColor(tg.colorScheme === "dark" ? "#0A0A0B" : "#FAFAFA");

  return tg;
}

export function haptic(type: "light" | "medium" | "success" | "selection" = "light") {
  const tg = getTelegramWebApp();
  if (!tg) return;

  if (type === "success") {
    tg.HapticFeedback.notificationOccurred("success");
  } else if (type === "selection") {
    tg.HapticFeedback.selectionChanged();
  } else {
    tg.HapticFeedback.impactOccurred(type);
  }
}

export function getTelegramUser() {
  const tg = getTelegramWebApp();
  return tg?.initDataUnsafe?.user ?? null;
}

export function getNativeLanguageFromTelegram(): NativeLanguage {
  const tg = getTelegramWebApp();
  const languageCode = tg?.initDataUnsafe?.user?.language_code ?? "en";

  // Map language codes to supported languages
  if (languageCode.startsWith("ru")) return "ru";
  if (languageCode.startsWith("de")) return "de";
  return "en"; // Default to English
}

export const CEFR_LEVELS: {
  level: CEFRLevel;
  label: string;
  description: string;
}[] = [
  { level: "A0", label: "Beginner", description: "No prior knowledge" },
  { level: "A1", label: "Elementary", description: "Basic phrases & greetings" },
  { level: "A2", label: "Pre-Intermediate", description: "Simple everyday topics" },
  { level: "B1", label: "Intermediate", description: "Handle most travel situations" },
  { level: "B2", label: "Upper-Intermediate", description: "Fluent in familiar topics" },
  { level: "C1", label: "Advanced", description: "Complex texts & conversations" },
  { level: "C2", label: "Proficient", description: "Near-native fluency" },
];

export const LEVEL_ORDER: CEFRLevel[] = ["A0", "A1", "A2", "B1", "B2", "C1", "C2"];

export function levelToIndex(level: CEFRLevel): number {
  return LEVEL_ORDER.indexOf(level);
}

export function indexToLevel(index: number): CEFRLevel {
  return LEVEL_ORDER[Math.max(0, Math.min(6, index))];
}
