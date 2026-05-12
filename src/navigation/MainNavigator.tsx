import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import { Home, Compass, PlusSquare, Trophy, User } from 'lucide-react-native';
import { colors } from '../theme';
import { HomeScreen } from '../screens/feed/HomeScreen';
import { DiscoverScreen } from '../screens/discover/DiscoverScreen';
import { LeaderboardScreen } from '../screens/leaderboard/LeaderboardScreen';
import { CreateScreen } from '../screens/create/CreateScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const HomeIcon = ({ color }: { color: string }) => (
  <Home color={color} size={24} />
);
const DiscoverIcon = ({ color }: { color: string }) => (
  <Compass color={color} size={24} />
);
const CreateIcon = ({ color }: { color: string }) => (
  <PlusSquare color={color} size={24} />
);
const LeaderboardIcon = ({ color }: { color: string }) => (
  <Trophy color={color} size={24} />
);
const ProfileIcon = ({ color }: { color: string }) => (
  <User color={color} size={24} />
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.default,
          borderTopColor: colors.border.default,
        },
        tabBarActiveTintColor: colors.primary.base,
        tabBarInactiveTintColor: colors.text.secondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarIcon: DiscoverIcon,
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarIcon: CreateIcon,
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarIcon: LeaderboardIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};
