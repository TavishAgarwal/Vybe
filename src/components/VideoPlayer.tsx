import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { colors } from '../theme';

interface VideoPlayerProps {
  uri: string;
  isPaused: boolean;
  isActive: boolean; // Is it the currently visible item in the feed?
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  isPaused,
  isActive,
}) => {
  const videoRef = useRef<VideoRef>(null);

  useEffect(() => {
    if (!isActive && videoRef.current) {
      videoRef.current.seek(0);
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        resizeMode="cover"
        repeat={true}
        paused={isPaused || !isActive}
        muted={!isActive}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
      />
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
});
