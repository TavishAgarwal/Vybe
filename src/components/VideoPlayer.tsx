import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Play } from 'lucide-react-native';
import { colors } from '../theme';

interface VideoPlayerProps {
  uri: string;
  isPaused: boolean;
  isActive: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  isPaused,
  isActive,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri }}
        style={styles.video}
        resizeMode="cover"
      />
      {/* Play indicator when paused or not active */}
      {(isPaused || !isActive) && (
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Play color={colors.text.inverse} size={36} fill={colors.text.inverse} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.default,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
