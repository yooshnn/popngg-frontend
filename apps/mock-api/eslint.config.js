import defineConfig from '@popngg/eslint-config';

export default defineConfig(
  {
    react: false,
  },
  {
    rules: {
      'no-console': 'off',
    },
  },
);
