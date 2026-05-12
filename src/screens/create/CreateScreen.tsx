import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { colors, spacing, typography } from '../../theme';
import { X, FlipHorizontal } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

export const CreateScreen = () => {
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const device = useCameraDevice(cameraPosition);
  const { hasPermission, requestPermission } = useCameraPermission();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission().catch(() => undefined);
    }
  }, [hasPermission, requestPermission]);

  const toggleCamera = () => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  };

  const handleClose = () => {
    navigation.navigate('Main', { screen: 'Home' });
  };

  const handleRecord = () => {
    // In a real app, camera.startRecording()
    // For this demo, we simulate recording and navigating
    navigation.navigate('Effects', {
      videoUri: 'https://www.w3schools.com/html/mov_bbb.mp4',
    });
  };

  if (!hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Camera permission is required.</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Loading Camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />

      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.iconButton}>
            <X color={colors.text.inverse} size={28} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCamera} style={styles.iconButton}>
            <FlipHorizontal color={colors.text.inverse} size={28} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.recordButtonOuter}>
            <TouchableOpacity
              style={styles.recordButtonInner}
              onPress={handleRecord}
            />
          </View>
          <Text style={styles.instructionText}>Tap to record</Text>
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
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.text.inverse,
    ...typography.weights.medium,
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
    alignItems: 'center',
    paddingBottom: spacing['2xl'],
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
