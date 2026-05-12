import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLeaderboard } from '../../hooks';
import { LeaderboardCard } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { useAuthStore } from '../../stores/authStore';
import { GradientButton } from '../../components/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import * as Haptics from 'expo-haptics';

export const LeaderboardScreen = () => {
  const { data: leaderboardData, isLoading, isError } = useLeaderboard();
  const { user } = useAuthStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary.base} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load leaderboard.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Top Vybes</Text>
        <Text style={styles.subtitle}>This Week's Challenge</Text>
        <GradientButton
          title="🏆 Reveal Winner (Demo)"
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.navigate('WinnerReveal');
          }}
          style={styles.revealButton}
          size="sm"
        />
      </View>

      <FlatList
        data={leaderboardData}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <LeaderboardCard
            entry={item}
            rank={index + 1}
            isCurrentUser={item.userId === user?.id}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.status.error,
    ...typography.weights.medium,
  },
  header: {
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.weights.bold,
    fontSize: typography.sizes['3xl'],
    color: colors.primary.light,
  },
  subtitle: {
    ...typography.weights.medium,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  revealButton: {
    marginTop: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing['2xl'],
  },
});
