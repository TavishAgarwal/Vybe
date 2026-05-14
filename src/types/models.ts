export interface User {
  id: string;
  handle: string;
  username?: string; // Alias for handle, used by some UI components
  displayName: string;
  avatarUrl: string;
  bio: string;
  categories: string[];
  vybeScore: number;
  vybeCoins: number;
  strikeCount: number;
  pledgeSigned: boolean;
  createdAt: string;
  followersCount: number;
  followingCount: number;
}

export type ChallengeCategory =
  | 'music'
  | 'dance'
  | 'comedy'
  | 'cooking'
  | 'art'
  | 'sports'
  | 'gaming'
  | 'fashion'
  | 'fitness'
  | 'diy'
  | 'pets'
  | 'travel'
  | 'general';
export type ChallengeStatus =
  | 'upcoming'
  | 'active'
  | 'voting'
  | 'closed'
  | 'revealed';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  revealDate: string;
  coverImageUrl: string;
  promptText: string;
  status: ChallengeStatus;
  winnerId: string | null;
  runnerUp1Id: string | null;
  runnerUp2Id: string | null;
}

export type EntryStatus =
  | 'processing'
  | 'under_review'
  | 'live'
  | 'rejected'
  | 'removed';

export interface ReactionCounts {
  fire: number;
  heart: number;
  party: number;
  clap: number;
  sparkle: number;
  love: number;
}

export type ReactionCountKey = keyof ReactionCounts;

export interface Entry {
  id: string;
  challengeId: string;
  userId: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  duration: number;
  voteCount: number;
  reactionCounts: ReactionCounts;
  status: EntryStatus;
  moderationScore: number;
  rejectionReason: string | null;
  createdAt: string;
  rank: number | null;
  commentCount?: number;

  // Relations for easy access
  user?: User;
  challenge?: Challenge;
  musicTrack?: { title: string; artist: string };
}

export interface Comment {
  id: string;
  entryId: string;
  userId: string;
  text: string;
  positivityScore: number;
  isPinned: boolean;
  parentId: string | null;
  createdAt: string;
  likeCount: number;

  user?: User;
}

export interface Vote {
  id: string;
  entryId: string;
  userId: string;
  createdAt: string;
}

export type NotificationType =
  | 'new_challenge'
  | 'vote_milestone'
  | 'comment_on_entry'
  | 'new_follower'
  | 'winner_announcement'
  | 'entry_approved'
  | 'entry_rejected'
  | 'rank_change';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, string>;
  read: boolean;
  createdAt: string;
}

export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface Strike {
  id: string;
  userId: string;
  reason: string;
  entryId: string | null;
  issuedAt: string;
  expiresAt: string;
}
