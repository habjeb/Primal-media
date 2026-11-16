import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Projet GitHub Pages : https://habjeb.github.io/Primal-media/
// `site` reste l’origine ; `base` est le nom du dépôt.
const BASE = '/Primal-media';

export default defineConfig({
  site: 'https://habjeb.github.io',
  base: BASE,
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  // Anciennes adresses, remplacées par les rubriques (page HTML de redirection en statique).
  // Astro n’ajoute pas `base` à la destination : on la préfixe à la main.
  redirects: {
    '/evenements': `${BASE}/calendrier/`,
    '/actualites/mma': `${BASE}/mma/`,
    '/actualites/grappling': `${BASE}/grappling/`,
    '/actualites/videos': `${BASE}/videos/`,
  },
});
