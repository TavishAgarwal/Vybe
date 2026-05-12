import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Entry } from '../types/models';
import { VideoPlayer } from './VideoPlayer';
import { InteractionBar } from './InteractionBar';
import { colors, spacing, typography } from '../theme';

interface FeedItemProps {
  entry: Entry;
  isActive: boolean;
  isPaused: boolean;
  onLike: (entryId: string) => void;
  onComment: (entryId: string) => void;
  onShare: (entryId: string) => void;
  hasLiked?: boolean;
}

export const FeedItem: React.FC<FeedItemProps> = ({
  entry,
  isActive,
  isPaused,
  onLike,
  onComment,
  onShare,
  hasLiked = false,
}) => {
  return (
    <View style={styles.container}>
      <VideoPlayer
        uri={entry.videoUrl}
        isActive={isActive}
        isPaused={isPaused}
      />

      {/* Video Overlay Info */}
      <View style={styles.overlay}>
        <View style={styles.infoContainer}>
          <Text style={styles.username}>@{entry.user?.username}</Text>
          <Text style={styles.caption}>{entry.caption}</Text>
          {entry.musicTrack && (
            <Text style={styles.musicTrack}>🎵 {entry.musicTrack.title}</Text>
          )}
          {entry.status === 'under_review' && (
            <View style={styles.moderationBadge}>
              <Text style={styles.moderationBadgeText}>Under Review</Text>
            </View>
          )}
        </View>

        <InteractionBar
          entry={entry}
          hasLiked={hasLiked}
          onLike={() => onLike(entry.id)}
          onComment={() => onComment(entry.id)}
          onShare={() => onShare(entry.id)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: spacing.md,
    paddingBottom: 90, // Leave room for bottom tab bar
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 60, // Leave room for InteractionBar
  },
  username: {
    color: colors.text.inverse,
    ...typography.weights.bold,
    fontSize: typography.sizes.md,
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  caption: {
    color: colors.text.inverse,
    ...typography.weights.regular,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  musicTrack: {
    color: colors.text.inverse,
    ...typography.weights.medium,
    fontSize: typography.sizes.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  moderationBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.radius.sm,
    borderWidth: 1,
    borderColor: colors.status.warning,
    marginTop: spacing.xs,
  },
  moderationBadgeText: {
    color: colors.status.warning,
    ...typography.weights.medium,
    fontSize: typography.sizes.xs,
  },
});
