import { NavigatorScreenParams } from '@react-navigation/native';
import { Entry } from './models';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  PositivityPledge: undefined;
  CategorySelect: undefined;
  ProfileSetup: undefined;
  SignUp: undefined;
  Login: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Create: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;

  // Modals & Full screen nested routes
  ChallengeDetail: { challengeId: string };
  VideoPlayer: { entry: Entry };
  Comment: { entryId: string };

  // Create flow
  Effects: { videoUri: string };
  Caption: { videoUri: string; filterId: string; musicId: string };
  Processing: {
    videoUri: string;
    caption: string;
    filterId: string;
    musicId: string;
  };

  // Profile & Misc
  PublicProfile: { userId: string };
  EditProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
  WinnerReveal: undefined;
  ChallengeArchive: undefined;
  Report: { entryId?: string; commentId?: string };
  ModerationStatus: undefined;
  AppealDecision: { entryId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
