import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Flame, Clock, Sparkles } from 'lucide-react-native';
import { colors, spacing, typography } from '../../theme';
import { Pill, SkeletonLoader } from '../../components/ui';
import { useActiveChallenges } from '../../hooks/useActiveChallenges';
import { useAuthStore } from '../../stores/authStore';
import { formatDistanceToNow } from 'date-fns';

/* ────────────────────────────────────────────────────────────────────────── */
/*  Constants                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

const ALL_CATEGORIES = [
  'music',
  'dance',
  'comedy',
  'art',
  'sports',
  'gaming',
  'cooking',
  'fashion',
  'fitness',
  'diy',
  'pets',
  'travel',
];

const CATEGORY_EMOJIS: Record<string, string> = {
  music: '🎵',
  dance: '💃',
  comedy: '😂',
  art: '🎨',
  sports: '⚽',
  gaming: '🎮',
  cooking: '🍳',
  fashion: '👗',
  fitness: '💪',
  diy: '🔨',
  pets: '🐾',
  travel: '✈️',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ────────────────────────────────────────────────────────────────────────── */
/*  Component                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

export const DiscoverScreen = () => {
  const { data: challenges, isLoading } = useActiveChallenges();
  const user = useAuthStore(s => s.user);

  // "all" = show everything, "foryou" = user interests, or a specific category
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const userCats = new Set((user?.categories ?? []).map(c => c.toLowerCase()));

  /* ── Filter challenges ─────────────────────────────────────────────── */
  const filtered = (challenges ?? []).filter(c => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'foryou') return userCats.has(c.category.toLowerCase());
    return c.category.toLowerCase() === activeFilter;
  });

  /* ── Build filter tabs: All → For You → each category ──────────────── */
  const filterTabs: { key: string; label: string }[] = [
    { key: 'all', label: '🌟 All' },
  ];
  if (userCats.size > 0) {
    filterTabs.push({ key: 'foryou', label: '✨ For You' });
  }
  ALL_CATEGORIES.forEach(cat => {
    filterTabs.push({
      key: cat,
      label: `${CATEGORY_EMOJIS[cat] ?? '🌟'} ${capitalize(cat)}`,
    });
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search color={colors.text.secondary} size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search challenges..."
          placeholderTextColor={colors.text.secondary}
        />
      </View>

      {/* Category Filter Chips — horizontal scroll */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterTabs.map(tab => {
            const isActive = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.7}
                onPress={() => setActiveFilter(tab.key)}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Challenge List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Active filter banner */}
        <View style={styles.resultsBanner}>
          <Text style={styles.resultsText}>
            {activeFilter === 'all'
              ? `${filtered.length} active challenges`
              : activeFilter === 'foryou'
                ? `${filtered.length} challenge${filtered.length !== 1 ? 's' : ''} matching your interests`
                : `${filtered.length} ${capitalize(activeFilter)} challenge${filtered.length !== 1 ? 's' : ''}`}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.skeletonContainer}>
            <SkeletonLoader width="100%" height={110} borderRadius={12} />
            <SkeletonLoader width="100%" height={110} borderRadius={12} />
            <SkeletonLoader width="100%" height={110} borderRadius={12} />
          </View>
        ) : filtered.length > 0 ? (
          filtered.map(challenge => {
            const timeRemaining = challenge.endDate
              ? formatDistanceToNow(new Date(challenge.endDate), {
                  addSuffix: false,
                })
              : null;
            const isUserInterest = userCats.has(
              challenge.category.toLowerCase(),
            );
            const emoji =
              CATEGORY_EMOJIS[challenge.category.toLowerCase()] ?? '🌟';

            return (
              <View
                key={challenge.id}
                style={[
                  styles.challengeCard,
                  isUserInterest && styles.challengeCardRelevant,
                ]}
              >
                {isUserInterest && (
                  <View style={styles.relevantBadge}>
                    <Sparkles color={colors.primary.light} size={12} />
                    <Text style={styles.relevantBadgeText}>
                      Matches your interests
                    </Text>
                  </View>
                )}

                <View style={styles.challengeHeader}>
                  <View style={styles.challengeTitleRow}>
                    <Flame color={colors.primary.base} size={20} />
                    <Text style={styles.challengeTitle} numberOfLines={1}>
                      #{challenge.title.replace(/\s+/g, '')}
                    </Text>
                  </View>
                  <Pill
                    label={`${emoji} ${capitalize(challenge.category)}`}
                    variant="primary"
                    size="sm"
                  />
                </View>

                <Text style={styles.challengeDescription} numberOfLines={2}>
                  {challenge.description}
                </Text>

                <View style={styles.challengeMeta}>
                  <View style={styles.metaItem}>
                    <Clock color={colors.text.secondary} size={14} />
                    <Text style={styles.metaText}>
                      {timeRemaining ? `${timeRemaining} left` : 'Ongoing'}
                    </Text>
                  </View>
                  <Pill label="Active" variant="success" size="sm" />
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>
              {activeFilter === 'foryou' ? '🔍' : CATEGORY_EMOJIS[activeFilter] ?? '🌟'}
            </Text>
            <Text style={styles.emptyText}>
              {activeFilter === 'foryou'
                ? 'No challenges match your interests yet'
                : `No active ${capitalize(activeFilter)} challenges`}
            </Text>
            <Text style={styles.emptySubtext}>
              Check back soon — new challenges drop every week!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  Styles                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.weights.bold,
    fontSize: typography.sizes['3xl'],
    color: colors.text.inverse,
  },

  /* Search */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: spacing.radius.full,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.text.primary,
    ...typography.weights.regular,
    fontSize: typography.sizes.md,
  },

  /* Filter chips */
  filterSection: {
    marginBottom: spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.full,
    backgroundColor: colors.background.secondary,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: `${colors.primary.base}25`,
    borderColor: colors.primary.base,
  },
  filterChipText: {
    ...typography.weights.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  filterChipTextActive: {
    color: colors.primary.light,
    ...typography.weights.semiBold,
  },

  /* Content */
  scrollContent: {
    padding: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing['2xl'],
  },
  resultsBanner: {
    marginBottom: spacing.md,
  },
  resultsText: {
    ...typography.weights.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  skeletonContainer: {
    gap: spacing.md,
  },

  /* Challenge cards */
  challengeCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.primary.base}15`,
  },
  challengeCardRelevant: {
    borderColor: `${colors.primary.base}50`,
    backgroundColor: `${colors.primary.base}08`,
  },
  relevantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.sm,
  },
  relevantBadgeText: {
    ...typography.weights.semiBold,
    fontSize: typography.sizes.xs,
    color: colors.primary.light,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  challengeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    marginRight: spacing.sm,
  },
  challengeTitle: {
    ...typography.weights.bold,
    fontSize: typography.sizes.lg,
    color: colors.primary.light,
    flexShrink: 1,
  },
  challengeDescription: {
    ...typography.weights.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  challengeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.weights.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },

  /* Empty state */
  emptyCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.radius.lg,
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.weights.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.weights.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
