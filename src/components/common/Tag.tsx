import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type TagVariant = 'safe' | 'patch_test' | 'not_suitable' | 'premium' | 'new' | 'sale' | 'info';

interface TagProps {
  label: string;
  variant?: TagVariant;
  style?: ViewStyle;
  size?: 'sm' | 'md';
}

const variantConfig: Record<TagVariant, { bg: string; text: string; border: string }> = {
  safe: { bg: colors.successLight, text: colors.success, border: colors.success },
  patch_test: { bg: colors.warningLight, text: colors.warning, border: colors.warning },
  not_suitable: { bg: colors.errorLight, text: colors.error, border: colors.error },
  premium: { bg: colors.goldLight, text: colors.gold, border: colors.gold },
  new: { bg: colors.infoLight, text: colors.info, border: colors.info },
  sale: { bg: colors.primaryPale, text: colors.primary, border: colors.primary },
  info: { bg: colors.surfaceAlt, text: colors.textSecondary, border: colors.border },
};

export default function Tag({ label, variant = 'info', style, size = 'sm' }: TagProps) {
  const cfg = variantConfig[variant];
  const textStyle = size === 'sm' ? typography.labelSm : typography.labelMd;
  const padV = size === 'sm' ? 2 : spacing.xs;
  const padH = size === 'sm' ? spacing.sm : spacing.md;

  return (
    <View
      style={[
        {
          paddingVertical: padV,
          paddingHorizontal: padH,
          borderRadius: radius.full,
          backgroundColor: cfg.bg,
          borderWidth: 1,
          borderColor: cfg.border,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text style={[textStyle, { color: cfg.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
