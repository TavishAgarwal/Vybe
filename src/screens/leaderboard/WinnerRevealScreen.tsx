import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Trophy, Crown } from 'lucide-react-native';
import { colors, spacing, typography } from '../../theme';
import { Avatar, GradientButton } from '../../components/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

// Mock winner data
const WINNER = {
  username: 'SarahDance',
  avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
  challengeName: 'Acoustic Covers',
  votes: 15420,
};

type Props = NativeStackScreenProps<RootStackParamList, 'WinnerReveal'>;

export const WinnerRevealScreen: React.FC<Props> = ({ navigation }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const crownY = useSharedValue(-50);
  const titleOpacity = useSharedValue(0);

  useEffect(() => {
    // Sequence animations
    titleOpacity.value = withTiming(1, { duration: 800 });
    scale.value = withDelay(500, withSpring(1, { damping: 12 }));
    opacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    crownY.value = withDelay(
      1200,
      withSpring(0, { damping: 8, stiffness: 100 }),
    );
  }, [crownY, opacity, scale, titleOpacity]);

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedCrownStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: crownY.value }],
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, animatedTitleStyle]}>
        <Trophy color={colors.primary.base} size={48} />
        <Text style={styles.headerTitle}>Winner Revealed</Text>
        <Text style={styles.challengeName}>#{WINNER.challengeName}</Text>
      </Animated.View>

      <View style={styles.winnerContainer}>
        <Animated.View style={[styles.crownContainer, animatedCrownStyle]}>
          <Crown
            color={colors.status.warning}
            size={48}
            fill={colors.status.warning}
          />
        </Animated.View>

        <Animated.View style={[styles.avatarWrapper, animatedAvatarStyle]}>
          <Avatar url={WINNER.avatarUrl} size="xl" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1st</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.detailsContainer, animatedTitleStyle]}>
          <Text style={styles.username}>@{WINNER.username}</Text>
          <Text style={styles.votesText}>
            {WINNER.votes.toLocaleString()} Votes
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, animatedTitleStyle]}>
        <GradientButton
          title="Congratulate"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />
        <GradientButton
          title="Back to Leaderboard"
          variant="outline"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing['2xl'] * 2,
  },
  headerTitle: {
    ...typography.weights.bold,
    fontSize: typography.sizes['3xl'],
    color: colors.text.inverse,
    marginTop: spacing.md,
  },
  challengeName: {
    ...typography.weights.medium,
    fontSize: typography.sizes.lg,
    color: colors.primary.light,
    marginTop: spacing.xs,
  },
  winnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownContainer: {
    marginBottom: -20,
    zIndex: 10,
  },
  avatarWrapper: {
    padding: 8,
    borderRadius: 100,
    backgroundColor: `${colors.primary.base}30`,
    borderWidth: 2,
    borderColor: colors.primary.base,
  },
  badge: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    backgroundColor: colors.status.warning,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.full,
    borderWidth: 2,
    borderColor: colors.background.default,
  },
  badgeText: {
    ...typography.weights.bold,
    fontSize: typography.sizes.sm,
    color: colors.background.default,
  },
  detailsContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  username: {
    ...typography.weights.bold,
    fontSize: typography.sizes['2xl'],
    color: colors.text.inverse,
  },
  votesText: {
    ...typography.weights.medium,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  button: {
    width: '100%',
  },
});
