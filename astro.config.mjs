// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sehyunnoh.github.io',
  base: '/house-dance',
  integrations: [sitemap()],
});
