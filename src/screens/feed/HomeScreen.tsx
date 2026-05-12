import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  ViewToken,
  RefreshControl,
  Text,
  Share,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useFeed, useActiveChallenge } from '../../hooks';
import { useFeedStore } from '../../stores/feedStore';
import { FeedItem, CommentSheet } from '../../components';
import { colors, typography } from '../../theme';
import { Pill } from '../../components/ui';

const { height: windowHeight } = Dimensions.get('window');

// We need to account for the bottom tab bar height to ensure videos fit correctly
// In a real app, use useBottomTabBarHeight() from @react-navigation/bottom-tabs
// or just use windowHeight if tabBar is absolutely positioned.
const ITEM_HEIGHT = windowHeight;

export const HomeScreen = () => {
  const { data: challengeData } = useActiveChallenge();
  const challengeId = challengeData?.id || 'challenge-1'; // fallback

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    status,
  } = useFeed(challengeId);

  const entries = useFeedStore(state => state.entries);
  const currentIndex = useFeedStore(state => state.currentIndex);
  const setCurrentIndex = useFeedStore(state => state.setCurrentIndex);
  const vote = useFeedStore(state => state.vote);
  const votedEntryIds = useFeedStore(state => state.votedEntryIds);

  const [activeCommentEntryId, setActiveCommentEntryId] = useState<
    string | null
  >(null);
  const [isScreenFocused, setIsScreenFocused] = useState(true);

  // Pause videos when navigating to other tabs
  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      return () => setIsScreenFocused(false);
    }, []),
  );

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 70,
    }),
    [],
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [setCurrentIndex],
  );

  const handleLike = useCallback((entryId: string) => vote(entryId), [vote]);

  const handleComment = useCallback((entryId: string) => {
    setActiveCommentEntryId(entryId);
  }, []);

  const handleShare = useCallback((entryId: string) => {
    Share.share({ message: `Check out this Vybe entry: ${entryId}` }).catch(
      () => undefined,
    );
  }, []);

  const handleRefresh = useCallback(() => {
    useFeedStore.setState({ nextCursor: undefined, currentIndex: 0 });
    refetch().catch(() => undefined);
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch(() => undefined);
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === 'pending') {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary.base} />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load feed.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Floating Challenge Info */}
      {challengeData && (
        <View style={styles.topBar}>
          <Pill label={`🔥 ${challengeData.title}`} variant="primary" />
        </View>
      )}

      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <FeedItem
              entry={item}
              isActive={
                isScreenFocused &&
                currentIndex === index &&
                !activeCommentEntryId
              }
              isPaused={false}
              hasLiked={votedEntryIds.has(item.id)}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          </View>
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={colors.primary.base}
            colors={[colors.primary.base]}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={Platform.OS === 'android'}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={colors.primary.base} />
            </View>
          ) : null
        }
      />

      <CommentSheet
        entryId={activeCommentEntryId}
        onClose={() => setActiveCommentEntryId(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
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
  topBar: {
    position: 'absolute',
    top: 60, // Account for safe area / notch
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  footerLoader: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
