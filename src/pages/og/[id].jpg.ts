import type { APIRoute, GetStaticPaths } from 'astro';
import { coverFor, OG_SIZE } from '../../lib/cover';
import { coverSvg } from '../../lib/cover-svg';
import { getSite } from '../../lib/content';
import { svgToJpeg } from '../../lib/og';
import type { FeedItem } from '../../lib/types';

// Une image de partage 1200×630 par article, générée au build : /og/<article>.jpg
export const getStaticPaths = (async () => {
  const site = await getSite();
  return site.articles.map(({ item }) => ({ params: { id: item.id }, props: { item } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const item = props.item as FeedItem;
  const svg = coverSvg({
    seed: item.id,
    initials: item.org.initials,
    cover: coverFor(item),
    text: 'full',
    size: OG_SIZE,
    share: { example: item.example },
  });
  return new Response(await svgToJpeg(svg), { headers: { 'Content-Type': 'image/jpeg' } });
};
