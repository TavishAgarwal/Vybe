import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { EffectsScreen } from '../screens/create/EffectsScreen';
import { CaptionScreen } from '../screens/create/CaptionScreen';
import { ProcessingScreen } from '../screens/create/ProcessingScreen';
import { ReportScreen } from '../screens/moderation/ReportScreen';
import { WinnerRevealScreen } from '../screens/leaderboard/WinnerRevealScreen';
import { VideoPlayerScreen } from '../screens/feed/VideoPlayerScreen';
import { useAuthStore } from '../stores/authStore';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { supabase } from '../api/supabase';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user, isLoading } = useAuthStore();
  const [isInitializing, setIsInitializing] = React.useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        useAuthStore.setState({ user: null, isLoading: false });
        setIsInitializing(false);
      } else {
        // We have a session, fetch profile
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              useAuthStore.setState({
                user: {
                  id: profile.id,
                  handle: profile.username,
                  displayName: profile.full_name || profile.username,
                  avatarUrl: profile.avatar_url,
                  bio: profile.bio || '',
                  categories: [],
                  vybeScore: profile.vybe_score || 0,
                  vybeCoins: 0,
                  strikeCount: 0,
                  pledgeSigned: true,
                  createdAt: profile.created_at,
                  followersCount: 0,
                  followingCount: 0,
                },
                isLoading: false,
              });
            } else {
              useAuthStore.setState({ user: null, isLoading: false });
            }
            setIsInitializing(false);
          });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        useAuthStore.setState({ user: null });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isInitializing || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.base} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Group>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="Effects" component={EffectsScreen} />
          <Stack.Screen name="Caption" component={CaptionScreen} />
          <Stack.Screen name="Processing" component={ProcessingScreen} />
          <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
          <Stack.Screen
            name="Report"
            component={ReportScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="WinnerReveal"
            component={WinnerRevealScreen}
            options={{ presentation: 'fullScreenModal' }}
          />
        </Stack.Group>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
