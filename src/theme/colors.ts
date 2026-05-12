export const colors = {
  primaryPurple: '#7F77DD',
  secondaryPink: '#D4537E',
  accentAmber: '#EF9F27',
  teal: '#1D9E75',

  light: {
    background: '#F8F7FF',
    surface: '#FFFFFF',
    textPrimary: '#1A1A2E',
    textSecondary: '#6B6B8A',
    border: '#E8E7F5',
  },

  dark: {
    background: '#0E0E14',
    surface: '#1A1A24',
    textPrimary: '#F0EFF8',
    textSecondary: '#9999B8',
    border: '#2A2A3E',
  },

  status: {
    danger: '#E24B4A',
    warning: '#EF9F27',
    positive: '#1D9E75',
    error: '#E24B4A', // Alias for danger
    success: '#1D9E75', // Alias for positive
  },

  // Gradient helper
  gradientPrimary: ['#7F77DD', '#D4537E'],

  // --- Semantic aliases used by components ---
  // These map the "component API" (e.g. colors.primary.base) to the raw tokens above.
  // Default mode is dark since the video feed uses a dark background.

  primary: {
    base: '#7F77DD',
    dark: '#6660C4',
    light: '#A09AEE',
  },

  secondary: {
    base: '#D4537E',
  },

  accent: {
    base: '#EF9F27',
  },

  background: {
    default: '#0E0E14',
    surface: '#1A1A24',
    elevated: '#24243A',
    secondary: '#1A1A24',
    tertiary: '#24243A',
  },

  text: {
    primary: '#F0EFF8',
    secondary: '#9999B8',
    inverse: '#FFFFFF',
    muted: '#6B6B8A',
  },

  border: {
    default: '#2A2A3E',
    light: '#3A3A52',
  },
};
