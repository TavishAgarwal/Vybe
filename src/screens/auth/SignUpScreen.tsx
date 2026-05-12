import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import { GradientButton } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { signUpSchema } from '../../utils/validators';

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SignUp'
>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signUp, isLoading } = useAuthStore();

  const handleSignUp = async () => {
    const parsed = signUpSchema.safeParse({ email, password, confirmPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Check your account details');
      return;
    }

    setError(null);
    await signUp(parsed.data.email, parsed.data.password);
    navigation.navigate('CategorySelect');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Join the most positive community online.
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.text.secondary}
            value={email}
            onChangeText={value => {
              setEmail(value);
              setError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
            maxLength={254}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.text.secondary}
            value={password}
            onChangeText={value => {
              setPassword(value);
              setError(null);
            }}
            secureTextEntry
            textContentType="newPassword"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={colors.text.secondary}
            value={confirmPassword}
            onChangeText={value => {
              setConfirmPassword(value);
              setError(null);
            }}
            secureTextEntry
            textContentType="newPassword"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <GradientButton
          title="Continue"
          onPress={handleSignUp}
          isLoading={isLoading}
          disabled={!email || !password || !confirmPassword || isLoading}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            Log in
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  title: {
    ...typography.weights.bold,
    fontSize: typography.sizes['3xl'],
    color: colors.text.inverse,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.weights.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginBottom: spacing['2xl'],
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.radius.lg,
    padding: spacing.md,
    color: colors.text.primary,
    ...typography.weights.regular,
    fontSize: typography.sizes.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    ...typography.weights.regular,
    color: colors.text.secondary,
  },
  loginLink: {
    ...typography.weights.semiBold,
    color: colors.primary.light,
  },
  errorText: {
    ...typography.weights.medium,
    color: colors.status.error,
    fontSize: typography.sizes.sm,
  },
});
