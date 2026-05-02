import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, spacing } from '../theme';

import HomeScreen from '../screens/home/HomeScreen';
import SkinProfileScreen from '../screens/skinProfile/SkinProfileScreen';
import MakeupScreen from '../screens/makeup/MakeupScreen';
import ShopScreen from '../screens/shop/ShopScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

export type TabParamList = {
  Home: undefined;
  SkinProfile: undefined;
  Makeup: undefined;
  Shop: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingTop: spacing.xs,
          ...shadows.sm,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, { active: string; inactive: string }> = {
            Home: { active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline' },
            SkinProfile: { active: 'body', inactive: 'body-outline' },
            Makeup: { active: 'color-palette', inactive: 'color-palette-outline' },
            Shop: { active: 'bag', inactive: 'bag-outline' },
            Profile: { active: 'person-circle', inactive: 'person-circle-outline' },
          };
          const icon = icons[route.name];
          return (
            <Ionicons
              name={(focused ? icon.active : icon.inactive) as any}
              size={focused ? 24 : 22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Hoa AI' }} />
      <Tab.Screen name="SkinProfile" component={SkinProfileScreen} options={{ tabBarLabel: 'Skin' }} />
      <Tab.Screen name="Makeup" component={MakeupScreen} options={{ tabBarLabel: 'Makeup' }} />
      <Tab.Screen name="Shop" component={ShopScreen} options={{ tabBarLabel: 'Shop' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
