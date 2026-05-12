import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { FeedItem } from '../../components';
import { colors } from '../../theme';
import { ChevronLeft } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

export const VideoPlayerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { entry } = route.params;

  return (
    <View style={styles.container}>
      <FeedItem
        entry={entry}
        isActive={true}
        isPaused={false}
        onLike={() => {}}
        onComment={() => {}}
        onShare={() => {}}
      />

      <SafeAreaView style={styles.backButtonSafeArea}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.replace('Main', { screen: 'Home' });
            }
          }}
        >
          <ChevronLeft color={colors.text.inverse} size={32} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  backButtonSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 16,
    shadowColor: colors.background.default,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
});
