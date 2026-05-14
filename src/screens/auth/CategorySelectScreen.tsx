import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { GradientButton } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../api/supabase';
import { logger } from '../../utils/logger';

const CATEGORIES = [
  { id: 'music', label: '🎵 Music', emoji: '🎵' },
  { id: 'dance', label: '💃 Dance', emoji: '💃' },
  { id: 'comedy', label: '😂 Comedy', emoji: '😂' },
  { id: 'art', label: '🎨 Art', emoji: '🎨' },
  { id: 'sports', label: '⚽ Sports', emoji: '⚽' },
  { id: 'gaming', label: '🎮 Gaming', emoji: '🎮' },
  { id: 'cooking', label: '🍳 Cooking', emoji: '🍳' },
  { id: 'fashion', label: '👗 Fashion', emoji: '👗' },
  { id: 'fitness', label: '💪 Fitness', emoji: '💪' },
  { id: 'diy', label: '🔨 DIY', emoji: '🔨' },
  { id: 'pets', label: '🐾 Pets', emoji: '🐾' },
  { id: 'travel', label: '✈️ Travel', emoji: '✈️' },
];

type Props = NativeStackScreenProps<OnboardingStackParamList, 'CategorySelect'>;

export const CategorySelectScreen: React.FC<Props> = ({ navigation }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const toggleCategory = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setError(null);
  }, []);

  const handleContinue = async () => {
    if (selected.size === 0) {
      setError('Select at least one category');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const categories = Array.from(selected);

      if (user?.id) {
        await supabase
          .from('users')
          .update({ categories })
          .eq('id', user.id);
      }

      // Update local auth store
      useAuthStore.getState().updateProfile({ categories });

      navigation.navigate('ProfileSetup');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to save categories';
      logger.warn('Category save failed', e);
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Vybes</Text>
        <Text style={styles.subtitle}>
          What kind of content do you want to see? Pick at least one.
        </Text>
      </View>

      <View style={styles.grid}>
        {CATEGORIES.map(category => {
          const isSelected = selected.has(category.id);
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
              ]}
              onPress={() => toggleCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipEmoji}>{category.emoji}</Text>
              <Text
                style={[
                  styles.chipLabel,
                  isSelected && styles.chipLabelSelected,
                ]}
              >
                {category.id.charAt(0).toUpperCase() + category.id.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.footer}>
        <Text style={styles.countText}>
          {selected.size} selected
        </Text>
        <GradientButton
          title={isSaving ? 'Saving...' : 'Continue'}
          onPress={handleContinue}
          disabled={selected.size === 0 || isSaving}
          isLoading={isSaving}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.weights.bold,
    fontSize: typography.sizes['3xl'],
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.weights.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    alignContent: 'flex-start',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.full,
    backgroundColor: colors.background.secondary,
    borderWidth: 1.5,
    borderColor: colors.background.secondary,
    gap: spacing.xs,
  },
  chipSelected: {
    backgroundColor: `${colors.primary.base}20`,
    borderColor: colors.primary.base,
  },
  chipEmoji: {
    fontSize: 18,
  },
  chipLabel: {
    ...typography.weights.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  chipLabelSelected: {
    color: colors.primary.light,
    ...typography.weights.semiBold,
  },
  errorText: {
    ...typography.weights.medium,
    color: colors.status.error,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  footer: {
    padding: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  countText: {
    ...typography.weights.medium,
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  button: {
    width: '100%',
  },
});
