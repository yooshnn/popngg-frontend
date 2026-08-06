import defineConfig from '@popngg/eslint-config';

export default defineConfig(
  { react: true },
  {
    name: 'popngg/ui',
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);
