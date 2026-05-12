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
  onLike: () => void;
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
  const [isLiked, setIsLiked] = useState(hasLiked);
  const [likeCount, setLikeCount] = useState(entry.voteCount);

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      onLike();
    } else {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
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
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  actionText: {
    color: colors.text.inverse,
    ...typography.weights.semiBold,
    fontSize: typography.sizes.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
