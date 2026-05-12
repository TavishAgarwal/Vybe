import Constants from 'expo-constants';

type PublicEnvKey =
  | 'EXPO_PUBLIC_API_URL'
  | 'EXPO_PUBLIC_SUPABASE_URL'
  | 'EXPO_PUBLIC_SUPABASE_ANON_KEY'
  | 'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
  | 'EXPO_PUBLIC_SENTRY_DSN'
  | 'EXPO_PUBLIC_POSTHOG_KEY'
  | 'EXPO_PUBLIC_POSTHOG_HOST'
  | 'EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY'
  | 'EXPO_PUBLIC_REVENUECAT_IOS_API_KEY';

const extra = (Constants.expoConfig?.extra ??
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Constants.manifest2?.extra ??
  {}) as Record<string, unknown>;

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const processEnv: Record<PublicEnvKey, string | undefined> = {
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  EXPO_PUBLIC_POSTHOG_KEY: process.env.EXPO_PUBLIC_POSTHOG_KEY,
  EXPO_PUBLIC_POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY:
    process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
  EXPO_PUBLIC_REVENUECAT_IOS_API_KEY:
    process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
};
/* eslint-enable @typescript-eslint/no-unsafe-assignment */

export const getEnv = (key: PublicEnvKey, fallback = '') => {
  const fromExtra = extra[key];
  if (typeof fromExtra === 'string' && fromExtra.trim().length > 0) {
    return fromExtra;
  }

  const fromProcess = processEnv[key];
  if (typeof fromProcess === 'string' && fromProcess.trim().length > 0) {
    return fromProcess;
  }

  return fallback;
};

export const requireEnv = (key: PublicEnvKey) => {
  const value = getEnv(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const isHttpsUrl = (value: string) => /^https:\/\//i.test(value);
