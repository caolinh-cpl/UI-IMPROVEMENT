import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingStep1 from '../screens/onboarding/OnboardingStep1';
import OnboardingStep2 from '../screens/onboarding/OnboardingStep2';
import OnboardingStep3 from '../screens/onboarding/OnboardingStep3';

export type OnboardingParamList = {
  OnboardingStep1: undefined;
  OnboardingStep2: { selfieUri?: string };
  OnboardingStep3: { selfieUri?: string; skinType: string; sensitivities: string[]; primaryConcern: string };
};

const Stack = createNativeStackNavigator<OnboardingParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="OnboardingStep1" component={OnboardingStep1} />
      <Stack.Screen name="OnboardingStep2" component={OnboardingStep2} />
      <Stack.Screen name="OnboardingStep3" component={OnboardingStep3} />
    </Stack.Navigator>
  );
}
