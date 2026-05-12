/**
 * Manual Supabase DB row types.
 * These mirror the column names returned by Supabase queries.
 * If you ever generate types via `supabase gen types`, replace this file.
 */

export interface DbUser {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  vybe_score: number;
  created_at: string;
}

export interface DbEntry {
  id: string;
  challenge_id: string;
  user_id: string;
  video_url: string;
  thumbnail_url: string;
  caption: string;
  vote_count: number;
  status: string;
  music_track: string | null;
  created_at: string;
  /** Joined relation — present when using `.select('*, user:users(*)')` */
  user?: DbUser;
}

export interface DbComment {
  id: string;
  entry_id: string;
  user_id: string;
  content: string;
  positivity_score: number;
  created_at: string;
  /** Joined relation — present when using `.select('*, user:users(*)')` */
  user?: DbUser;
}

export interface DbChallenge {
  id: string;
  title: string;
  description: string;
  status: string;
  ends_at: string;
  created_at: string;
}

export interface DbVote {
  id: string;
  entry_id: string;
  user_id: string;
  created_at: string;
}

/** Payload for creating a new entry via `entriesApi.createEntry` */
export interface CreateEntryPayload {
  challenge_id: string;
  user_id: string;
  video_url: string;
  thumbnail_url: string;
  caption: string;
  status: string;
  vote_count: number;
  music_track: string;
}
