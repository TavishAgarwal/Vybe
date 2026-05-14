import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';
import { colors, spacing, typography } from '../../theme';
import { GradientButton } from '../../components/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { supabase } from '../../api/supabase';
import { useAuthStore } from '../../stores/authStore';
import { logger } from '../../utils/logger';

const REPORT_REASONS = [
  'Inappropriate Content',
  'Harassment or Bullying',
  'Spam or Scam',
  'Hate Speech',
  'Self-Harm',
  'Other',
];

type Props = NativeStackScreenProps<RootStackParamList, 'Report'>;

export const ReportScreen: React.FC<Props> = ({ route, navigation }) => {
  const { entryId, commentId } = route.params || {};
  const reportTargetId = commentId || entryId;
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const handleSubmit = async () => {
    if (!selectedReason || !reportTargetId) {
      return;
    }

    if (!user?.id) {
      setError('You must be logged in to submit a report.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('reports').insert({
        entry_id: entryId || null,
        comment_id: commentId || null,
        reporter_id: user.id,
        reason: selectedReason,
        details: details || null,
      });

      if (insertError) {
        throw insertError;
      }

      navigation.goBack();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to submit report';
      logger.warn('Report submission failed', e);
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
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
        <Text style={styles.headerTitle}>
          Report {commentId ? 'Comment' : 'Vybe'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.warningBox}>
            <AlertTriangle color={colors.status.warning} size={24} />
            <Text style={styles.warningText}>
              Your report is anonymous. We will review this content against our
              Positivity Guidelines.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Why are you reporting this?</Text>

          <View style={styles.reasonsContainer}>
            {REPORT_REASONS.map(reason => (
              <TouchableOpacity
                key={reason}
                style={[
                  styles.reasonItem,
                  selectedReason === reason && styles.reasonItemSelected,
                ]}
                onPress={() => setSelectedReason(reason)}
              >
                <View style={styles.radioOuter}>
                  {selectedReason === reason && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, styles.detailsTitle]}>
            Additional Details (Optional)
          </Text>
          <TextInput
            style={styles.detailsInput}
            placeholder="Help us understand the issue..."
            placeholderTextColor={colors.text.secondary}
            multiline
            value={details}
            onChangeText={setDetails}
          />
        </ScrollView>

        <View style={styles.footer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <GradientButton
            title="Submit Report"
            onPress={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            isLoading={isSubmitting}
            style={styles.submitButton}
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
  warningBox: {
    flexDirection: 'row',
    backgroundColor: `${colors.status.warning}15`,
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    marginBottom: spacing.xl,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    ...typography.weights.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  sectionTitle: {
    ...typography.weights.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  detailsTitle: {
    marginTop: spacing.xl,
  },
  reasonsContainer: {
    gap: spacing.sm,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    borderColor: colors.background.secondary,
    gap: spacing.md,
  },
  reasonItemSelected: {
    borderColor: colors.primary.base,
    backgroundColor: `${colors.primary.base}10`,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.text.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary.base,
  },
  reasonText: {
    ...typography.weights.medium,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  detailsInput: {
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    minHeight: 100,
    color: colors.text.primary,
    ...typography.weights.regular,
    fontSize: typography.sizes.md,
    textAlignVertical: 'top',
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  submitButton: {
    width: '100%',
  },
  errorText: {
    ...typography.weights.medium,
    color: colors.status.error,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
});
