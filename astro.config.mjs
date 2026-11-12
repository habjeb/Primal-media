import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Projet GitHub Pages : https://habjeb.github.io/Primal-media/
// `site` reste l’origine ; `base` est le nom du dépôt.
export default defineConfig({
  site: 'https://habjeb.github.io',
  base: '/Primal-media',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
});
