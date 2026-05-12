import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import { GradientButton, GlassPanel } from '../../components/ui';
import { Heart, Shield, Sparkles } from 'lucide-react-native';

type PositivityPledgeNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'PositivityPledge'
>;

interface PositivityPledgeScreenProps {
  navigation: PositivityPledgeNavigationProp;
}

export const PositivityPledgeScreen: React.FC<PositivityPledgeScreenProps> = ({
  navigation,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>The Vybe Pledge</Text>
        <Text style={styles.subtitle}>
          Before you join, we ask everyone to commit to our core values.
        </Text>

        <View style={styles.rulesContainer}>
          <GlassPanel style={styles.ruleCard}>
            <Heart color={colors.primary.light} size={28} />
            <View style={styles.ruleTextContainer}>
              <Text style={styles.ruleTitle}>Good Vibes Only</Text>
              <Text style={styles.ruleDescription}>
                We lift each other up. No hate speech, bullying, or negativity.
              </Text>
            </View>
          </GlassPanel>

          <GlassPanel style={styles.ruleCard}>
            <Sparkles color={colors.status.warning} size={28} />
            <View style={styles.ruleTextContainer}>
              <Text style={styles.ruleTitle}>Authentic Talent</Text>
              <Text style={styles.ruleDescription}>
                Be yourself and share your real skills with the community.
              </Text>
            </View>
          </GlassPanel>

          <GlassPanel style={styles.ruleCard}>
            <Shield color={colors.status.success} size={28} />
            <View style={styles.ruleTextContainer}>
              <Text style={styles.ruleTitle}>Safe Space</Text>
              <Text style={styles.ruleDescription}>
                We actively moderate to keep the community safe for everyone.
              </Text>
            </View>
          </GlassPanel>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <GradientButton
          title="I Accept & Promise"
          onPress={() => navigation.navigate('SignUp')}
        />
        <Text style={styles.footerText}>
          By accepting, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  title: {
    ...typography.weights.bold,
    fontSize: typography.sizes['3xl'],
    color: colors.primary.light,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.weights.regular,
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
    marginBottom: spacing['2xl'],
    lineHeight: 24,
  },
  rulesContainer: {
    gap: spacing.md,
  },
  ruleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    backgroundColor: colors.background.secondary,
  },
  ruleTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  ruleTitle: {
    ...typography.weights.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.inverse,
    marginBottom: spacing.xs,
  },
  ruleDescription: {
    ...typography.weights.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  footerText: {
    ...typography.weights.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
