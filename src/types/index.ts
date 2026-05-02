// ── User & Skin Profile ──────────────────────────────────────────────────────

export type SkinType = 'oily' | 'combination' | 'dry' | 'normal';
export type SkinConcern = 'acne' | 'dullness' | 'dryness' | 'aging' | 'uneven_tone';
export type Sensitivity = 'fragrance' | 'retinol' | 'alcohol' | 'none';
export type Undertone = 'warm' | 'cool' | 'neutral';
export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'oblong';
export type EyeType = 'wide_set' | 'close_set' | 'monolid' | 'almond' | 'hooded' | 'upturned';
export type ColorSeason = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SkinProfile {
  skinType?: SkinType;
  concerns: SkinConcern[];
  sensitivities: Sensitivity[];
  undertone?: Undertone;
  faceShape?: FaceShape;
  eyeType?: EyeType;
  colorSeason?: ColorSeason;
  selfieUri?: string;
  baselinePhotoDate?: string;
}

// ── Onboarding ───────────────────────────────────────────────────────────────

export interface OnboardingData {
  selfieUri?: string;
  skinType?: SkinType;
  sensitivities: Sensitivity[];
  currentProducts: string[];
  primaryConcern?: SkinConcern;
  locationEnabled: boolean;
  lifestyleTracking: {
    sleepHours: boolean;
    stressLevel: boolean;
    cycleTracking: boolean;
  };
  notifications: {
    amReminder: boolean;
    pmReminder: boolean;
    weeklyCheckIn: boolean;
  };
  amReminderTime: string;
  pmReminderTime: string;
}

// ── Products ─────────────────────────────────────────────────────────────────

export type ReactionTag = 'no_reaction' | 'mild_purge' | 'breakout' | 'works_well' | 'discontinued';
export type SafetyTag = 'safe' | 'patch_test' | 'not_suitable';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  platform: 'shopee' | 'tiktok_shop' | 'store';
  safetyTag: SafetyTag;
  fitScore: number;
  imageUrl?: string;
  affiliateUrl?: string;
  ingredients?: string[];
  isNonComedogenic?: boolean;
  isFragranceFree?: boolean;
}

export interface ProductLogEntry {
  id: string;
  product: Product;
  dateStarted: string;
  durationDays: number;
  reactionTag: ReactionTag;
  notes: string;
}

// ── Routine ───────────────────────────────────────────────────────────────────

export interface RoutineStep {
  id: string;
  productName: string;
  brand?: string;
  order: number;
  completed: boolean;
}

export interface Routine {
  am: RoutineStep[];
  pm: RoutineStep[];
  amStreak: number;
  pmStreak: number;
}

// ── Progress / Scores ─────────────────────────────────────────────────────────

export interface WeeklyCheckIn {
  weekNumber: number;
  date: string;
  skinScore: number;
  skinLookRating: number;
  newReactions: boolean;
  sleepQuality: number;
  photoUri?: string;
  notes?: string;
}

// ── Chat ──────────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

// ── Context ───────────────────────────────────────────────────────────────────

export interface WeatherContext {
  temperature: number;
  humidity: number;
  uvIndex: number;
  condition: string;
  city: string;
}

export interface AppState {
  isOnboarded: boolean;
  skinProfile: SkinProfile;
  onboardingData: OnboardingData;
  routine: Routine;
  productLog: ProductLogEntry[];
  checkIns: WeeklyCheckIn[];
  chatHistory: ChatMessage[];
  weatherContext?: WeatherContext;
  isPremium: boolean;
  currentStreak: number;
}
