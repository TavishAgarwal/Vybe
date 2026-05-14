import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Avatar, GradientButton } from './ui';
import { Comment, User } from '../types/models';
import { X, Shield } from 'lucide-react-native';

/* ─── Toxicity filter ────────────────────────────────────────────────────── *
 *  Client-side AI-like moderation that blocks negative / toxic comments.
 *  Uses keyword matching + sentiment patterns to score each comment 0..1.
 *  Anything below 0.4 is rejected with a user-friendly message.
 * ──────────────────────────────────────────────────────────────────────── */

const TOXIC_WORDS = [
  'hate', 'ugly', 'stupid', 'dumb', 'idiot', 'loser', 'trash', 'suck',
  'terrible', 'worst', 'horrible', 'disgusting', 'pathetic', 'useless',
  'die', 'kill', 'stfu', 'shut up', 'fuck', 'shit', 'damn', 'ass',
  'bitch', 'hell', 'crap', 'moron', 'retard', 'lame', 'boring',
  'waste', 'garbage', 'nasty', 'toxic', 'awful', 'cringe', 'eww',
  'nobody cares', 'go away', 'no one asked', 'not funny', 'try harder',
  'untalented', 'talentless', 'overrated', 'fraud', 'fake',
];

const NEGATIVE_PATTERNS = [
  /you (suck|stink|blow)/i,
  /this is (bad|terrible|awful|trash|garbage)/i,
  /what a (loser|joke|waste)/i,
  /nobody (likes|cares|wants)/i,
  /go (away|home|die)/i,
  /stop (posting|trying|this)/i,
  /delete (this|your account)/i,
  /don'?t (like|want|care)/i,
  /so (bad|ugly|dumb|stupid|cringe)/i,
  /worst .+ ever/i,
  /can'?t even/i,
];

const POSITIVE_BOOSTERS = [
  'love', 'amazing', 'awesome', 'great', 'fire', 'incredible', 'beautiful',
  'talented', 'queen', 'king', 'legend', 'goat', 'inspiring', 'perfect',
  'fantastic', 'brilliant', 'wonderful', 'stunning', 'keep going', 'proud',
  '🔥', '❤️', '💯', '👏', '✨', '🙌', '💪', '🎉', '😍', '💖',
];

function analyzeComment(text: string): { score: number; reason: string } {
  const lower = text.toLowerCase().trim();
  if (!lower) return { score: 0, reason: 'Empty comment' };

  let score = 0.7; // neutral baseline

  // Check toxic keywords
  for (const word of TOXIC_WORDS) {
    if (lower.includes(word)) {
      score -= 0.25;
    }
  }

  // Check negative patterns
  for (const pattern of NEGATIVE_PATTERNS) {
    if (pattern.test(lower)) {
      score -= 0.3;
    }
  }

  // Check positive boosters
  for (const word of POSITIVE_BOOSTERS) {
    if (lower.includes(word)) {
      score += 0.1;
    }
  }

  // ALL CAPS penalty (shouting)
  if (text === text.toUpperCase() && text.length > 5) {
    score -= 0.15;
  }

  // Excessive punctuation penalty
  const excessivePunctuation = (text.match(/[!?]{3,}/g) || []).length;
  if (excessivePunctuation > 0) score -= 0.1;

  const clamped = Math.max(0, Math.min(1, score));

  if (clamped < 0.4) {
    return { score: clamped, reason: 'This comment may be hurtful. Vybe is a positive space — try rephrasing with kindness! 💛' };
  }

  return { score: clamped, reason: '' };
}

/* ─── Demo seed comments (all positive) ──────────────────────────────── */

const mkUser = (id: string, name: string, img: number): User => ({
  id, handle: name, username: name, displayName: name,
  avatarUrl: `https://i.pravatar.cc/100?img=${img}`, bio: '',
  categories: [], vybeScore: 500, vybeCoins: 0, strikeCount: 0,
  pledgeSigned: true, createdAt: '2026-01-01',
  followersCount: 1000, followingCount: 50,
});

const SEED_COMMENTS: Comment[] = [
  { id: 'c1', entryId: '', userId: 'cu1', text: 'This is incredible!! 🔥🔥', positivityScore: 1, isPinned: false, parentId: null, createdAt: '2026-05-14T10:00:00Z', likeCount: 24, user: mkUser('cu1', 'maya_vibes', 9) },
  { id: 'c2', entryId: '', userId: 'cu2', text: 'So talented, keep going! 💪', positivityScore: 1, isPinned: false, parentId: null, createdAt: '2026-05-14T09:45:00Z', likeCount: 18, user: mkUser('cu2', 'alex_creates', 12) },
  { id: 'c3', entryId: '', userId: 'cu3', text: 'Love the energy here ✨', positivityScore: 0.95, isPinned: false, parentId: null, createdAt: '2026-05-14T09:30:00Z', likeCount: 31, user: mkUser('cu3', 'zoe.art', 20) },
  { id: 'c4', entryId: '', userId: 'cu4', text: 'This made my day! 😍', positivityScore: 0.9, isPinned: false, parentId: null, createdAt: '2026-05-14T09:00:00Z', likeCount: 12, user: mkUser('cu4', 'jake_photos', 15) },
  { id: 'c5', entryId: '', userId: 'cu5', text: 'Wow the creativity is next level 🙌', positivityScore: 1, isPinned: false, parentId: null, createdAt: '2026-05-14T08:30:00Z', likeCount: 45, user: mkUser('cu5', 'nina_dance', 25) },
  { id: 'c6', entryId: '', userId: 'cu6', text: 'How do you even do that?! Amazing 🎉', positivityScore: 0.95, isPinned: false, parentId: null, createdAt: '2026-05-14T08:00:00Z', likeCount: 8, user: mkUser('cu6', 'sam_music', 30) },
  { id: 'c7', entryId: '', userId: 'cu7', text: 'Legend status fr fr 👑', positivityScore: 0.85, isPinned: false, parentId: null, createdAt: '2026-05-14T07:30:00Z', likeCount: 22, user: mkUser('cu7', 'emma_style', 27) },
  { id: 'c8', entryId: '', userId: 'cu8', text: 'Putting this on repeat! 🔁💖', positivityScore: 1, isPinned: false, parentId: null, createdAt: '2026-05-14T07:00:00Z', likeCount: 16, user: mkUser('cu8', 'raj_tech', 14) },
];

