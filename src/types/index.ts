export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type NativeLanguage = "ru" | "en" | "de";
export type TargetLanguage = "en" | "de";

export type LearningGoal =
  | "general"
  | "business"
  | "medicine"
  | "it"
  | "relocation"
  | "exams";

export type PrioritySkill =
  | "speaking"
  | "listening"
  | "vocabulary"
  | "pronunciation"
  | "grammar";

export type CourseDuration = 30 | 60 | 90;

export type DailyGoalMinutes = 5 | 10 | 15 | 20 | 30;

export type AITutorPersonality = "friend" | "teacher" | "trainer" | "coach";

export type FavoriteTopic =
  | "sport"
  | "art"
  | "work"
  | "travel"
  | "nature"
  | "animals"
  | "history"
  | "food"
  | "daily_life"
  | "music"
  | "fashion"
  | "design"
  | "literature"
  | "family"
  | "it"
  | "space"
  | "urban"
  | "study"
  | "photo"
  | "science"
  | "media"
  | "slang"
  | "film"
  | "looks";

export type SpecializedTrack =
  | "business"
  | "medical"
  | "it"
  | "aviation"
  | "ielts"
  | "toefl"
  | "everyday"
  | "travel";

export interface OnboardingState {
  currentStep: number;
  isComplete: boolean;
  nativeLanguage: NativeLanguage | null;
  targetLanguage: TargetLanguage | null;
  assessedLevel: CEFRLevel | null;
  selfReportedLevel: CEFRLevel | null;
  levelTestAnswers: Record<string, string>;
  levelTestScore: number;
  goals: LearningGoal[];
  prioritySkills: PrioritySkill[];
  dailyGoalMinutes: DailyGoalMinutes | null;
  courseDuration: CourseDuration | null;
  tutorPersonality: AITutorPersonality | null;
  favoriteTopics: FavoriteTopic[];
}

export type Course = {
  id: string;
  nativeLanguage: NativeLanguage;
  targetLanguage: TargetLanguage;
  assessedLevel: CEFRLevel | null;
  dailyGoalMinutes: DailyGoalMinutes;
  courseDuration: CourseDuration;
  tutorPersonality: AITutorPersonality;
  favoriteTopics: FavoriteTopic[];
  goals: LearningGoal[];
  createdAt: number;
};

export interface LevelTestQuestion {
  id: string;
  type: "grammar" | "vocabulary" | "reading" | "self-assessment";
  difficulty: CEFRLevel;
  prompt: string;
  options: { id: string; label: string; isCorrect?: boolean; levelHint?: CEFRLevel }[];
  explanation?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  onboarding: OnboardingState;
  streak: number;
  totalMinutes: number;
  createdAt: string;
}
