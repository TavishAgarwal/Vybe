import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Expo Go–compatible storage layer.
 *
 * secureStorage exposes the same synchronous-looking API the rest of the app
 * already relies on, backed by an in-memory cache that is hydrated from
 * AsyncStorage on first read and flushed on every write.
 */

const cache = new Map<string, string>();
let hydrated = false;

const hydrate = () => {
  // Best-effort sync hydration via a fire-and-forget async call.
  // First reads before hydration finishes fall back to cache (empty).
  if (!hydrated) {
    hydrated = true;
    AsyncStorage.getAllKeys()
      .then(keys => AsyncStorage.multiGet(keys))
      .then(pairs => {
        for (const [key, value] of pairs) {
          if (value !== null) {
            cache.set(key, value);
          }
        }
      })
      .catch(() => undefined);
  }
};

hydrate();

export const secureStorage = {
  getString: (key: string): string | undefined => {
    return cache.get(key);
  },
  set: (key: string, value: string) => {
    cache.set(key, value);
    AsyncStorage.setItem(key, value).catch(() => undefined);
  },
  remove: (key: string) => {
    cache.delete(key);
    AsyncStorage.removeItem(key).catch(() => undefined);
  },
  getAllKeys: (): string[] => {
    return Array.from(cache.keys());
  },
};

// Aliases for backward compatibility
export const appStorage = secureStorage;
export const storage = secureStorage;

export const createZustandStorage = (_instance: typeof secureStorage) => ({
  getItem: (name: string) => {
    const value = _instance.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    _instance.set(name, value);
  },
  removeItem: (name: string) => {
    _instance.remove(name);
  },
});

export const secureZustandStorage = createZustandStorage(secureStorage);
export const appZustandStorage = createZustandStorage(appStorage);

export const removeSecureStoreItem = async (key: string) => {
  await AsyncStorage.removeItem(key);
};
