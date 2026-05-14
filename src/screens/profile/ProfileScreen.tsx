import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut } from 'lucide-react-native';
import { colors, spacing, typography } from '../../theme';
import { Avatar, GradientButton, Pill, SkeletonLoader } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { useSensitiveScreenBlur } from '../../hooks/useSensitiveScreenBlur';
import { useProfileStats } from '../../hooks/useProfileStats';

const formatCount = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
};

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const shouldBlur = useSensitiveScreenBlur();
  const { data: stats, isLoading: statsLoading } = useProfileStats(user?.id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>@{user?.username || 'user'}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <LogOut color={colors.text.primary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileInfo}>
          <Avatar url={user?.avatarUrl} size="xl" />
          <Text style={styles.displayName}>
            {user?.displayName || user?.username}
          </Text>
          {user?.bio ? (
            <Text style={styles.bioText}>{user.bio}</Text>
          ) : null}
          <Pill
            label={`Vybe Score: ${user?.vybeScore || 0}`}
            variant="primary"
            style={styles.scorePill}
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            {statsLoading ? (
              <SkeletonLoader width={40} height={24} />
            ) : (
              <Text style={styles.statValue}>{stats?.entries ?? 0}</Text>
            )}
            <Text style={styles.statLabel}>Entries</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            {statsLoading ? (
              <SkeletonLoader width={40} height={24} />
            ) : (
              <Text style={styles.statValue}>{formatCount(stats?.totalVotes ?? 0)}</Text>
            )}
            <Text style={styles.statLabel}>Votes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            {statsLoading ? (
              <SkeletonLoader width={40} height={24} />
            ) : (
              <Text style={styles.statValue}>{stats?.wins ?? 0}</Text>
            )}
            <Text style={styles.statLabel}>Wins</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <GradientButton
            title="Edit Profile"
            variant="outline"
            style={styles.editButton}
            textStyle={styles.editButtonText}
          />
        </View>

        <View style={styles.gridContainer}>
          <Text style={styles.gridTitle}>Recent Entries</Text>
          <View style={styles.emptyGrid}>
            <Text style={styles.emptyText}>No entries yet.</Text>
          </View>
        </View>
      </ScrollView>
      {shouldBlur ? <View style={styles.privacyOverlay} /> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  username: {
    ...typography.weights.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
  },
  logoutButton: {
    padding: spacing.sm,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  displayName: {
    ...typography.weights.bold,
    fontSize: typography.sizes['2xl'],
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  bioText: {
    ...typography.weights.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 22,
  },
  scorePill: {
    marginTop: spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing['2xl'],
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...typography.weights.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.weights.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.default,
    height: 30,
    alignSelf: 'center',
  },
  actionsContainer: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  editButton: {
    height: 44,
  },
  editButtonText: {
    fontSize: typography.sizes.md,
  },
  gridContainer: {
    marginTop: spacing['2xl'],
  },
  gridTitle: {
    ...typography.weights.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  emptyGrid: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.xl,
    borderRadius: spacing.radius.lg,
  },
  emptyText: {
    ...typography.weights.medium,
    color: colors.text.secondary,
  },
  privacyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.default,
  },
});
