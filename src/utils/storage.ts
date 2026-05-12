import { createMMKV, type MMKV } from 'react-native-mmkv';
import * as SecureStore from 'expo-secure-store';

const SECURE_STORAGE_KEY = 'vybe.mmkv.encryptionKey.v1';

const randomKey = () => {
  const bytes = new Uint8Array(32);
  const cryptoLike = globalThis.crypto as Crypto | undefined;

  if (cryptoLike?.getRandomValues) {
    cryptoLike.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
};

const getEncryptionKey = () => {
  const existing = SecureStore.getItem(SECURE_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const next = randomKey();
  SecureStore.setItem(SECURE_STORAGE_KEY, next, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  return next;
};

export const secureStorage = createMMKV({
  id: 'vybe-secure',
  encryptionKey: getEncryptionKey(),
});

export const appStorage = createMMKV({
  id: 'vybe-app',
});

// Backwards-compatible alias for older imports. Sensitive callers should move to
// secureStorage; keeping this alias prevents accidental fallback to plain MMKV.
export const storage = secureStorage;

export const createZustandStorage = (instance: MMKV) => ({
  getItem: (name: string) => {
    const value = instance.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    instance.set(name, value);
  },
  removeItem: (name: string) => {
    instance.remove(name);
  },
});

export const secureZustandStorage = createZustandStorage(secureStorage);
export const appZustandStorage = createZustandStorage(appStorage);

export const removeSecureStoreItem = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};
