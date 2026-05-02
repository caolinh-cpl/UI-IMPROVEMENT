import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '../../theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  style,
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const padMap = {
    none: 0,
    sm: spacing.sm,
    md: spacing.lg,
    lg: spacing.xxl,
  };

  const variantStyle: ViewStyle = {
    default: {
      backgroundColor: colors.surface,
      ...shadows.sm,
      borderRadius: radius.lg,
    },
    elevated: {
      backgroundColor: colors.surface,
      ...shadows.md,
      borderRadius: radius.lg,
    },
    outlined: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: radius.lg,
    },
    filled: {
      backgroundColor: colors.surfaceAlt,
      borderRadius: radius.lg,
    },
  }[variant];

  return (
    <View style={[variantStyle, { padding: padMap[padding] }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({});
