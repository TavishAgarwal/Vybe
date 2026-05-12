import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { secureStorage } from '../utils/storage';
import { requireEnv } from '../utils/env';

const supabaseUrl = requireEnv('EXPO_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = requireEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');

// Supabase stores refresh/access tokens here. This must stay encrypted.
const SupabaseStorage = {
  getItem: (key: string) => {
    const value = secureStorage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string) => {
    secureStorage.set(key, value);
  },
  removeItem: (key: string) => {
    secureStorage.remove(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SupabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
