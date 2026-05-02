import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  color?: string;
  height?: number;
}

export default function ProgressBar({
  current,
  total,
  showLabel = false,
  color = colors.primary,
  height = 4,
}: ProgressBarProps) {
  const progress = Math.min(current / total, 1);

  return (
    <View>
      {showLabel && (
        <Text style={[typography.labelMd, { color: colors.textTertiary, marginBottom: spacing.xs }]}>
          Step {current} of {total}
        </Text>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            { width: `${progress * 100}%`, backgroundColor: color, height, borderRadius: radius.full },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {},
});
