import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLeaderboard } from '../../hooks';
import { colors, spacing, typography } from '../../theme';
import { useAuthStore } from '../../stores/authStore';
import { GradientButton, Pill } from '../../components/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Entry } from '../../types/models';
import * as Haptics from 'expo-haptics';
import { Trophy, Medal, Crown, TrendingUp, Flame } from 'lucide-react-native';

/* ────────────────────────────────────────────────────────────────────────── */
/*  Demo leaderboard data                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

const DEMO_LEADERBOARD: Entry[] = [
  { id: 'lb1', challengeId: 'c1', userId: 'u6', videoUrl: '', thumbnailUrl: '', caption: 'When your mom catches you…', duration: 30, voteCount: 4823, reactionCounts: { fire: 320, heart: 510, party: 120, clap: 280, sparkle: 190, love: 430 }, status: 'live', moderationScore: 0.98, rejectionReason: null, createdAt: '2026-05-10', rank: 1, user: { id: 'u6', handle: 'joker_pete', username: 'joker_pete', displayName: 'Pete Lawson', avatarUrl: 'https://i.pravatar.cc/150?img=11', bio: 'Stand-up comedian 😂', categories: ['comedy'], vybeScore: 3200, vybeCoins: 1200, strikeCount: 0, pledgeSigned: true, createdAt: '2026-01-02', followersCount: 45100, followingCount: 520 } },
  { id: 'lb2', challengeId: 'c1', userId: 'u2', videoUrl: '', thumbnailUrl: '', caption: 'DJ Set remix 🎧', duration: 45, voteCount: 3951, reactionCounts: { fire: 280, heart: 420, party: 200, clap: 190, sparkle: 150, love: 380 }, status: 'live', moderationScore: 0.96, rejectionReason: null, createdAt: '2026-05-09', rank: 2, user: { id: 'u2', handle: 'dj_marcus', username: 'dj_marcus', displayName: 'Marcus Rivera', avatarUrl: 'https://i.pravatar.cc/150?img=3', bio: 'DJ & producer 🎧', categories: ['music', 'dance'], vybeScore: 2100, vybeCoins: 800, strikeCount: 0, pledgeSigned: true, createdAt: '2026-01-05', followersCount: 28700, followingCount: 445 } },
  { id: 'lb3', challengeId: 'c1', userId: 'u4', videoUrl: '', thumbnailUrl: '', caption: 'New choreo 💃', duration: 25, voteCount: 3247, reactionCounts: { fire: 240, heart: 380, party: 150, clap: 210, sparkle: 130, love: 350 }, status: 'live', moderationScore: 0.97, rejectionReason: null, createdAt: '2026-05-11', rank: 3, user: { id: 'u4', handle: 'alex.moves', username: 'alex.moves', displayName: 'Alex Kim', avatarUrl: 'https://i.pravatar.cc/150?img=7', bio: 'Choreographer 💃', categories: ['dance'], vybeScore: 1780, vybeCoins: 600, strikeCount: 0, pledgeSigned: true, createdAt: '2026-01-20', followersCount: 19200, followingCount: 280 } },
  { id: 'lb4', challengeId: 'c1', userId: 'u9', videoUrl: '', thumbnailUrl: '', caption: 'Clutch 1v5 ace 🎮', duration: 20, voteCount: 2876, reactionCounts: { fire: 200, heart: 300, party: 180, clap: 150, sparkle: 110, love: 290 }, status: 'live', moderationScore: 0.95, rejectionReason: null, createdAt: '2026-05-08', rank: 4, user: { id: 'u9', handle: 'gamer_zoe', username: 'gamer_zoe', displayName: 'Zoe Wang', avatarUrl: 'https://i.pravatar.cc/150?img=20', bio: 'Pro gamer 🎮', categories: ['gaming'], vybeScore: 1450, vybeCoins: 550, strikeCount: 0, pledgeSigned: true, createdAt: '2026-01-25', followersCount: 22800, followingCount: 390 } },
  { id: 'lb5', challengeId: 'c1', userId: 'u1', videoUrl: '', thumbnailUrl: '', caption: 'Acoustic Blinding Lights 🎵', duration: 35, voteCount: 2534, reactionCounts: { fire: 180, heart: 350, party: 90, clap: 160, sparkle: 120, love: 310 }, status: 'live', moderationScore: 0.99, rejectionReason: null, createdAt: '2026-05-10', rank: 5, user: { id: 'u1', handle: 'sarah_vibes', username: 'sarah_vibes', displayName: 'Sarah Chen', avatarUrl: 'https://i.pravatar.cc/150?img=1', bio: 'Singer & songwriter 🎵', categories: ['music'], vybeScore: 1250, vybeCoins: 500, strikeCount: 0, pledgeSigned: true, createdAt: '2026-01-01', followersCount: 12400, followingCount: 320 } },
  { id: 'lb6', challengeId: 'c1', userId: 'u7', videoUrl: '', thumbnailUrl: '', caption: 'Morning HIIT routine 💪', duration: 40, voteCount: 2190, reactionCounts: { fire: 160, heart: 280, party: 70, clap: 200, sparkle: 90, love: 250 }, status: 'live', moderationScore: 0.94, rejectionReason: null, createdAt: '2026-05-11', rank: 6, user: { id: 'u7', handle: 'fit_nina', username: 'fit_nina', displayName: 'Nina Torres', avatarUrl: 'https://i.pravatar.cc/150?img=16', bio: 'Fitness coach 💪', categories: ['fitness'], vybeScore: 920, vybeCoins: 380, strikeCount: 0, pledgeSigned: true, createdAt: '2026-02-15', followersCount: 11300, followingCount: 210 } },
  { id: 'lb7', challengeId: 'c1', userId: 'u3', videoUrl: '', thumbnailUrl: '', caption: 'Speed paint portrait 🎨', duration: 55, voteCount: 1845, reactionCounts: { fire: 140, heart: 260, party: 60, clap: 180, sparkle: 100, love: 230 }, status: 'live', moderationScore: 0.97, rejectionReason: null, createdAt: '2026-05-09', rank: 7, user: { id: 'u3', handle: 'luna_art', username: 'luna_art', displayName: 'Luna Park', avatarUrl: 'https://i.pravatar.cc/150?img=5', bio: 'Digital artist 🎨', categories: ['art'], vybeScore: 890, vybeCoins: 320, strikeCount: 0, pledgeSigned: true, createdAt: '2026-02-10', followersCount: 8900, followingCount: 190 } },
  { id: 'lb8', challengeId: 'c1', userId: 'u10', videoUrl: '', thumbnailUrl: '', caption: 'Thrift flip $5 jacket 👗', duration: 28, voteCount: 1623, reactionCounts: { fire: 120, heart: 240, party: 50, clap: 140, sparkle: 80, love: 210 }, status: 'live', moderationScore: 0.96, rejectionReason: null, createdAt: '2026-05-10', rank: 8, user: { id: 'u10', handle: 'style_emma', username: 'style_emma', displayName: 'Emma Brooks', avatarUrl: 'https://i.pravatar.cc/150?img=24', bio: 'Fashion stylist 👗', categories: ['fashion'], vybeScore: 780, vybeCoins: 310, strikeCount: 0, pledgeSigned: true, createdAt: '2026-02-20', followersCount: 9800, followingCount: 270 } },
  { id: 'lb9', challengeId: 'c1', userId: 'u12', videoUrl: '', thumbnailUrl: '', caption: 'Golden retriever door trick 🐾', duration: 18, voteCount: 1389, reactionCounts: { fire: 100, heart: 350, party: 40, clap: 90, sparkle: 70, love: 400 }, status: 'live', moderationScore: 0.99, rejectionReason: null, createdAt: '2026-05-11', rank: 9, user: { id: 'u12', handle: 'petlover_lily', username: 'petlover_lily', displayName: 'Lily Adams', avatarUrl: 'https://i.pravatar.cc/150?img=26', bio: 'Dog trainer 🐾', categories: ['pets'], vybeScore: 620, vybeCoins: 240, strikeCount: 0, pledgeSigned: true, createdAt: '2026-02-28', followersCount: 6700, followingCount: 180 } },
  { id: 'lb10', challengeId: 'c1', userId: 'u5', videoUrl: '', thumbnailUrl: '', caption: 'Garlic butter shrimp 🍳', duration: 30, voteCount: 1102, reactionCounts: { fire: 90, heart: 200, party: 80, clap: 120, sparkle: 60, love: 180 }, status: 'live', moderationScore: 0.93, rejectionReason: null, createdAt: '2026-05-08', rank: 10, user: { id: 'u5', handle: 'chef_maya', username: 'chef_maya', displayName: 'Maya Singh', avatarUrl: 'https://i.pravatar.cc/150?img=9', bio: 'Home chef 🍳', categories: ['cooking'], vybeScore: 650, vybeCoins: 250, strikeCount: 0, pledgeSigned: true, createdAt: '2026-03-01', followersCount: 5400, followingCount: 150 } },
  { id: 'lb11', challengeId: 'c1', userId: 'u8', videoUrl: '', thumbnailUrl: '', caption: 'Hidden gem in Tokyo ✈️', duration: 42, voteCount: 987, reactionCounts: { fire: 80, heart: 180, party: 30, clap: 100, sparkle: 50, love: 160 }, status: 'live', moderationScore: 0.95, rejectionReason: null, createdAt: '2026-05-09', rank: 11, user: { id: 'u8', handle: 'travel_jay', username: 'travel_jay', displayName: 'Jay Patel', avatarUrl: 'https://i.pravatar.cc/150?img=12', bio: 'World traveler ✈️', categories: ['travel'], vybeScore: 540, vybeCoins: 200, strikeCount: 0, pledgeSigned: true, createdAt: '2026-03-10', followersCount: 7600, followingCount: 340 } },
  { id: 'lb12', challengeId: 'c1', userId: 'u11', videoUrl: '', thumbnailUrl: '', caption: 'Pallet wood shelf 🔨', duration: 50, voteCount: 756, reactionCounts: { fire: 60, heart: 140, party: 20, clap: 130, sparkle: 40, love: 120 }, status: 'live', moderationScore: 0.92, rejectionReason: null, createdAt: '2026-05-10', rank: 12, user: { id: 'u11', handle: 'diy_mike', username: 'diy_mike', displayName: 'Mike Johnson', avatarUrl: 'https://i.pravatar.cc/150?img=33', bio: 'Builder & maker 🔨', categories: ['diy'], vybeScore: 430, vybeCoins: 180, strikeCount: 0, pledgeSigned: true, createdAt: '2026-03-05', followersCount: 4200, followingCount: 120 } },
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  Component                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze
const RANK_ICONS = [Crown, Trophy, Medal];

export const LeaderboardScreen = () => {
  const { data: dbData, isLoading } = useLeaderboard();
  const { user } = useAuthStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Use DB data if available, otherwise demo data
  const leaderboardData = useMemo((): Entry[] => {
    const arr = (dbData ?? []) as Entry[];
    if (arr.length > 0) return arr;
    return DEMO_LEADERBOARD;
  }, [dbData]);

  if (isLoading && leaderboardData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary.base} />
      </View>
    );
  }

  const totalVotes = leaderboardData.reduce((sum, e) => sum + e.voteCount, 0);

  const renderTopThree = () => {
    const top3 = leaderboardData.slice(0, 3);
    // Reorder: 2nd, 1st, 3rd for podium layout
    const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
    const podiumHeights = [100, 140, 80];

    return (
      <View style={styles.podiumContainer}>
        {podiumOrder.map((entry, i) => {
          const realRank = i === 0 ? 2 : i === 1 ? 1 : 3;
          const IconComponent = RANK_ICONS[realRank - 1] ?? Trophy;
          const rankColor = RANK_COLORS[realRank - 1] ?? colors.text.secondary;

          return (
            <View key={entry.id} style={styles.podiumItem}>
              <View style={[styles.avatarRing, { borderColor: rankColor }]}>
                <Image
                  source={{ uri: entry.user?.avatarUrl }}
                  style={styles.podiumAvatar}
                />
                <View style={[styles.rankBadge, { backgroundColor: rankColor }]}>
                  <Text style={styles.rankBadgeText}>{realRank}</Text>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>
                {entry.user?.displayName}
              </Text>
              <View style={styles.podiumVotes}>
                <Flame color={rankColor} size={14} />
                <Text style={[styles.podiumVoteText, { color: rankColor }]}>
                  {entry.voteCount.toLocaleString()}
                </Text>
              </View>
              <View style={[styles.podiumBar, { height: podiumHeights[i], backgroundColor: `${rankColor}30`, borderColor: rankColor }]}>
                <IconComponent color={rankColor} size={20} />
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderRankItem = ({ item, index }: { item: Entry; index: number }) => {
    const rank = index + 1;
    if (rank <= 3) return null; // Top 3 rendered in podium
    const isMe = item.userId === user?.id;

    return (
      <View style={[styles.rankRow, isMe && styles.rankRowMe]}>
        <Text style={styles.rankNumber}>{rank}</Text>
        <Image
          source={{ uri: item.user?.avatarUrl }}
          style={styles.rankAvatar}
        />
        <View style={styles.rankInfo}>
          <View style={styles.rankNameRow}>
            <Text style={styles.rankName} numberOfLines={1}>
              {item.user?.displayName}
            </Text>
            {isMe && <Pill label="You" size="sm" variant="primary" />}
          </View>
          <Text style={styles.rankHandle}>@{item.user?.username}</Text>
        </View>
        <View style={styles.rankVotes}>
          <Text style={styles.rankVoteCount}>
            {item.voteCount.toLocaleString()}
          </Text>
          <Text style={styles.rankVoteLabel}>votes</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={leaderboardData}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>🏆 Leaderboard</Text>
              <Text style={styles.subtitle}>This Week's Challenge</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{leaderboardData.length}</Text>
                  <Text style={styles.statLabel}>Entries</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{totalVotes.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Total Votes</Text>
                </View>
              </View>
              <GradientButton
                title="🏆 Reveal Winner"
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  navigation.navigate('WinnerReveal');
                }}
                style={styles.revealButton}
                size="sm"
              />
            </View>

            {/* Podium */}
            {leaderboardData.length >= 3 && renderTopThree()}

            {/* Rankings header */}
            <View style={styles.rankingsHeader}>
              <TrendingUp color={colors.primary.base} size={18} />
              <Text style={styles.rankingsTitle}>Full Rankings</Text>
            </View>
          </>
        }
        renderItem={renderRankItem}
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
  listContent: {
    paddingBottom: spacing['2xl'],
  },
  header: {
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.weights.bold,
    fontSize: typography.sizes['3xl'],
    color: colors.text.inverse,
  },
  subtitle: {
    ...typography.weights.medium,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.radius.lg,
    padding: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.weights.bold,
    fontSize: typography.sizes.xl,
    color: colors.primary.light,
  },
  statLabel: {
    ...typography.weights.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border.default,
  },
  revealButton: {
    marginTop: spacing.md,
  },

  /* Podium */
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
  },
  avatarRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  podiumAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.secondary,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: {
    ...typography.weights.bold,
    fontSize: 12,
    color: '#000',
  },
  podiumName: {
    ...typography.weights.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    textAlign: 'center',
    maxWidth: 90,
  },
  podiumVotes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  podiumVoteText: {
    ...typography.weights.bold,
    fontSize: typography.sizes.xs,
  },
  podiumBar: {
    width: '100%',
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Rankings */
  rankingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  rankingsTitle: {
    ...typography.weights.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.radius.lg,
  },
  rankRowMe: {
    borderColor: colors.primary.base,
    borderWidth: 1,
    backgroundColor: `${colors.primary.base}10`,
  },
  rankNumber: {
    ...typography.weights.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
    width: 30,
    textAlign: 'center',
  },
  rankAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: spacing.sm,
    backgroundColor: colors.background.secondary,
  },
  rankInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  rankNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rankName: {
    ...typography.weights.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    flexShrink: 1,
  },
  rankHandle: {
    ...typography.weights.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: 1,
  },
  rankVotes: {
    alignItems: 'flex-end',
  },
  rankVoteCount: {
    ...typography.weights.bold,
    fontSize: typography.sizes.md,
    color: colors.primary.light,
  },
  rankVoteLabel: {
    ...typography.weights.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
});
