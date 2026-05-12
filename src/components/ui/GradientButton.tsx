import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../../theme';
import { LucideIcon } from 'lucide-react-native';

export interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  variant = 'primary',
  icon: Icon,
  isLoading = false,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDisabled = disabled || isLoading;

  const content = (
    <>
      {isLoading ? (
        <ActivityIndicator
          color={isPrimary ? colors.text.inverse : colors.text.primary}
        />
      ) : (
        <>
          {Icon && (
            <Icon
              color={isPrimary ? colors.text.inverse : colors.text.primary}
              size={20}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.text,
              isPrimary ? styles.textPrimary : styles.textSecondary,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (isPrimary) {
    return (
      <TouchableOpacity disabled={isDisabled} activeOpacity={0.8} {...props}>
        <LinearGradient
          colors={
            isDisabled
              ? [colors.background.secondary, colors.background.tertiary]
              : [colors.primary.base, colors.primary.dark]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.container, styles.primaryContainer, style]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.container,
        isOutline ? styles.outlineContainer : styles.secondaryContainer,
        isDisabled && styles.disabledContainer,
        style,
      ]}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: spacing.radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  primaryContainer: {
    // shadow applied via outer container or here depending on needs
  },
  secondaryContainer: {
    backgroundColor: colors.background.secondary,
  },
  outlineContainer: {
    backgroundColor: colors.background.default,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  text: {
    ...typography.weights.semiBold,
    fontSize: typography.sizes.lg,
  },
  textPrimary: {
    color: colors.text.inverse,
  },
  textSecondary: {
    color: colors.text.primary,
  },
  icon: {
    marginRight: spacing.sm,
  },
});
