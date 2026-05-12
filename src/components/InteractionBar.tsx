import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  AlertCircle,
} from 'lucide-react-native';
import { colors, spacing, typography } from '../theme';
import { Avatar } from './ui';
import { Entry } from '../types/models';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import * as Haptics from 'expo-haptics';

interface InteractionBarProps {
  entry: Entry;
  onLike: () => Promise<void> | void;
  onComment: () => void;
  onShare: () => void;
  onReport?: () => void;
  hasLiked?: boolean;
}

export const InteractionBar: React.FC<InteractionBarProps> = ({
  entry,
  onLike,
  onComment,
  onShare,
  onReport,
  hasLiked = false,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Local state for optimistic visual feedback
  const [locallyLikedEntryId, setLocallyLikedEntryId] = useState<string | null>(
    null,
  );
  const hasLocalLike = locallyLikedEntryId === entry.id;
  const isLiked = hasLiked || hasLocalLike;
  const likeCount = entry.voteCount + (!hasLiked && hasLocalLike ? 1 : 0);

  const handleLike = async () => {
    if (isLiked) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
      () => undefined,
    );
    setLocallyLikedEntryId(entry.id);
    try {
      await onLike();
    } catch {
      setLocallyLikedEntryId(null);
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionItem}>
        <Avatar url={entry.user?.avatarUrl} size="md" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionItem} onPress={handleLike}>
        <View style={styles.iconContainer}>
          <Heart
            size={32}
            color={isLiked ? colors.status.error : colors.text.inverse}
            fill={isLiked ? colors.status.error : 'transparent'}
          />
        </View>
        <Text style={styles.actionText}>{formatCount(likeCount)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionItem} onPress={onComment}>
        <View style={styles.iconContainer}>
          <MessageCircle size={32} color={colors.text.inverse} />
        </View>
        <Text style={styles.actionText}>
          {formatCount(entry.commentCount || 0)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionItem}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
            () => undefined,
          );
          onShare();
        }}
      >
        <View style={styles.iconContainer}>
          <Share2 size={32} color={colors.text.inverse} />
        </View>
        <Text style={styles.actionText}>Share</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionItem}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
            () => undefined,
          );
          if (onReport) {
            onReport();
            return;
          }
          navigation.navigate('Report', { entryId: entry.id });
        }}
      >
        <View style={styles.iconContainer}>
          <AlertCircle size={32} color={colors.text.inverse} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionItem}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
            () => undefined,
          );
        }}
      >
        <View style={styles.iconContainer}>
          <MoreHorizontal size={32} color={colors.text.inverse} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.md,
    bottom: 120, // Leave room for bottom nav and video details
    alignItems: 'center',
    gap: spacing.lg,
  },
  actionItem: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.xs,
    shadowColor: colors.background.default,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  actionText: {
    color: colors.text.inverse,
    ...typography.weights.semiBold,
    fontSize: typography.sizes.sm,
    textShadowColor: colors.background.default,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
