import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'choice' | 'filter' | 'tag';
  style?: ViewStyle;
  emoji?: string;
}

export default function Chip({
  label,
  selected = false,
  onPress,
  size = 'md',
  variant = 'choice',
  style,
  emoji,
}: ChipProps) {
  const padV = size === 'sm' ? spacing.xs : size === 'md' ? spacing.sm : spacing.md;
  const padH = size === 'sm' ? spacing.sm : size === 'md' ? spacing.lg : spacing.xl;

  const baseStyle: ViewStyle = {
    paddingVertical: padV,
    paddingHorizontal: padH,
    borderRadius: radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  const stateStyle: ViewStyle = selected
    ? { backgroundColor: colors.primary, borderColor: colors.primary }
    : variant === 'filter'
    ? { backgroundColor: colors.surface, borderColor: colors.border }
    : { backgroundColor: colors.surface, borderColor: colors.border };

  const textColor = selected ? '#fff' : colors.textSecondary;
  const textStyle = size === 'sm' ? typography.labelMd : typography.labelLg;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[baseStyle, stateStyle, style]}
    >
      {emoji ? (
        <Text style={[textStyle, { color: textColor }]}>
          {emoji}{'  '}{label}
        </Text>
      ) : (
        <Text style={[textStyle, { color: textColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
