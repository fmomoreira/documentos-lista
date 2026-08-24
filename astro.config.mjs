import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://documentacao.saojosedobelmonte.pe.gov.br',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
  },
  integrations: [
    tailwind({
      configFile: './tailwind.config.js',
    }),
  ],
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['html2canvas', 'lucide'],
          },
        },
      },
    },
  },
});
