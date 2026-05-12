import React from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
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
          onPress={() => navigation.goBack()}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
});
