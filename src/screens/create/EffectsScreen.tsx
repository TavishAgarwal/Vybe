import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Music, Wand2, Check } from 'lucide-react-native';
import { colors, spacing, typography } from '../../theme';
import Video from 'react-native-video';
import { GradientButton } from '../../components/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

// Simple simulated filters using colored overlays
const FILTERS = [
  { id: 'none', name: 'Normal', color: 'transparent' },
  { id: 'warm', name: 'Warm', color: 'rgba(255, 150, 0, 0.15)' },
  { id: 'cool', name: 'Cool', color: 'rgba(0, 150, 255, 0.15)' },
  { id: 'vintage', name: 'Vintage', color: 'rgba(150, 100, 50, 0.2)' },
  { id: 'bw', name: 'B&W', color: 'rgba(0, 0, 0, 0.3)' }, // (Post-process will actually do grayscale)
];

const MUSIC_TRACKS = [
  { id: 'none', name: 'Original Audio' },
  { id: 'lofi', name: 'Chill Lo-Fi Beat' },
  { id: 'pop', name: 'Upbeat Pop' },
  { id: 'acoustic', name: 'Acoustic Guitar' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Effects'>;

export const EffectsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { videoUri } = route.params;
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [selectedMusic, setSelectedMusic] = useState(MUSIC_TRACKS[0]);
  const [activeTab, setActiveTab] = useState<'filters' | 'music'>('filters');
  const selectedFilterOverlay = useMemo(
    () => [styles.filterOverlay, { backgroundColor: selectedFilter.color }],
    [selectedFilter.color],
  );

  const handleNext = () => {
    navigation.navigate('Caption', {
      videoUri,
      filterId: selectedFilter.id,
      musicId: selectedMusic.id,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: videoUri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          repeat
          muted={selectedMusic.id !== 'none'}
        />
        {/* Simulate filter with CSS overlay for preview */}
        <View pointerEvents="none" style={selectedFilterOverlay} />
      </View>

      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <ArrowLeft color={colors.text.inverse} size={24} />
          </TouchableOpacity>
          <GradientButton
            title="Next"
            size="sm"
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>

        <View style={styles.bottomControls}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'filters' && styles.activeTab]}
              onPress={() => setActiveTab('filters')}
            >
              <Wand2
                color={
                  activeTab === 'filters'
                    ? colors.primary.base
                    : colors.text.inverse
                }
                size={20}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'filters' && styles.activeTabText,
                ]}
              >
                Filters
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'music' && styles.activeTab]}
              onPress={() => setActiveTab('music')}
            >
              <Music
                color={
                  activeTab === 'music'
                    ? colors.primary.base
                    : colors.text.inverse
                }
                size={20}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'music' && styles.activeTabText,
                ]}
              >
                Music
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.panel}>
            {activeTab === 'filters' ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {FILTERS.map(f => (
                  <TouchableOpacity
                    key={f.id}
                    style={[
                      styles.optionItem,
                      selectedFilter.id === f.id && styles.optionItemSelected,
                    ]}
                    onPress={() => setSelectedFilter(f)}
                  >
                    <View style={getFilterPreviewStyle(f.color)} />
                    <Text style={styles.optionText}>{f.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {MUSIC_TRACKS.map(m => (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.musicItem,
                      selectedMusic.id === m.id && styles.musicItemSelected,
                    ]}
                    onPress={() => setSelectedMusic(m)}
                  >
                    <Text
                      style={[
                        styles.musicText,
                        selectedMusic.id === m.id && styles.musicTextSelected,
                      ]}
                    >
                      {m.name}
                    </Text>
                    {selectedMusic.id === m.id && (
                      <Check color={colors.text.inverse} size={16} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
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
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
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
  nextButton: {
    paddingHorizontal: spacing.xl,
  },
  bottomControls: {
    backgroundColor: colors.background.default,
    paddingBottom: spacing.lg,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary.base,
  },
  tabText: {
    color: colors.text.inverse,
    ...typography.weights.medium,
  },
  activeTabText: {
    color: colors.primary.base,
  },
  panel: {
    height: 120,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
  },
  optionItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  optionItemSelected: {
    transform: [{ scale: 1.05 }],
  },
  filterPreview: {
    width: 60,
    height: 60,
    borderRadius: spacing.radius.full,
    borderWidth: 2,
    borderColor: colors.background.default,
  },
  optionText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.sm,
    ...typography.weights.medium,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: spacing.radius.full,
  },
  musicItemSelected: {
    backgroundColor: colors.primary.base,
  },
  musicText: {
    color: colors.text.inverse,
    ...typography.weights.medium,
  },
  musicTextSelected: {
    ...typography.weights.bold,
  },
});

const getFilterPreviewStyle = (color: string) => [
  styles.filterPreview,
  {
    backgroundColor:
      color !== 'transparent' ? color : colors.background.tertiary,
  },
];
