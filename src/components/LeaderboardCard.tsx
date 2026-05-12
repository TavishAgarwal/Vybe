import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { Entry } from '../types/models';
import { Avatar, Pill } from './ui';
import { colors, spacing, typography } from '../theme';

interface LeaderboardCardProps {
  entry: Entry;
  rank: number;
  isCurrentUser?: boolean;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  entry,
  rank,
  isCurrentUser = false,
}) => {
  const isTopThree = rank <= 3;

  const getRankColor = () => {
    switch (rank) {
      case 1:
        return colors.primary.base;
      case 2:
        return colors.text.secondary;
      case 3:
        return colors.accent.base;
      default:
        return colors.text.secondary;
    }
  };

  return (
    <View
      style={[styles.container, isCurrentUser && styles.currentUserContainer]}
    >
      <View style={styles.rankContainer}>
        {isTopThree ? (
          <Trophy size={24} color={getRankColor()} />
        ) : (
          <Text style={styles.rankText}>{rank}</Text>
        )}
      </View>

      <Avatar url={entry.user?.avatarUrl} size="md" />

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.username} numberOfLines={1}>
            {entry.user?.displayName || entry.user?.username}
          </Text>
          {isCurrentUser && (
            <Pill
              label="You"
              size="sm"
              variant="primary"
              style={styles.youPill}
            />
          )}
        </View>
        <Text style={styles.scoreText}>
          {entry.voteCount.toLocaleString()} votes
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.radius.xl,
    marginBottom: spacing.sm,
  },
  currentUserContainer: {
    backgroundColor: colors.background.elevated,
    borderColor: colors.primary.base,
    borderWidth: 1,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  rankText: {
    ...typography.weights.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  username: {
    ...typography.weights.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    flexShrink: 1,
  },
  youPill: {
    marginLeft: spacing.sm,
  },
  scoreText: {
    ...typography.weights.medium,
    fontSize: typography.sizes.sm,
    color: colors.primary.base,
  },
});
