import { env } from 'node:process';
import { cloudflare } from '@cloudflare/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    reactRouter(),
  ],
  optimizeDeps: {
    include: [
      'ky',
      '@tanstack/react-query',
      'i18next',
      'react-i18next',
      '@popngg/ui > tailwind-variants',
      '@popngg/ui > tailwind-merge',
      'lucide-react',
      'zod',
    ],
  },
  environments: {
    ssr: {
      build: {
        sourcemap: true,
      },
    },
  },
  define: {
    __COMMIT_SHA__: JSON.stringify(env.COMMIT_SHA ?? 'dev'),
  },
});
