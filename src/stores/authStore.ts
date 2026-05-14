import { create } from 'zustand';
import { User } from '../types/models';
import { supabase } from '../api/supabase';
import { clearSensitiveData } from '../utils/cleanup';
import { logger } from '../utils/logger';
import { DbUser } from '../types/database';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  signPledge: () => void;
}

const mapProfileToUser = (profile: DbUser): User => ({
  id: profile.id,
  handle: profile.username,
  username: profile.username,
  displayName: profile.full_name || profile.username,
  avatarUrl: profile.avatar_url || '',
  bio: profile.bio || '',
  categories: profile.categories ?? [],
  vybeScore: profile.vybe_score || 0,
  vybeCoins: 0,
  strikeCount: 0,
  pledgeSigned: true,
  createdAt: profile.created_at,
  followersCount: 0,
  followingCount: 0,
});

export const useAuthStore = create<AuthState>(set => ({
  user: null, // Start null to simulate check
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }

      // Fetch user profile from DB
      if (data.user) {
        const profileResponse = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (profileResponse.error) {
          throw new Error('Could not load profile. Please try again.');
        }

        const profile = profileResponse.data as DbUser | null;

        if (profile) {
          set({
            user: mapProfileToUser(profile),
            isLoading: false,
          });
          return;
        } else {
          throw new Error('Profile not found.');
        }
      }
      set(state => ({ isLoading: false, user: state.user }));
    } catch (e: any) {
      if (e?.name !== 'AuthApiError') {
        logger.error('Login failed', e);
      }
      set({ isLoading: false });
      throw e;
    }
  },

  signUp: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        throw error;
      }

      // Fetch user profile after sign-up (mirrors login flow)
      if (data.user) {
        const profileResponse = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (profileResponse.error) {
          throw new Error('Could not load profile. Please try again.');
        }

        const profile = profileResponse.data as DbUser | null;

        if (profile) {
          set({
            user: mapProfileToUser(profile),
            isLoading: false,
          });
          return;
        } else {
          throw new Error('Profile not found.');
        }
      }

      set({ isLoading: false });
    } catch (e: any) {
      if (e?.name !== 'AuthApiError') {
        logger.error('Sign up failed', e);
      }
      set({ isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    await clearSensitiveData();
    set({ user: null, isLoading: false });
  },

  updateProfile: async data => {
    const { user } = useAuthStore.getState();
    if (!user) {
      return;
    }

    // Optimistic update
    set({ user: { ...user, ...data } });

    // Build DB payload dynamically — only send fields that were provided
    const dbPayload: Record<string, unknown> = {};
    if (data.displayName !== undefined) {
      dbPayload.full_name = data.displayName;
    }
    if (data.bio !== undefined) {
      dbPayload.bio = data.bio;
    }
    if (data.avatarUrl !== undefined) {
      dbPayload.avatar_url = data.avatarUrl;
    }
    if (data.username !== undefined || data.handle !== undefined) {
      dbPayload.username = data.username ?? data.handle;
    }
    if (data.categories !== undefined) {
      dbPayload.categories = data.categories;
    }

    if (Object.keys(dbPayload).length > 0) {
      await supabase
        .from('users')
        .update(dbPayload)
        .eq('id', user.id);
    }
  },

  signPledge: () => {
    set(state => ({
      user: state.user ? { ...state.user, pledgeSigned: true } : null,
    }));
  },
}));
