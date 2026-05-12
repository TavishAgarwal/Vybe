import { useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { useAuthStore } from '../stores/authStore';
import apiClient from '../api/client';
import { Entry } from '../types/models';
import { logger } from '../utils/logger';

interface UploadOptions {
  videoUri: string;
  challengeId: string;
  caption: string;
  musicTrack?: string;
  filterId?: string;
  durationSeconds?: number;
  abortSignal?: AbortSignal;
}

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_VIDEO_SECONDS = 60;
const CHUNK_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_VIDEO_MIME = new Set(['video/mp4', 'video/quicktime']);
const ACCEPTED_VIDEO_EXTENSIONS = new Set(['mp4', 'mov']);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const inferVideoMime = (uri: string) => {
  const extension = uri.split('?')[0]?.split('.').pop()?.toLowerCase() ?? '';
  if (extension === 'mp4') {
    return 'video/mp4';
  }
  if (extension === 'mov') {
    return 'video/quicktime';
  }
  return '';
};

const validateVideo = async (options: UploadOptions) => {
  const extension =
    options.videoUri.split('?')[0]?.split('.').pop()?.toLowerCase() ?? '';
  const mimeType = inferVideoMime(options.videoUri);

  if (
    !ACCEPTED_VIDEO_EXTENSIONS.has(extension) ||
    !ACCEPTED_VIDEO_MIME.has(mimeType)
  ) {
    throw new Error('Upload a valid MP4 or MOV video.');
  }

  if (
    options.durationSeconds !== undefined &&
    options.durationSeconds > MAX_VIDEO_SECONDS
  ) {
    throw new Error('Videos must be 60 seconds or shorter.');
  }

  const fileInfo = await FileSystem.getInfoAsync(options.videoUri);
  if (!fileInfo.exists) {
    throw new Error('Selected video file was not found.');
  }
  if ('size' in fileInfo && fileInfo.size && fileInfo.size > MAX_VIDEO_BYTES) {
    throw new Error('Videos must be 100 MB or smaller.');
  }

  return {
    size: 'size' in fileInfo ? (fileInfo.size ?? 0) : 0,
    mimeType,
    extension,
  };
};

const uploadChunk = async (
  uploadUrl: string,
  videoUri: string,
  start: number,
  end: number,
  totalSize: number,
  mimeType: string,
  signal?: AbortSignal,
) => {
  const base64Chunk = await FileSystem.readAsStringAsync(videoUri, {
    encoding: FileSystem.EncodingType.Base64,
    position: start,
    length: end - start,
  });

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': mimeType,
      'Content-Range': `bytes ${start}-${end - 1}/${totalSize}`,
    },
    body: base64Chunk,
    signal,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }
};

const uploadWithRetry = async (
  uploadUrl: string,
  videoUri: string,
  size: number,
  mimeType: string,
  onProgress: (progress: number) => void,
  signal?: AbortSignal,
) => {
  const chunks = Math.max(1, Math.ceil(size / CHUNK_SIZE_BYTES));

  for (let index = 0; index < chunks; index += 1) {
    const start = index * CHUNK_SIZE_BYTES;
    const end = Math.min(size, start + CHUNK_SIZE_BYTES);

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        if (signal?.aborted) {
          throw new Error('Upload cancelled.');
        }
        await uploadChunk(
          uploadUrl,
          videoUri,
          start,
          end,
          size,
          mimeType,
          signal,
        );
        break;
      } catch (error) {
        if (attempt === 2 || signal?.aborted) {
          throw error;
        }
        await sleep(2 ** attempt * 500);
      }
    }

    onProgress((index + 1) / chunks);
  }
};

export const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthStore();

  const uploadVideo = async (options: UploadOptions): Promise<Entry | null> => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      if (!user) {
        throw new Error('Must be logged in to upload');
      }
      const { size, mimeType } = await validateVideo(options);

      const initResponse = await apiClient.post('/upload-init', {
        challengeId: options.challengeId,
        mimeType,
        size,
      });

      const uploadUrl = initResponse.data?.uploadUrl;
      const videoUrl = initResponse.data?.videoUrl;
      const thumbnailUrl = initResponse.data?.thumbnailUrl;
      if (typeof uploadUrl !== 'string' || typeof videoUrl !== 'string') {
        throw new Error('Upload could not be initialized.');
      }

      await uploadWithRetry(
        uploadUrl,
        options.videoUri,
        size,
        mimeType,
        progress => setUploadProgress(progress * 0.8),
        options.abortSignal,
      );

      const entryResponse = await apiClient.post('/entry-create', {
        challengeId: options.challengeId,
        videoUrl,
        thumbnailUrl,
        caption: options.caption,
        musicTrack: options.musicTrack || 'Original Audio',
        filterId: options.filterId,
      });

      setUploadProgress(0.9);
      const entry = entryResponse.data as Entry;
      setUploadProgress(1);
      setIsUploading(false);
      await FileSystem.deleteAsync(options.videoUri, { idempotent: true });

      return entry;
    } catch (err: unknown) {
      const uploadError = err instanceof Error ? err : new Error(String(err));
      logger.warn('Video upload failed', { message: uploadError.message });
      await FileSystem.deleteAsync(options.videoUri, {
        idempotent: true,
      }).catch(() => undefined);
      setError(uploadError);
      setIsUploading(false);
      return null;
    }
  };

  return { uploadVideo, isUploading, uploadProgress, error };
};
