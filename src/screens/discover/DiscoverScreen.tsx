import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { colors, spacing, typography } from '../../theme';
import { Pill } from '../../components/ui';

const CATEGORIES = [
  'Music',
  'Dance',
  'Comedy',
  'Art',
  'Sports',
  'Gaming',
  'Cooking',
  'Fashion',
];

export const DiscoverScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search color={colors.text.secondary} size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search creators, challenges, or tags..."
          placeholderTextColor={colors.text.secondary}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Trending Categories</Text>
        <View style={styles.categoriesContainer}>
          {CATEGORIES.map(category => (
            <Pill
              key={category}
              label={category}
              variant="primary"
              style={styles.categoryPill}
            />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>
          Active Challenges
        </Text>
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>#AcousticCovers</Text>
          <Text style={styles.placeholderSubtext}>2.4k entries this week</Text>
        </View>
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>#StreetDanceShowdown</Text>
          <Text style={styles.placeholderSubtext}>1.8k entries this week</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    padding: spacing.xl,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.weights.bold,
    fontSize: typography.sizes['3xl'],
    color: colors.text.inverse,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    borderRadius: spacing.radius.full,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.text.primary,
    ...typography.weights.regular,
    fontSize: typography.sizes.md,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingTop: 0,
  },
  sectionTitle: {
    ...typography.weights.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryPill: {
    marginBottom: spacing.xs,
  },
  placeholderCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  placeholderText: {
    ...typography.weights.bold,
    fontSize: typography.sizes.md,
    color: colors.primary.light,
    marginBottom: spacing.xs,
  },
  placeholderSubtext: {
    ...typography.weights.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
});
