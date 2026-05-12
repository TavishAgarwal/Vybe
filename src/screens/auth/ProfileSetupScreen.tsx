import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { GradientButton } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import { profileSetupSchema } from '../../utils/validators';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProfileSetup'>;

export const ProfileSetupScreen: React.FC<Props> = () => {
  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Real implementation will save to Supabase
  const completeProfile = () => {
    const parsed = profileSetupSchema.safeParse({ displayName, handle, bio });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Check your profile details');
      return;
    }
    // Navigate will happen automatically via RootNavigator when auth state updates
    // For now, we would dispatch the update to Supabase
  };

  return (
    <View style={styles.container}>
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
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <GradientButton
        title="Complete Setup"
        onPress={completeProfile}
        style={styles.button}
      />
    </View>
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
    ...typography.h1,
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
    ...typography.body,
  },
  button: {
    marginTop: spacing.xl,
  },
  errorText: {
    ...typography.body,
    color: colors.status.error,
  },
});
