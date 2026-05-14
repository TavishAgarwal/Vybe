import { supabase } from './supabase';
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

const MOCK_CHALLENGES: Challenge[] = [
  { id: 'c1', title: 'Acoustic Covers', description: 'Show us your best unplugged cover of a pop song.', category: 'music', weekNumber: 1, year: 2026, startDate: '2026-05-14T00:00:00Z', endDate: '2026-05-21T00:00:00Z', revealDate: '2026-05-21T00:00:00Z', coverImageUrl: 'https://images.pexels.com/photos/1648178/pexels-photo-1648178.jpeg', promptText: 'Acoustic Cover', status: 'active', winnerId: null, runnerUp1Id: null, runnerUp2Id: null },
  { id: 'c2', title: 'Street Dance Battle', description: 'Drop your best 15-second street dance choreo.', category: 'dance', weekNumber: 1, year: 2026, startDate: '2026-05-14T00:00:00Z', endDate: '2026-05-21T00:00:00Z', revealDate: '2026-05-21T00:00:00Z', coverImageUrl: 'https://images.pexels.com/photos/1701198/pexels-photo-1701198.jpeg', promptText: 'Street Dance', status: 'active', winnerId: null, runnerUp1Id: null, runnerUp2Id: null },
  { id: 'c3', title: 'Standup in 30s', description: 'Deliver your best punchline in under 30 seconds.', category: 'comedy', weekNumber: 1, year: 2026, startDate: '2026-05-14T00:00:00Z', endDate: '2026-05-21T00:00:00Z', revealDate: '2026-05-21T00:00:00Z', coverImageUrl: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg', promptText: 'Standup', status: 'active', winnerId: null, runnerUp1Id: null, runnerUp2Id: null },
  { id: 'c4', title: 'Quick Sketch', description: 'Draw a portrait in under 1 minute. No edits!', category: 'art', weekNumber: 1, year: 2026, startDate: '2026-05-14T00:00:00Z', endDate: '2026-05-21T00:00:00Z', revealDate: '2026-05-21T00:00:00Z', coverImageUrl: 'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg', promptText: 'Sketch', status: 'active', winnerId: null, runnerUp1Id: null, runnerUp2Id: null },
  { id: 'c5', title: 'Trick Shot', description: 'Any sport. Any ball. Make the impossible shot.', category: 'sports', weekNumber: 1, year: 2026, startDate: '2026-05-14T00:00:00Z', endDate: '2026-05-21T00:00:00Z', revealDate: '2026-05-21T00:00:00Z', coverImageUrl: 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg', promptText: 'Trick Shot', status: 'active', winnerId: null, runnerUp1Id: null, runnerUp2Id: null },
  { id: 'c6', title: 'Clutch Moments', description: 'Post your best gaming clutch or 1vX moment.', category: 'gaming', weekNumber: 1, year: 2026, startDate: '2026-05-14T00:00:00Z', endDate: '2026-05-21T00:00:00Z', revealDate: '2026-05-21T00:00:00Z', coverImageUrl: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg', promptText: 'Gaming Clutch', status: 'active', winnerId: null, runnerUp1Id: null, runnerUp2Id: null },
  { id: 'c7', title: '5-Ingredient Meal', description: 'Cook something amazing with only 5 ingredients.', category: 'cooking', weekNumber: 1, year: 2026, startDate: '2026-05-14T00:00:00Z', endDate: '2026-05-21T00:00:00Z', revealDate: '2026-05-21T00:00:00Z', coverImageUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg', promptText: '5-Ingredient Meal', status: 'active', winnerId: null, runnerUp1Id: null, runnerUp2Id: null },
  { id: 'c8', title: 'Thrift Flips', description: 'Turn thrifted clothes into high fashion.', category: 'fashion', weekNumber: 1, year: 2026, startDate: '2026-05-14T00:00:00Z', endDate: '2026-05-21T00:00:00Z', revealDate: '2026-05-21T00:00:00Z', coverImageUrl: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg', promptText: 'Thrift Flip', status: 'active', winnerId: null, runnerUp1Id: null, runnerUp2Id: null },
  { id: 'c9', title: 'Bodyweight PR', description: 'Show us your hardest calisthenics or bodyweight move.', category: 'fitness', weekNumber: 1, year: 2026, startDate: '2026-05-14T00:00:00Z', endDate: '2026-05-21T00:00:00Z', revealDate: '2026-05-21T00:00:00Z', coverImageUrl: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg', promptText: 'Bodyweight PR', status: 'active', winnerId: null, runnerUp1Id: null, runnerUp2Id: null },
  { id: 'c10', title: 'Room Transformation', description: 'Show the before and after of your DIY room makeover.', category: 'diy', weekNumber: 1, year: 2026, startDate: '2026-05-14T00:00:00Z', endDate: '2026-05-21T00:00:00Z', revealDate: '2026-05-21T00:00:00Z', coverImageUrl: 'https://images.pexels.com/photos/3052651/pexels-photo-3052651.jpeg', promptText: 'Room Makeover', status: 'active', winnerId: null, runnerUp1Id: null, runnerUp2Id: null },
  { id: 'c11', title: 'Funny Pet Habits', description: 'What is the weirdest thing your pet does?', category: 'pets', weekNumber: 1, year: 2026, startDate: '2026-05-14T00:00:00Z', endDate: '2026-05-21T00:00:00Z', revealDate: '2026-05-21T00:00:00Z', coverImageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg', promptText: 'Funny Pets', status: 'active', winnerId: null, runnerUp1Id: null, runnerUp2Id: null },
  { id: 'c12', title: 'Hidden Gems', description: 'Share a beautiful, unknown spot in your city.', category: 'travel', weekNumber: 1, year: 2026, startDate: '2026-05-14T00:00:00Z', endDate: '2026-05-21T00:00:00Z', revealDate: '2026-05-21T00:00:00Z', coverImageUrl: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg', promptText: 'Hidden Gems', status: 'active', winnerId: null, runnerUp1Id: null, runnerUp2Id: null },
];

export const challengesApi = {
  getActive: async () => {
    try {
      const response = await supabase
        .from('challenges')
        .select('*')
        .eq('status', 'active')
        .order('ends_at', { ascending: true })
        .limit(1)
        .single();
      const data = response.data as DbChallenge | null;

      if (data) {
        return {
          data: {
            id: data.id,
            title: data.title,
            description: data.description,
            category: (data.category || 'general') as Challenge['category'],
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
      }
    } catch (error) {
      // ignore
    }
    return { data: MOCK_CHALLENGES[0] };
  },

  getAll: async () => {
    try {
      const response = await supabase
        .from('challenges')
        .select('*')
        .eq('status', 'active')
        .order('ends_at', { ascending: true });
      const data = (response.data ?? []) as DbChallenge[];

      if (data.length > 0) {
        const challenges: Challenge[] = data.map(row => ({
          id: row.id,
          title: row.title,
          description: row.description,
          category: (row.category || 'general') as Challenge['category'],
          weekNumber: 1,
          year: 2026,
          startDate: row.created_at,
          endDate: row.ends_at,
          revealDate: row.ends_at,
          coverImageUrl: `https://picsum.photos/seed/${row.id}/800/400`,
          promptText: row.description,
          status: row.status as Challenge['status'],
          winnerId: null,
          runnerUp1Id: null,
          runnerUp2Id: null,
        }));
        return { data: challenges };
      }
    } catch (error) {
      // ignore
    }
    return { data: MOCK_CHALLENGES };
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

    // Insert vote row (unique constraint prevents duplicates)
    const { error: voteError } = await supabase
      .from('votes')
      .insert({ entry_id: entryId, user_id: user.id });

    if (voteError) {
      throw voteError;
    }

    // Bump vote_count on the entry
    await supabase.rpc('increment_vote_count', { target_entry_id: entryId });

    return { data: { success: true } };
  },
  unvote: async (entryId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { error: deleteError } = await supabase
      .from('votes')
      .delete()
      .eq('entry_id', entryId)
      .eq('user_id', user.id);

    if (deleteError) {
      throw deleteError;
    }

    // Decrement vote_count on the entry
    await supabase.rpc('decrement_vote_count', { target_entry_id: entryId });

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

    const { data, error } = await supabase
      .from('comments')
      .insert({
        entry_id: entryId,
        user_id: user.id,
        content: text,
        positivity_score: 1.0,
      })
      .select('*, user:users(*)')
      .single();

    if (error) {
      throw error;
    }

    const dbComment = data as DbComment;
    const comment: Comment = {
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
    };

    return { data: comment };
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
