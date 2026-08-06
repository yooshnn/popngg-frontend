import defineConfig from '@popngg/eslint-config';

export default defineConfig(
  {
    react: true,
    ignores: [
      '.wrangler/**',
      '.react-router/**',
      'build/**',
      'worker-configuration.d.ts',
    ],
  },
  {
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);
