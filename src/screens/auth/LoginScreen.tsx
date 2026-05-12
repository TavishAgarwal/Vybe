import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import { GradientButton } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { loginSchema } from '../../utils/validators';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Check your login details');
      return;
    }

    setError(null);
    await login(parsed.data.email, parsed.data.password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Log in to keep the good vibes going.
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
            secureTextEntry={true}
            textContentType="password"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <GradientButton
          title="Log In"
          onPress={handleLogin}
          isLoading={isLoading}
          disabled={!email || !password || isLoading}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Don't have an account? </Text>
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('SignUp')}
          >
            Sign up
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Similar styles to SignUp
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
