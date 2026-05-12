import { supabase } from './supabase';
import apiClient from './client';
import { Entry, Challenge, Comment, User } from '../types/models';
import {
  DbUser,
  DbEntry,
  DbComment,
  CreateEntryPayload,
  DbChallenge,
} from '../types/database';
import { useAuthStore } from '../stores/authStore';

export const mapUser = (dbUser: DbUser): User => ({
  id: dbUser.id,
  handle: dbUser.username,
  username: dbUser.username,
  displayName: dbUser.full_name || dbUser.username,
  avatarUrl: dbUser.avatar_url || '',
  bio: dbUser.bio || '',
  categories: [],
  vybeScore: dbUser.vybe_score || 0,
  vybeCoins: 0,
  strikeCount: 0,
  pledgeSigned: true,
  createdAt: dbUser.created_at,
  followersCount: 0,
  followingCount: 0,
});

const mapEntry = (dbEntry: DbEntry): Entry => ({
  id: dbEntry.id,
  challengeId: dbEntry.challenge_id,
  userId: dbEntry.user_id,
  videoUrl: dbEntry.video_url,
  thumbnailUrl: dbEntry.thumbnail_url,
  caption: dbEntry.caption,
  duration: 0, // Need metadata extraction if we want this
  voteCount: dbEntry.vote_count,
  reactionCounts: { fire: 0, heart: 0, party: 0, clap: 0, sparkle: 0, love: 0 },
  status: dbEntry.status as Entry['status'],
  moderationScore: 0,
  rejectionReason: null,
  createdAt: dbEntry.created_at,
  rank: null,
  musicTrack: dbEntry.music_track
    ? { title: dbEntry.music_track, artist: 'Unknown' }
    : undefined,
  user: dbEntry.user ? mapUser(dbEntry.user) : undefined,
});

export const challengesApi = {
  getActive: async () => {
    const response = await supabase
      .from('challenges')
      .select('*')
      .eq('status', 'active')
      .order('ends_at', { ascending: true })
      .limit(1)
      .single();
    const data = response.data as DbChallenge | null;
    const error = response.error;

    if (error && error.code !== 'PGRST116') {
      throw error;
    } // ignore no rows

    if (!data) {
      return { data: null };
    }

    return {
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        category: 'singing' as const, // Simplified
        weekNumber: 1,
        year: 2026,
        startDate: data.created_at,
        endDate: data.ends_at,
        revealDate: data.ends_at,
        coverImageUrl: 'https://picsum.photos/seed/challenge/800/400',
        promptText: data.description,
        status: data.status as Challenge['status'],
        winnerId: null,
        runnerUp1Id: null,
        runnerUp2Id: null,
      } satisfies Challenge,
    };
  },
};

export const entriesApi = {
  getFeed: async (challengeId: string, cursor = 0, limit = 5) => {
    const start = cursor * limit;
    const end = start + limit - 1;

    const response = await supabase
      .from('entries')
      .select('*, user:users(*)')
      .eq('challenge_id', challengeId)
      .eq('status', 'live')
      .order('created_at', { ascending: false })
      .range(start, end);
    const data = (response.data ?? []) as DbEntry[];
    const error = response.error;

    if (error) {
      throw error;
    }

    const entries = data.map(row => mapEntry(row));

    return {
      data: entries,
      nextCursor: entries.length === limit ? cursor + 1 : undefined,
    };
  },

  createEntry: async (entryData: CreateEntryPayload) => {
    const response = await supabase
      .from('entries')
      .insert([entryData])
      .select()
      .single();
    const data = response.data as DbEntry | null;
    const error = response.error;

    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error('Entry create returned no data.');
    }
    return { data };
  },
};

export const votesApi = {
  vote: async (entryId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('Not authenticated');
    }

    await apiClient.post(`/entry-vote?entryId=${encodeURIComponent(entryId)}`);
    return { data: { success: true } };
  },
  unvote: async (entryId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('Not authenticated');
    }

    await apiClient.delete(
      `/entry-vote?entryId=${encodeURIComponent(entryId)}`,
    );
    return { data: { success: true } };
  },
};

export const commentsApi = {
  getByEntry: async (entryId: string) => {
    const response = await supabase
      .from('comments')
      .select('*, user:users(*)')
      .eq('entry_id', entryId)
      .gte('positivity_score', 0.3)
      .order('created_at', { ascending: false });
    const data = (response.data ?? []) as DbComment[];
    const error = response.error;

    if (error) {
      throw error;
    }

    const comments: Comment[] = data.map(dbComment => ({
      id: dbComment.id,
      entryId: dbComment.entry_id,
      userId: dbComment.user_id,
      text: dbComment.content,
      positivityScore: dbComment.positivity_score,
      isPinned: false,
      parentId: null,
      createdAt: dbComment.created_at,
      likeCount: 0,
      user: dbComment.user ? mapUser(dbComment.user) : undefined,
    }));

    return { data: comments };
  },

  postComment: async (entryId: string, text: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('Not authenticated');
    }

    const response = await apiClient.post<Comment>(
      `/entry-comment?entryId=${encodeURIComponent(entryId)}`,
      { text },
    );

    return { data: response.data };
  },
};

export const leaderboardApi = {
  getCurrent: async () => {
    const response = await supabase
      .from('entries')
      .select('*, user:users(*)')
      .eq('status', 'live')
      .order('vote_count', { ascending: false })
      .limit(20);
    const data = (response.data ?? []) as DbEntry[];
    const error = response.error;

    if (error) {
      throw error;
    }

    const entries = data.map(row => mapEntry(row));
    return { data: entries };
  },
};
