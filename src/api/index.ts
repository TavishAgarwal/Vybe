import { supabase } from './supabase';
import apiClient from './client';
import { Entry, Challenge, Comment, User } from '../types/models';
import {
  DbUser,
  DbEntry,
  DbComment,
  CreateEntryPayload,
} from '../types/database';
import { useAuthStore } from '../stores/authStore';

const mapUser = (dbUser: DbUser): User => ({
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
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('status', 'active')
      .order('ends_at', { ascending: true })
      .limit(1)
      .single();

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

    const { data, error } = await supabase
      .from('entries')
      .select('*, user:users(*)')
      .eq('challenge_id', challengeId)
      .eq('status', 'live')
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      throw error;
    }

    const entries = (data || []).map((row: DbEntry) => mapEntry(row));

    return {
      data: entries,
      nextCursor: entries.length === limit ? cursor + 1 : undefined,
    };
  },

  createEntry: async (entryData: CreateEntryPayload) => {
    const { data, error } = await supabase
      .from('entries')
      .insert([entryData])
      .select()
      .single();

    if (error) {
      throw error;
    }
    return { data: data as DbEntry };
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
    const { data, error } = await supabase
      .from('comments')
      .select('*, user:users(*)')
      .eq('entry_id', entryId)
      .gte('positivity_score', 0.3)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const comments: Comment[] = (data || []).map((dbComment: DbComment) => ({
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

    const { data } = await apiClient.post(
      `/entry-comment?entryId=${encodeURIComponent(entryId)}`,
      { text },
    );

    return { data: data as Comment };
  },
};

export const leaderboardApi = {
  getCurrent: async () => {
    const { data, error } = await supabase
      .from('entries')
      .select('*, user:users(*)')
      .eq('status', 'live')
      .order('vote_count', { ascending: false })
      .limit(20);

    if (error) {
      throw error;
    }

    const entries = (data || []).map((row: DbEntry) => mapEntry(row));
    return { data: entries };
  },
};
