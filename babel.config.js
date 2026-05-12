module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@stores': './src/stores',
            '@api': './src/api',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@theme': './src/theme',
            '@types': './src/types',
            '@assets': './assets',
          },
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx'],
        },
      ],
      // IMPORTANT: react-native-reanimated/plugin MUST be last
      'react-native-reanimated/plugin',
    ],
  };
};
