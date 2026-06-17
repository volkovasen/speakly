import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AITutorPersonality,
  CEFRLevel,
  CourseDuration,
  DailyGoalMinutes,
  FavoriteTopic,
  LearningGoal,
  NativeLanguage,
  OnboardingState,
  TargetLanguage,
} from "@/types";

const initialOnboarding: OnboardingState = {
  currentStep: 0,
  isComplete: false,
  nativeLanguage: null,
  targetLanguage: null,
  assessedLevel: null,
  selfReportedLevel: null,
  levelTestAnswers: {},
  levelTestScore: 0,
  goals: [],
  prioritySkills: [],
  dailyGoalMinutes: null,
  courseDuration: null,
  tutorPersonality: null,
  favoriteTopics: [],
};

interface AppStore {
  theme: "light" | "dark" | "system";
  onboarding: OnboardingState;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setOnboardingStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setNativeLanguage: (nativeLanguage: NativeLanguage) => void;
  setTargetLanguage: (targetLanguage: TargetLanguage) => void;
  setSelfReportedLevel: (level: CEFRLevel) => void;
  setLevelTestAnswer: (questionId: string, answerId: string) => void;
  setAssessedLevel: (level: CEFRLevel, score: number) => void;
  toggleGoal: (goal: LearningGoal) => void;
  setDailyGoalMinutes: (minutes: DailyGoalMinutes) => void;
  setCourseDuration: (duration: CourseDuration) => void;
  setTutorPersonality: (personality: AITutorPersonality) => void;
  toggleFavoriteTopic: (topic: FavoriteTopic) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: "system",
      onboarding: initialOnboarding,

      setTheme: (theme) => set({ theme }),

      setOnboardingStep: (step) =>
        set((state) => ({
          onboarding: { ...state.onboarding, currentStep: step },
        })),

      nextStep: () =>
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            currentStep: state.onboarding.currentStep + 1,
          },
        })),

      prevStep: () =>
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            currentStep: Math.max(0, state.onboarding.currentStep - 1),
          },
        })),

      setNativeLanguage: (nativeLanguage) =>
        set((state) => ({
          onboarding: { ...state.onboarding, nativeLanguage },
        })),

      setTargetLanguage: (targetLanguage) =>
        set((state) => ({
          onboarding: { ...state.onboarding, targetLanguage },
        })),

      setSelfReportedLevel: (level) =>
        set((state) => ({
          onboarding: { ...state.onboarding, selfReportedLevel: level },
        })),

      setLevelTestAnswer: (questionId, answerId) =>
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            levelTestAnswers: {
              ...state.onboarding.levelTestAnswers,
              [questionId]: answerId,
            },
          },
        })),

      setAssessedLevel: (level, score) =>
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            assessedLevel: level,
            levelTestScore: score,
          },
        })),

      toggleGoal: (goal) =>
        set((state) => {
          const goals = state.onboarding.goals.includes(goal)
            ? state.onboarding.goals.filter((g) => g !== goal)
            : [...state.onboarding.goals, goal];
          return { onboarding: { ...state.onboarding, goals } };
        }),

      setDailyGoalMinutes: (minutes) =>
        set((state) => ({
          onboarding: { ...state.onboarding, dailyGoalMinutes: minutes },
        })),

      setCourseDuration: (duration) =>
        set((state) => ({
          onboarding: { ...state.onboarding, courseDuration: duration },
        })),

      setTutorPersonality: (personality) =>
        set((state) => ({
          onboarding: { ...state.onboarding, tutorPersonality: personality },
        })),

      toggleFavoriteTopic: (topic) =>
        set((state) => {
          const favoriteTopics = state.onboarding.favoriteTopics.includes(topic)
            ? state.onboarding.favoriteTopics.filter((t) => t !== topic)
            : [...state.onboarding.favoriteTopics, topic];
          return { onboarding: { ...state.onboarding, favoriteTopics } };
        }),

      completeOnboarding: () =>
        set((state) => ({
          onboarding: { ...state.onboarding, isComplete: true },
        })),

      resetOnboarding: () => set({ onboarding: initialOnboarding }),
    }),
    {
      name: "speakly-storage",
      partialize: (state) => ({
        theme: state.theme,
        onboarding: state.onboarding,
      }),
    }
  )
);

export const ONBOARDING_STEPS = 8;
