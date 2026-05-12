import { queryClient } from '../../lib/queryClient';
import { secureStorage } from './storage';

const SENSITIVE_KEYS = [
  'auth-token',
  'refresh-token',
  'supabase.auth.token',
  'sb-auth-token',
];

export const clearSensitiveData = async () => {
  SENSITIVE_KEYS.forEach(key => secureStorage.remove(key));
  secureStorage
    .getAllKeys()
    .filter(key => key.startsWith('sb-') || key.includes('auth-token'))
    .forEach(key => secureStorage.remove(key));

  queryClient.clear();
};
