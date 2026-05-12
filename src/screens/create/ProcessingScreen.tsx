import React, { useCallback, useEffect, useState } from 'react';
import {
  BackHandler,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { CheckCircle } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Processing'>;

export const ProcessingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { videoUri } = route.params;
  const [statusText, setStatusText] = useState('Uploading...');
  const [isDone, setIsDone] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => !isDone;
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [isDone]),
  );

  useEffect(() => {
    const steps = [
      setTimeout(() => {
        setUploadProgress(0.35);
        setStatusText('Processing video...');
      }, 500),
      setTimeout(() => {
        setUploadProgress(0.7);
        setStatusText('Submitting for review...');
      }, 1200),
      setTimeout(() => {
        setUploadProgress(1);
        setStatusText('Ready for review');
        setIsDone(true);
      }, 1800),
      setTimeout(() => {
        navigation.replace('Main', { screen: 'Home' });
      }, 2400),
    ];

    return () => {
      steps.forEach(clearTimeout);
    };
  }, [navigation, videoUri]);

  return (
    <View style={styles.container}>
      {isDone ? (
        <CheckCircle color={colors.status.success} size={64} />
      ) : (
        <ActivityIndicator size="large" color={colors.primary.base} />
      )}
      <Text style={styles.statusText}>{statusText}</Text>
      {!isDone && (
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${uploadProgress * 100}%` },
            ]}
          />
        </View>
      )}
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
    marginBottom: spacing.xl,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: colors.border.default,
    borderRadius: spacing.radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary.base,
  },
});
