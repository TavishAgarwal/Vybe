import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { GradientButton } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import { profileSetupSchema } from '../../utils/validators';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../api/supabase';
import { logger } from '../../utils/logger';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ProfileSetup'>;

export const ProfileSetupScreen: React.FC<Props> = () => {
  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthStore();

  const completeProfile = async () => {
    const parsed = profileSetupSchema.safeParse({ displayName, handle, bio });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Check your profile details');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (!user?.id) {
        throw new Error('Not authenticated');
      }

      // Check if the username is already taken by another user
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', handle)
        .neq('id', user.id)
        .limit(1);

      if (existing && existing.length > 0) {
        setError('This username is already taken. Please choose a different one.');
        setIsSaving(false);
        return;
      }

      // updateProfile now persists username, displayName, bio to DB
      // and sets them locally. Once username is set, RootNavigator
      // will automatically transition from Onboarding to Main.
      await useAuthStore.getState().updateProfile({
        handle,
        username: handle,
        displayName,
        bio,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to save profile';
      logger.warn('Profile setup failed', e);
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Set Up Profile</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Display Name"
          placeholderTextColor={colors.text.secondary}
          value={displayName}
          onChangeText={value => {
            setDisplayName(value);
            setError(null);
          }}
          maxLength={50}
        />
        <TextInput
          style={styles.input}
          placeholder="@handle"
          placeholderTextColor={colors.text.secondary}
          value={handle}
          onChangeText={value => {
            setHandle(value);
            setError(null);
          }}
          autoCapitalize="none"
          maxLength={20}
        />
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Tell the world about yourself..."
          placeholderTextColor={colors.text.secondary}
          value={bio}
          onChangeText={value => {
            setBio(value);
            setError(null);
          }}
          multiline
          maxLength={160}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <GradientButton
        title={isSaving ? 'Saving...' : 'Complete Setup'}
        onPress={completeProfile}
        isLoading={isSaving}
        disabled={isSaving}
        style={styles.button}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    ...typography.weights.bold,
    fontSize: typography.sizes['3xl'],
    color: colors.text.primary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl,
  },
  input: {
    backgroundColor: colors.background.surface,
    color: colors.text.primary,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    ...typography.weights.regular,
    fontSize: typography.sizes.md,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: spacing.xl,
  },
  errorText: {
    ...typography.weights.medium,
    color: colors.status.error,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
});
