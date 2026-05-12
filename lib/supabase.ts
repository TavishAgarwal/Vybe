import { createClient } from '@supabase/supabase-js'
import { AppState } from 'react-native'
import { secureStorage } from '@/src/utils/storage'
import { getEnv } from '@/src/utils/env'
import { logger } from '@/src/utils/logger'

const SUPABASE_URL = getEnv('EXPO_PUBLIC_SUPABASE_URL')
const SUPABASE_KEY =
  getEnv('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY') ||
  getEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY')

/** True when Supabase credentials are present. Auth/DB calls are no-ops when false. */
export const isSupabaseEnabled = !!SUPABASE_URL && !!SUPABASE_KEY

if (!isSupabaseEnabled) {
  logger.warn(
    '[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or key — running without backend. ' +
    'Set values in .env.local to enable auth and database.'
  )
}

const SupabaseStorage = {
  getItem: (key: string) => secureStorage.getString(key) ?? null,
  setItem: (key: string, value: string) => secureStorage.set(key, value),
  removeItem: (key: string) => {
    secureStorage.remove(key)
  },
}

export const supabase = createClient(
  SUPABASE_URL  || 'https://placeholder.supabase.co',
  SUPABASE_KEY  || 'placeholder',
  {
    auth: {
      storage: SupabaseStorage,
      autoRefreshToken: isSupabaseEnabled,
      persistSession: isSupabaseEnabled,
      detectSessionInUrl: false,
    },
    // Disable realtime entirely when unconfigured — prevents WebSocket errors
    realtime: isSupabaseEnabled ? undefined : { params: { eventsPerSecond: 0 } },
    global: {
      // Suppress fetch errors when Supabase is not configured
      fetch: isSupabaseEnabled ? undefined : () => Promise.resolve(new Response('null', { status: 200 })),
    },
  }
)

// Restart token auto-refresh when app comes to foreground
if (isSupabaseEnabled) {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
}
