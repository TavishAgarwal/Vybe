import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { colors, spacing, typography } from '../../theme';
import { useFeedStore } from '../../stores/feedStore';
import { useUpload } from '../../hooks/useUpload';
import { CheckCircle } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Processing'>;

export const ProcessingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { videoUri, filterId, musicId, caption } = route.params;
  const [statusText, setStatusText] = useState('Applying Filters...');
  const [isDone, setIsDone] = useState(false);
  const { loadFeed } = useFeedStore();
  const { uploadVideo, uploadProgress } = useUpload();

  useEffect(() => {
    const processVideo = async () => {
      setStatusText('Preparing to process...');
      try {
        let filterStr = '';
        if (filterId === 'warm') {
          filterStr = 'colorbalance=rs=.3';
        }
        if (filterId === 'cool') {
          filterStr = 'colorbalance=bs=.3';
        }
        if (filterId === 'vintage') {
          filterStr = 'curves=preset=vintage';
        }
        if (filterId === 'bw') {
          filterStr = 'hue=s=0';
        }

        const outputPath = `${FileSystem.cacheDirectory}output_${Date.now()}.mp4`;
        let command = `-i ${videoUri}`;
        if (filterStr) {
          command += ` -vf ${filterStr}`;
        }
        command += ` -c:a copy -y ${outputPath}`;

        setStatusText('Applying Effects...');

        await FFmpegKit.executeAsync(
          command,
          async session => {
            const returnCode = await session.getReturnCode();
            if (ReturnCode.isSuccess(returnCode)) {
              setStatusText('Uploading to Vybe...');
              const result = await uploadVideo({
                videoUri: outputPath,
                challengeId: '1',
                caption: caption || 'My Vybe Entry!',
                filterId,
                musicTrack: musicId || 'Original Audio',
              });
              if (result) {
                setIsDone(true);
                setStatusText('Vybe Posted!');
                await loadFeed('1');
                setTimeout(() => {
                  navigation.navigate('Main', { screen: 'Home' });
                }, 1500);
              } else {
                setStatusText('Upload Failed!');
              }
            } else {
              setStatusText('Processing Failed!');
            }
          },
          () => {
            /* Track FFmpeg progress */
          },
        );
      } catch {
        setStatusText('Error applying filters');
      }
    };
    processVideo();
  }, []);

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
