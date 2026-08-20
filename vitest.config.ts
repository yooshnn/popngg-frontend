import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    env: {
      VITE_API_BASE_URL: 'https://api.test/',
    },
    include: ['app/**/*.test.{ts,tsx}'],
  },
});
