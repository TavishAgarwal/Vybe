export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },

  // Preset text styles (original)
  h1: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    fontWeight: '700' as const,
  },
  h2: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 22,
    fontWeight: '600' as const,
  },
  h3: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    fontWeight: '400' as const,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    fontWeight: '500' as const,
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    fontWeight: '400' as const,
  },

  // Size scale (used as typography.sizes['xl'] etc.)
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    '2xl': 28,
    '3xl': 34,
    '4xl': 42,
  } as Record<string, number>,

  // Weight presets (used as ...typography.weights.bold)
  weights: {
    regular: { fontFamily: 'Inter_400Regular', fontWeight: '400' as const },
    medium: { fontFamily: 'Inter_500Medium', fontWeight: '500' as const },
    semiBold: { fontFamily: 'Inter_600SemiBold', fontWeight: '600' as const },
    bold: { fontFamily: 'Inter_700Bold', fontWeight: '700' as const },
    black: { fontFamily: 'Inter_700Bold', fontWeight: '900' as const },
  },
};
