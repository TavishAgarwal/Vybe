import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors, typography } from '../../theme';

interface AvatarProps {
  url?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnlineIndicator?: boolean;
  style?: ViewStyle;
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

export const Avatar: React.FC<AvatarProps> = ({
  url,
  size = 'md',
  showOnlineIndicator = false,
  style,
}) => {
  const dimension = sizeMap[size];

  return (
    <View
      style={[styles.container, { width: dimension, height: dimension }, style]}
    >
      {url ? (
        <Image
          style={[styles.image, { width: dimension, height: dimension }]}
          source={{ uri: url }}
          contentFit="cover"
          placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
          accessibilityLabel="User avatar"
        />
      ) : (
        <View
          style={[styles.placeholder, { width: dimension, height: dimension }]}
        >
          <Text
            style={[styles.placeholderText, { fontSize: dimension * 0.4 }]}
            accessibilityElementsHidden
          >
            ?
          </Text>
        </View>
      )}

      {showOnlineIndicator && (
        <View
          style={[
            styles.indicator,
            {
              width: dimension * 0.25,
              height: dimension * 0.25,
              borderRadius: (dimension * 0.25) / 2,
              right: 0,
              bottom: 0,
              borderWidth: Math.max(2, dimension * 0.05),
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    borderRadius: 999,
    backgroundColor: colors.background.tertiary,
  },
  placeholder: {
    borderRadius: 999,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.text.secondary,
    ...typography.weights.medium,
  },
  indicator: {
    position: 'absolute',
    backgroundColor: colors.status.success,
    borderColor: colors.background.default,
  },
});
