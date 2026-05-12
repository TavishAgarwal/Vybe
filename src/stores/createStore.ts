import { create } from 'zustand';

interface CreateState {
  videoUri: string | null;
  effects: {
    filter: string | null;
    musicId: string | null;
    speed: number;
  };
  caption: string;
  challengeId: string | null;
  isProcessing: boolean;
  uploadProgress: number;

  setVideoUri: (uri: string) => void;
  setEffects: (effects: Partial<CreateState['effects']>) => void;
  setCaption: (caption: string) => void;
  setChallengeId: (id: string) => void;
  startProcessing: () => void;
  setProgress: (progress: number) => void;
  reset: () => void;
}

const initialState = {
  videoUri: null,
  effects: {
    filter: null,
    musicId: null,
    speed: 1,
  },
  caption: '',
  challengeId: null,
  isProcessing: false,
  uploadProgress: 0,
};

export const useCreateStore = create<CreateState>(set => ({
  ...initialState,

  setVideoUri: uri => set({ videoUri: uri }),
  setEffects: newEffects =>
    set(state => ({ effects: { ...state.effects, ...newEffects } })),
  setCaption: caption => set({ caption }),
  setChallengeId: id => set({ challengeId: id }),
  startProcessing: () => set({ isProcessing: true, uploadProgress: 0 }),
  setProgress: progress => set({ uploadProgress: progress }),
  reset: () => set(initialState),
}));
