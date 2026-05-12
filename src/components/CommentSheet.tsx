import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useComments } from '../hooks';
import { colors, spacing, typography } from '../theme';
import { Avatar, GradientButton, SkeletonLoader } from './ui';
import { Comment } from '../types/models';
import { commentSchema } from '../utils/validators';
import { logger } from '../utils/logger';

interface CommentSheetProps {
  entryId: string | null;
  onClose: () => void;
}

export const CommentSheet: React.FC<CommentSheetProps> = ({
  entryId,
  onClose,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['60%', '90%'], []);
  const [inputText, setInputText] = useState('');

  const { data: comments, isLoading, postComment } = useComments(entryId || '');

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const handleSubmit = async () => {
    const parsed = commentSchema.safeParse({ text: inputText });
    if (!parsed.success || !entryId) {
      return;
    }
    try {
      await postComment.mutateAsync(parsed.data.text);
      setInputText('');
    } catch (e) {
      logger.warn('Error posting comment', e);
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <Avatar url={item.user?.avatarUrl} size="sm" />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{item.user?.username}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={entryId ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.indicator}
    >
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Comments</Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <SkeletonLoader height={60} style={styles.loadingRow} />
            <SkeletonLoader height={60} style={styles.loadingRow} />
            <SkeletonLoader height={60} />
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={item => item.id}
            renderItem={renderComment}
            contentContainerStyle={styles.listContent}
          />
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="Add a positive comment..."
            placeholderTextColor={colors.text.secondary}
            value={inputText}
            onChangeText={setInputText}
            maxLength={500}
          />
          <GradientButton
            title="Post"
            onPress={handleSubmit}
            disabled={!inputText.trim() || postComment.isPending}
            isLoading={postComment.isPending}
            style={styles.postButton}
            textStyle={styles.postButtonText}
          />
        </KeyboardAvoidingView>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.background.default,
  },
  indicator: {
    backgroundColor: colors.text.secondary,
  },
  container: {
    flex: 1,
  },
  headerTitle: {
    ...typography.weights.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    textAlign: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  loadingContainer: {
    padding: spacing.md,
  },
  loadingRow: {
    marginBottom: spacing.sm,
  },
  listContent: {
    padding: spacing.md,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  commentContent: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  commentUsername: {
    ...typography.weights.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    marginBottom: 2,
  },
  commentText: {
    ...typography.weights.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  inputContainer: {
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
    borderRadius: spacing.radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
    marginRight: spacing.sm,
    ...typography.weights.regular,
  },
  postButton: {
    height: 40,
    paddingHorizontal: spacing.md,
  },
  postButtonText: {
    fontSize: typography.sizes.sm,
  },
});
