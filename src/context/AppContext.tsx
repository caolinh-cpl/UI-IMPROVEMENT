import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  AppState,
  SkinProfile,
  OnboardingData,
  Routine,
  ProductLogEntry,
  WeeklyCheckIn,
  ChatMessage,
  WeatherContext,
} from '../types';

const defaultOnboardingData: OnboardingData = {
  sensitivities: [],
  currentProducts: [],
  locationEnabled: false,
  lifestyleTracking: { sleepHours: false, stressLevel: false, cycleTracking: false },
  notifications: { amReminder: false, pmReminder: false, weeklyCheckIn: false },
  amReminderTime: '07:00',
  pmReminderTime: '21:00',
};

const defaultRoutine: Routine = {
  am: [],
  pm: [],
  amStreak: 0,
  pmStreak: 0,
};

const defaultSkinProfile: SkinProfile = {
  concerns: [],
  sensitivities: [],
};

const initialState: AppState = {
  isOnboarded: false,
  skinProfile: defaultSkinProfile,
  onboardingData: defaultOnboardingData,
  routine: defaultRoutine,
  productLog: [],
  checkIns: [],
  chatHistory: [],
  isPremium: false,
  currentStreak: 0,
};

type Action =
  | { type: 'COMPLETE_ONBOARDING'; payload: { skinProfile: SkinProfile; onboardingData: OnboardingData } }
  | { type: 'UPDATE_SKIN_PROFILE'; payload: Partial<SkinProfile> }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_CHAT_HISTORY'; payload: ChatMessage[] }
  | { type: 'UPDATE_ROUTINE'; payload: Partial<Routine> }
  | { type: 'ADD_PRODUCT_LOG'; payload: ProductLogEntry }
  | { type: 'UPDATE_PRODUCT_LOG'; payload: ProductLogEntry }
  | { type: 'ADD_CHECK_IN'; payload: WeeklyCheckIn }
  | { type: 'SET_WEATHER'; payload: WeatherContext }
  | { type: 'SET_PREMIUM'; payload: boolean }
  | { type: 'COMPLETE_ROUTINE_STEP'; payload: { period: 'am' | 'pm'; stepId: string } }
  | { type: 'RESET_ROUTINE_STEPS'; payload: { period: 'am' | 'pm' } };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        isOnboarded: true,
        skinProfile: action.payload.skinProfile,
        onboardingData: action.payload.onboardingData,
      };

    case 'UPDATE_SKIN_PROFILE':
      return { ...state, skinProfile: { ...state.skinProfile, ...action.payload } };

    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };

    case 'SET_CHAT_HISTORY':
      return { ...state, chatHistory: action.payload };

    case 'UPDATE_ROUTINE':
      return { ...state, routine: { ...state.routine, ...action.payload } };

    case 'ADD_PRODUCT_LOG':
      return { ...state, productLog: [...state.productLog, action.payload] };

    case 'UPDATE_PRODUCT_LOG':
      return {
        ...state,
        productLog: state.productLog.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case 'ADD_CHECK_IN':
      return { ...state, checkIns: [...state.checkIns, action.payload] };

    case 'SET_WEATHER':
      return { ...state, weatherContext: action.payload };

    case 'SET_PREMIUM':
      return { ...state, isPremium: action.payload };

    case 'COMPLETE_ROUTINE_STEP': {
      const { period, stepId } = action.payload;
      const steps = state.routine[period].map((s) =>
        s.id === stepId ? { ...s, completed: true } : s
      );
      const allDone = steps.every((s) => s.completed);
      const streakKey = period === 'am' ? 'amStreak' : 'pmStreak';
      return {
        ...state,
        routine: {
          ...state.routine,
          [period]: steps,
          [streakKey]: allDone ? state.routine[streakKey] + 1 : state.routine[streakKey],
        },
      };
    }

    case 'RESET_ROUTINE_STEPS': {
      const { period } = action.payload;
      return {
        ...state,
        routine: {
          ...state.routine,
          [period]: state.routine[period].map((s) => ({ ...s, completed: false })),
        },
      };
    }

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
