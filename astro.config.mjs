import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// Public site URL — override per environment. Used for canonical URLs & sitemap.
const SITE = process.env.PUBLIC_SITE_URL || 'https://www.northbounddata.com';

export default defineConfig({
  site: SITE,
  integrations: [
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
