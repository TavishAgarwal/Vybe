import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import { GradientButton } from '../../components/ui';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Onboarding'
>;

interface OnboardingScreenProps {
  navigation: OnboardingScreenNavigationProp;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  navigation,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.emoji}>✨</Text>
        </View>
        <Text style={styles.title}>Welcome to Vybe</Text>
        <Text style={styles.subtitle}>
          The positive social platform where talent shines and good vibes win.
        </Text>
      </View>

      <View style={styles.footer}>
        <GradientButton
          title="Get Started"
          onPress={() => navigation.navigate('PositivityPledge')}
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
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  imagePlaceholder: {
    width: 160,
    height: 160,
    backgroundColor: colors.background.secondary,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    ...typography.weights.bold,
    fontSize: typography.sizes['3xl'],
    color: colors.text.inverse,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.weights.regular,
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    ...typography.weights.regular,
    color: colors.text.secondary,
  },
  loginLink: {
    ...typography.weights.semiBold,
    color: colors.primary.light,
  },
});
