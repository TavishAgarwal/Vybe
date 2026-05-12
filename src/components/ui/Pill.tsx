import React from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface PillProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Pill: React.FC<PillProps> = ({
  label,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary.base + '20'; // 20% opacity
      case 'success':
        return colors.status.success + '20';
      case 'warning':
        return colors.status.warning + '20';
      case 'error':
        return colors.status.error + '20';
      default:
        return colors.background.tertiary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary.light;
      case 'success':
        return colors.status.success;
      case 'warning':
        return colors.status.warning;
      case 'error':
        return colors.status.error;
      default:
        return colors.text.primary;
    }
  };

  return (
    <View
      style={[
        styles.container,
        size === 'sm' ? styles.containerSm : styles.containerMd,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'sm' ? styles.textSm : styles.textMd,
          { color: getTextColor() },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  containerSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  containerMd: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    ...typography.weights.medium,
  },
  textSm: {
    fontSize: typography.sizes.xs,
  },
  textMd: {
    fontSize: typography.sizes.sm,
  },
});
