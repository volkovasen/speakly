import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AITutorPersonality,
  CEFRLevel,
  Course,
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
  assessmentMode: null,
  externalTestResult: null,
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
  courses: Course[];
  activeCourseId: string | null;

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
  updateOnboarding: (data: Partial<OnboardingState>) => void;
  addCourse: (data: Omit<Course, "id" | "createdAt">) => void;
  setActiveCourse: (id: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: "system",
      onboarding: initialOnboarding,
      courses: [],
      activeCourseId: null,

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
        set((state) => {
          const o = state.onboarding;
          if (state.courses.length > 0) {
            return {
              onboarding: { ...o, isComplete: true },
            };
          }

          if (
            !o.nativeLanguage ||
            !o.targetLanguage ||
            !o.dailyGoalMinutes ||
            !o.courseDuration ||
            !o.tutorPersonality
          ) {
            return state;
          }

          const id = `course_${Date.now()}`;
          const course: Course = {
            id,
            nativeLanguage: o.nativeLanguage,
            targetLanguage: o.targetLanguage,
            assessedLevel: o.assessedLevel,
            dailyGoalMinutes: o.dailyGoalMinutes,
            courseDuration: o.courseDuration,
            tutorPersonality: o.tutorPersonality,
            favoriteTopics: o.favoriteTopics,
            goals: o.goals,
            createdAt: Date.now(),
          };

          return {
            onboarding: { ...o, isComplete: true },
            courses: [course],
            activeCourseId: id,
          };
        }),

      resetOnboarding: () =>
        set({
          onboarding: initialOnboarding,
          courses: [],
          activeCourseId: null,
        }),

      updateOnboarding: (data) =>
        set((state) => ({
          onboarding: { ...state.onboarding, ...data },
        })),

      addCourse: (data) =>
        set((state) => {
          const id = `course_${Date.now()}`;
          const course: Course = { ...data, id, createdAt: Date.now() };
          return {
            courses: [...state.courses, course],
            activeCourseId: id,
            onboarding: {
              ...state.onboarding,
              nativeLanguage: data.nativeLanguage,
              targetLanguage: data.targetLanguage,
              assessedLevel: data.assessedLevel,
              dailyGoalMinutes: data.dailyGoalMinutes,
              courseDuration: data.courseDuration,
              tutorPersonality: data.tutorPersonality,
              favoriteTopics: data.favoriteTopics,
              goals: data.goals,
              isComplete: true,
            },
          };
        }),

      setActiveCourse: (id) =>
        set((state) => {
          const course = state.courses.find((c) => c.id === id);
          if (!course) return state;
          return {
            activeCourseId: id,
            onboarding: {
              ...state.onboarding,
              nativeLanguage: course.nativeLanguage,
              targetLanguage: course.targetLanguage,
              assessedLevel: course.assessedLevel,
              dailyGoalMinutes: course.dailyGoalMinutes,
              courseDuration: course.courseDuration,
              tutorPersonality: course.tutorPersonality,
              favoriteTopics: course.favoriteTopics,
              goals: course.goals,
            },
          };
        }),
    }),
    {
      name: "speakly-storage",
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as Partial<AppStore> & {
          onboarding?: Partial<OnboardingState>;
        };

        return {
          ...state,
          courses: state.courses ?? [],
          activeCourseId: state.activeCourseId ?? null,
          onboarding: {
            ...initialOnboarding,
            ...state.onboarding,
            assessmentMode: state.onboarding?.assessmentMode ?? null,
            externalTestResult: state.onboarding?.externalTestResult ?? null,
          },
        } as AppStore;
      },
      merge: (persistedState, currentState) => {
        const state = persistedState as Partial<AppStore> & {
          onboarding?: Partial<OnboardingState>;
        };

        return {
          ...currentState,
          ...state,
          courses: state.courses ?? currentState.courses,
          activeCourseId: state.activeCourseId ?? currentState.activeCourseId,
          onboarding: {
            ...initialOnboarding,
            ...state.onboarding,
          },
        };
      },
      partialize: (state) => ({
        theme: state.theme,
        onboarding: state.onboarding,
        courses: state.courses,
        activeCourseId: state.activeCourseId,
      }),
    }
  )
);

export const ONBOARDING_STEPS = 8;
