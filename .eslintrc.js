module.exports = {
  root: true,
  extends: [
    'expo',
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    'react-native',
  ],
  rules: {
    // No any types — ever
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/func-call-spacing': 'off',

    // No unused variables
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ],

    // No console in production
    'no-console': 'error',

    // React hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // React Native specific
    'react-native/no-inline-styles': 'error',
    'react-native/no-color-literals': 'error',
    'react-native/no-raw-text': ['error', { skip: ['CustomText'] }],

    // No hardcoded strings in JSX (forces proper i18n-ready patterns)
    // Set to warn (not error) as full i18n not required for competition
    'react-native/no-raw-text': 'warn',

    // Prefer const
    'prefer-const': 'error',

    // No var
    'no-var': 'error',

    // Require explicit return types on exported functions
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // No non-null assertions without justification
    '@typescript-eslint/no-non-null-assertion': 'warn',
  },
  env: {
    'react-native/react-native': true,
    jest: true,
  },
  ignorePatterns: [
    'node_modules/',
    '.expo/',
    'dist/',
    'build/',
    'coverage/',
    'babel.config.js',
    'metro.config.js',
    'jest.config.js',
  ],
};
