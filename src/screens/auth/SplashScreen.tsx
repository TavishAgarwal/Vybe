import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { colors, typography, spacing } from '../../theme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type SplashScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Splash'
>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    // Simulate splash screen delay then go to onboarding
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(1000)} exiting={FadeOut}>
        <Text style={styles.logo}>Vybe</Text>
        <Text style={styles.tagline}>Good energy only.</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    ...typography.weights.black,
    fontSize: 48,
    color: colors.primary.base,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.weights.medium,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
