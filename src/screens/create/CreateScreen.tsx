import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../theme';
import { Video, FlipHorizontal, ImageIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import * as ImagePicker from 'expo-image-picker';

export const CreateScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [lastThumbnail, setLastThumbnail] = useState<string | null>(null);

  const handleClose = () => {
    navigation.navigate('Main', { screen: 'Home' });
  };

  const handleRecord = () => {
    // Demo mode: navigate with a reliable sample video.
    navigation.navigate('Effects', {
      videoUri:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    });
  };

  const handleGalleryPick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload videos.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        quality: 1,
        videoMaxDuration: 60,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        // Save thumbnail for the gallery button
        if (asset.uri) {
          setLastThumbnail(asset.uri);
          navigation.navigate('Effects', {
            videoUri: asset.uri,
          });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open gallery. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera placeholder */}
      <View style={styles.cameraPlaceholder}>
        <Video color={colors.primary.base} size={64} />
        <Text style={styles.cameraText}>Camera Preview</Text>
        <Text style={styles.cameraSubtext}>
          Tap record or pick from gallery
        </Text>
      </View>

      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.iconButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FlipHorizontal color={colors.text.inverse} size={28} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            {/* Gallery button — bottom left */}
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={handleGalleryPick}
              activeOpacity={0.7}
            >
              {lastThumbnail ? (
                <Image
                  source={{ uri: lastThumbnail }}
                  style={styles.galleryThumbnail}
                />
              ) : (
                <ImageIcon color={colors.text.inverse} size={24} />
              )}
            </TouchableOpacity>

            {/* Record button — center */}
            <View style={styles.recordSection}>
              <View style={styles.recordButtonOuter}>
                <TouchableOpacity
                  style={styles.recordButtonInner}
                  onPress={handleRecord}
                />
              </View>
              <Text style={styles.instructionText}>Tap to record</Text>
            </View>

            {/* Spacer to balance the layout */}
            <View style={styles.gallerySpacer} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  cameraPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraText: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    ...typography.weights.semiBold,
    marginTop: spacing.md,
  },
  cameraSubtext: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    ...typography.weights.regular,
    marginTop: spacing.xs,
  },
  closeText: {
    color: colors.text.inverse,
    fontSize: 22,
    ...typography.weights.bold,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  iconButton: {
    padding: spacing.sm,
    backgroundColor: colors.background.default,
    borderRadius: spacing.radius.full,
  },
  footer: {
    paddingBottom: spacing['2xl'],
    paddingHorizontal: spacing.lg,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /* Gallery button */
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  galleryThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  gallerySpacer: {
    width: 48,
  },

  /* Record button */
  recordSection: {
    alignItems: 'center',
  },
  recordButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  recordButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary.base,
  },
  instructionText: {
    color: colors.text.inverse,
    ...typography.weights.medium,
    textShadowColor: colors.background.default,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
