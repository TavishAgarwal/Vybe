import axios from 'axios';
import { DeviceEventEmitter } from 'react-native';
import { secureStorage } from '../utils/storage';
import { getEnv, isHttpsUrl } from '../utils/env';
import { logger } from '../utils/logger';
import { clearSensitiveData } from '../utils/cleanup';

const baseURL = getEnv('EXPO_PUBLIC_API_URL', 'https://api.vybe.app');

if (!__DEV__ && !isHttpsUrl(baseURL)) {
  throw new Error('EXPO_PUBLIC_API_URL must use HTTPS in production');
}

const apiClient = axios.create({
  baseURL,
  timeout: 30000,
});

const refreshClient = axios.create({
  baseURL,
  timeout: 30000,
});

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = secureStorage.getString('refresh-token');
    if (!refreshToken) {
      return null;
    }

    const response = await refreshClient.post('/auth-refresh', {
      refreshToken,
    });
    const accessToken = response.data?.accessToken;
    const nextRefreshToken = response.data?.refreshToken;

    if (
      typeof accessToken !== 'string' ||
      typeof nextRefreshToken !== 'string'
    ) {
      return null;
    }

    secureStorage.set('auth-token', accessToken);
    secureStorage.set('refresh-token', nextRefreshToken);
    return accessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

apiClient.interceptors.request.use(
  async config => {
    const token = secureStorage.getString('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (__DEV__) {
      logger.debug('API request', { method: config.method, url: config.url });
    }
    return config;
  },
  error => Promise.reject(error),
);

apiClient.interceptors.response.use(
  response => {
    if (__DEV__) {
      logger.debug('API response', {
        status: response.status,
        url: response.config.url,
      });
    }
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const accessToken = await refreshAccessToken();
      if (accessToken) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      }

      await clearSensitiveData();
      DeviceEventEmitter.emit('vybe:auth-expired');
    }

    if (status === 429) {
      const retryAfter = error.response?.headers?.['retry-after'];
      logger.warn('API rate limited', { retryAfter });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