/* ─── Component ──────────────────────────────────────────────────────── */

interface CommentSheetProps {
  entryId: string | null;
  onClose: () => void;
}

export const CommentSheet: React.FC<CommentSheetProps> = ({
  entryId,
  onClose,
}) => {
  const [inputText, setInputText] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(SEED_COMMENTS);
  const [filterMessage, setFilterMessage] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const isVisible = entryId !== null;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 150,
      }).start();
    } else {
      slideAnim.setValue(0);
    }
  }, [isVisible, slideAnim]);

  const handleClose = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  }, [slideAnim, onClose]);

  const handleSubmit = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;

    // AI toxicity check
    const result = analyzeComment(text);

    if (result.score < 0.4) {
      setFilterMessage(result.reason);
      // Show the rejection briefly, then clear
      setTimeout(() => setFilterMessage(''), 4000);
      return;
    }

    // Comment is positive — add it
    const newComment: Comment = {
      id: `local-${Date.now()}`,
      entryId: entryId || '',
      userId: 'me',
      text,
      positivityScore: result.score,
      isPinned: false,
      parentId: null,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      user: mkUser('me', 'you', 1),
    };

    setLocalComments(prev => [newComment, ...prev]);
    setInputText('');
    setFilterMessage('');
    Keyboard.dismiss();
  }, [inputText, entryId]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const renderComment = useCallback(({ item }: { item: Comment }) => (
    <View style={styles.commentRow}>
      <Avatar url={item.user?.avatarUrl} size="sm" />
      <View style={styles.commentBody}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUser}>@{item.user?.username ?? 'user'}</Text>
          <Text style={styles.commentTime}>{formatTime(item.createdAt)}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
        <Text style={styles.commentLikes}>❤️ {item.likeCount}</Text>
      </View>
    </View>
  ), []);

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        {/* Handle bar */}
        <View style={styles.handleBar}>
          <View style={styles.handle} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Shield color={colors.primary.base} size={18} />
            <Text style={styles.headerTitle}>Comments</Text>
          </View>
          <Text style={styles.commentCount}>{localComments.length}</Text>
          <TouchableOpacity onPress={handleClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <X color={colors.text.secondary} size={22} />
          </TouchableOpacity>
        </View>

        {/* Moderation badge */}
        <View style={styles.moderationBanner}>
          <Text style={styles.moderationText}>🛡️ AI-moderated · Negativity is automatically filtered</Text>
        </View>

        {/* Comments list */}
        <FlatList
          data={localComments}
          keyExtractor={item => item.id}
          renderItem={renderComment}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Filter rejection message */}
        {filterMessage !== '' && (
          <View style={styles.filterBanner}>
            <Text style={styles.filterText}>{filterMessage}</Text>
          </View>
        )}

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={10}
        >
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Add a positive comment..."
              placeholderTextColor={colors.text.secondary}
              value={inputText}
              onChangeText={(t) => { setInputText(t); setFilterMessage(''); }}
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSubmit}
            />
            <GradientButton
              title="Post"
              onPress={handleSubmit}
              disabled={!inputText.trim()}
              style={styles.postBtn}
              textStyle={styles.postBtnText}
            />
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
};

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '65%',
    backgroundColor: colors.background.default,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  handleBar: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.text.secondary,
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  headerTitle: {
    ...typography.weights.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  commentCount: {
    ...typography.weights.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginRight: spacing.md,
  },
  moderationBanner: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    backgroundColor: 'rgba(139,92,246,0.08)',
  },
  moderationText: {
    ...typography.weights.regular,
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 8,
  },
  commentRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  commentBody: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentUser: {
    ...typography.weights.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  commentTime: {
    ...typography.weights.regular,
    fontSize: 11,
    color: colors.text.secondary,
  },
  commentText: {
    ...typography.weights.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    marginTop: 2,
    lineHeight: 20,
  },
  commentLikes: {
    ...typography.weights.regular,
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 4,
  },
  filterBanner: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(239,68,68,0.2)',
  },
  filterText: {
    ...typography.weights.regular,
    fontSize: 13,
    color: '#ef4444',
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    alignItems: 'center',
    backgroundColor: colors.background.default,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.text.primary,
    marginRight: spacing.sm,
    ...typography.weights.regular,
    fontSize: 14,
  },
  postBtn: {
    height: 40,
    paddingHorizontal: spacing.md,
  },
  postBtnText: {
    fontSize: typography.sizes.sm,
  },
});
