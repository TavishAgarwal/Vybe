import { useEffect, useRef, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../api/supabase';
import { entriesApi } from '../api';
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
const ACCEPTED_VIDEO_EXTENSIONS = new Set(['mp4', 'mov']);

const inferVideoMime = (uri: string) => {
  const extension = uri.split('?')[0]?.split('.').pop()?.toLowerCase() ?? '';
  if (extension === 'mp4') {
    return 'video/mp4';
  }
  if (extension === 'mov') {
    return 'video/quicktime';
  }
  return 'video/mp4'; // default
};

const validateVideo = async (options: UploadOptions) => {
  const extension =
    options.videoUri.split('?')[0]?.split('.').pop()?.toLowerCase() ?? '';
  const mimeType = inferVideoMime(options.videoUri);

  if (options.videoUri.startsWith('http')) {
    return { size: 0, mimeType, extension };
  }

  if (!ACCEPTED_VIDEO_EXTENSIONS.has(extension)) {
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

export const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthStore();
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const safeSet = <T,>(setter: (v: T) => void, value: T) => {
    if (isMountedRef.current) {
      setter(value);
    }
  };

  const uploadVideo = async (options: UploadOptions): Promise<Entry | null> => {
    safeSet(setIsUploading, true);
    safeSet(setUploadProgress, 0);
    safeSet(setError, null);

    try {
      if (!user) {
        throw new Error('Must be logged in to upload');
      }

      const { mimeType, extension } = await validateVideo(options);
      safeSet(setUploadProgress, 0.1);

      let videoUrl = options.videoUri;

      if (!options.videoUri.startsWith('http')) {
        // Use FormData which is the most reliable way to upload files in React Native
        const formData = new FormData();
        formData.append('file', {
          uri: options.videoUri,
          name: `video.${extension}`,
          type: mimeType,
        } as any);

        safeSet(setUploadProgress, 0.3);

        // Upload to Supabase Storage
        const fileName = `${user.id}/${Date.now()}.${extension}`;
        const { error: storageError } = await supabase.storage
          .from('videos')
          .upload(fileName, formData);

        if (storageError) {
          throw new Error(`Storage upload failed: ${storageError.message}`);
        }
        safeSet(setUploadProgress, 0.7);

        // Get public URL for the uploaded video
        const { data: publicUrlData } = supabase.storage
          .from('videos')
          .getPublicUrl(fileName);
        videoUrl = publicUrlData.publicUrl;
      }
      
      safeSet(setUploadProgress, 0.8);

      // Create the entry in the database
      const entryResult = await entriesApi.createEntry({
        challenge_id: options.challengeId,
        user_id: user.id,
        video_url: videoUrl,
        thumbnail_url: videoUrl, // Use video URL as thumbnail for now
        caption: options.caption,
        status: 'live',
        vote_count: 0,
        music_track: options.musicTrack || 'Original Audio',
      });

      safeSet(setUploadProgress, 1);
      safeSet(setIsUploading, false);

      // Clean up local file
      if (!options.videoUri.startsWith('http')) {
        await FileSystem.deleteAsync(options.videoUri, { idempotent: true }).catch(
          () => undefined,
        );
      }

      return entryResult.data as unknown as Entry;
    } catch (err: unknown) {
      const uploadError = err instanceof Error ? err : new Error(String(err));
      logger.warn('Video upload failed', { message: uploadError.message });
      if (!options.videoUri.startsWith('http')) {
        await FileSystem.deleteAsync(options.videoUri, {
          idempotent: true,
        }).catch(() => undefined);
      }
      safeSet(setError, uploadError);
      safeSet(setIsUploading, false);
      throw uploadError;
    }
  };

  return { uploadVideo, isUploading, uploadProgress, error };
};
