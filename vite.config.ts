import { env } from 'node:process';
import { cloudflare } from '@cloudflare/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __COMMIT_SHA__: JSON.stringify(env.COMMIT_SHA ?? 'dev'),
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    reactRouter(),
  ],
  environments: {
    ssr: {
      build: {
        sourcemap: true,
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
