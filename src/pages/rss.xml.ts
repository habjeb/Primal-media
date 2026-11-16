import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { withBase } from '../lib/paths';

export async function GET(context: APIContext) {
  const articles = (await getCollection('articles'))
    .filter((article) => !article.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: 'Primal Média',
    description:
      'Fil d’actualité fight francophone : MMA, grappling, kick et boxe, côté combattants. Les entrées d’exemple sont fictives.',
    site: new URL(import.meta.env.BASE_URL, context.site ?? 'https://habjeb.github.io').toString(),
    trailingSlash: true,
    customData: '<language>fr-fr</language>',
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.pubDate,
      description: article.data.description,
      categories: [article.data.category],
      author: article.data.author,
      link: withBase(`/actualites/${article.id}/`),
    })),
  });
}
