import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { BlurView, BlurTint } from 'expo-blur';
import { colors, spacing } from '../../theme';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: BlurTint;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  style,
  intensity = 30,
  tint = 'dark',
}) => {
  return (
    <BlurView
      intensity={intensity}
      tint={tint}
      style={[styles.container, style]}
    >
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
});
