import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Hash } from 'lucide-react-native';
import { colors, spacing, typography } from '../../theme';
import { GradientButton } from '../../components/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { captionSchema } from '../../utils/validators';
import { useActiveChallenge } from '../../hooks/useActiveChallenge';

type Props = NativeStackScreenProps<RootStackParamList, 'Caption'>;

export const CaptionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { videoUri, filterId, musicId } = route.params;
  const [caption, setCaption] = useState('');
  const [error, setError] = useState<string | null>(null);
  const maxChars = 200;
  const { data: activeChallenge } = useActiveChallenge();
  const challengeTag = activeChallenge?.title?.replace(/\s+/g, '') ?? 'Challenge';

  const handlePost = () => {
    const parsed = captionSchema.safeParse({ text: caption });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Caption is too long');
      return;
    }
    // Navigate to processing screen where the actual FFmpeg work will happen
    navigation.navigate('Processing', {
      videoUri,
      filterId,
      musicId,
      caption: parsed.data.text,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft color={colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Vybe</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Describe your Vybe..."
              placeholderTextColor={colors.text.secondary}
              multiline
              maxLength={maxChars}
              value={caption}
              onChangeText={value => {
                setCaption(value);
                setError(null);
              }}
              autoFocus
            />
            <Text
              style={[
                styles.charCount,
                caption.length >= maxChars && styles.charCountWarning,
              ]}
            >
              {caption.length}/{maxChars}
            </Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.tagSection}>
            <Text style={styles.sectionTitle}>Challenge Tag</Text>
            <View style={styles.tagPill}>
              <Hash color={colors.primary.base} size={16} />
              <Text style={styles.tagText}>{challengeTag}</Text>
            </View>
            <Text style={styles.tagHelper}>
              Tagged for: {activeChallenge?.title ?? 'the current weekly challenge'}.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <GradientButton
            title="Post Vybe"
            onPress={handlePost}
            style={styles.postButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.weights.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  inputContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    minHeight: 120,
    marginBottom: spacing.xl,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    ...typography.weights.regular,
    fontSize: typography.sizes.md,
    textAlignVertical: 'top',
  },
  charCount: {
    ...typography.weights.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'right',
    marginTop: spacing.sm,
  },
  charCountWarning: {
    color: colors.status.error,
  },
  tagSection: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.weights.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary.base}15`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.full,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  tagText: {
    ...typography.weights.bold,
    color: colors.primary.base,
  },
  tagHelper: {
    ...typography.weights.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  postButton: {
    width: '100%',
  },
  errorText: {
    ...typography.weights.medium,
    fontSize: typography.sizes.sm,
    color: colors.status.error,
    marginTop: spacing.sm,
  },
});
