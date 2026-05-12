import { create } from 'zustand';
import { User } from '../types/models';
import { supabase } from '../api/supabase';
import { clearSensitiveData } from '../utils/cleanup';
import { logger } from '../utils/logger';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  signPledge: () => void;
}

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
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          // Map DB profile to our User type
          set({
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
        }
      }
      set(state => ({ isLoading: false, user: state.user }));
    } catch (e) {
      logger.error('Login failed', e);
      set({ isLoading: false });
      throw e;
    }
  },

  signUp: async (email, password) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        throw error;
      }
      set({ isLoading: false });
    } catch (e) {
      logger.error('Sign up failed', e);
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

    // DB update
    await supabase
      .from('users')
      .update({
        full_name: data.displayName,
        bio: data.bio,
        avatar_url: data.avatarUrl,
      })
      .eq('id', user.id);
  },

  signPledge: () => {
    set(state => ({
      user: state.user ? { ...state.user, pledgeSigned: true } : null,
    }));
  },
}));
