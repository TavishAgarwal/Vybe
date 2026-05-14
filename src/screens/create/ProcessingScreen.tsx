import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { CheckCircle, AlertTriangle } from 'lucide-react-native';
import { GradientButton } from '../../components/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useFocusEffect } from '@react-navigation/native';
import { useUpload } from '../../hooks/useUpload';
import { useActiveChallenge } from '../../hooks/useActiveChallenge';

type Props = NativeStackScreenProps<RootStackParamList, 'Processing'>;

export const ProcessingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { videoUri, caption, filterId, musicId } = route.params;
  const [statusText, setStatusText] = useState('Preparing upload...');
  const [isDone, setIsDone] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const hasStarted = useRef(false);

  const { uploadVideo, uploadProgress, isUploading } = useUpload();
  const { data: challenge } = useActiveChallenge();

  // Block back button during upload
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => !isDone && !uploadError;
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [isDone, uploadError]),
  );

  const runUpload = useCallback(async () => {
    setUploadError(null);
    setStatusText('Uploading...');
    setIsDone(false);

    try {
      const challengeId = challenge?.id ?? '';
      if (!challengeId) {
        throw new Error('No active challenge found');
      }

      const entry = await uploadVideo({
        videoUri,
        challengeId,
        caption,
        musicTrack: musicId || undefined,
        filterId: filterId || undefined,
      });

      if (entry) {
        setStatusText('Ready for review');
        setIsDone(true);
      } else {
        throw new Error('Upload failed. Please try again.');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed unexpectedly';
      setUploadError(msg);
      setStatusText('Upload failed');
    }
  }, [challenge?.id, videoUri, caption, musicId, filterId, uploadVideo]);

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      runUpload();
    }
  }, [runUpload]);

  // Update status text based on progress
  useEffect(() => {
    if (isUploading && !uploadError) {
      if (uploadProgress < 0.3) {
        setStatusText('Uploading...');
      } else if (uploadProgress < 0.7) {
        setStatusText('Processing video...');
      } else if (uploadProgress < 1) {
        setStatusText('Submitting for review...');
      }
    }
  }, [uploadProgress, isUploading, uploadError]);

  const handleRetry = () => {
    hasStarted.current = false;
    runUpload();
  };

  const handleGoToFeed = () => {
    navigation.replace('Main', { screen: 'Home' });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Error state
  if (uploadError) {
    return (
      <View style={styles.container}>
        <AlertTriangle color={colors.status.error} size={64} />
        <Text style={styles.statusText}>Upload Failed</Text>
        <Text style={styles.errorDetail}>{uploadError}</Text>
        <GradientButton
          title="Try Again"
          onPress={handleRetry}
          style={styles.actionButton}
        />
        <GradientButton
          title="Go Back"
          variant="outline"
          onPress={handleGoBack}
          style={styles.actionButton}
        />
      </View>
    );
  }

  // Success state
  if (isDone) {
    return (
      <View style={styles.container}>
        <CheckCircle color={colors.status.success} size={64} />
        <Text style={styles.statusText}>Ready for review</Text>
        <Text style={styles.successDetail}>
          Your Vybe has been submitted! It will appear in the feed once approved.
        </Text>
        <GradientButton
          title="View Feed"
          onPress={handleGoToFeed}
          style={styles.actionButton}
        />
      </View>
    );
  }

  // Uploading state
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary.base} />
      <Text style={styles.statusText}>{statusText}</Text>
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${Math.round(uploadProgress * 100)}%` },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {Math.round(uploadProgress * 100)}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  statusText: {
    ...typography.weights.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: colors.border.default,
    borderRadius: spacing.radius.full,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary.base,
  },
  progressText: {
    ...typography.weights.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  errorDetail: {
    ...typography.weights.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  successDetail: {
    ...typography.weights.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  actionButton: {
    width: '100%',
    marginTop: spacing.md,
  },
});
