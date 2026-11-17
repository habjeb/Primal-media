import type { APIRoute, GetStaticPaths } from 'astro';
import { coverFor, OG_SIZE } from '../../lib/cover';
import { coverSvg } from '../../lib/cover-svg';
import { getSite } from '../../lib/content';
import { logoDataUri, photoDataUri, svgToJpeg } from '../../lib/og';
import { photoById } from '../../lib/photos';
import type { FeedItem } from '../../lib/types';

// Une image de partage 1200×630 par article, générée au build : /og/<article>.jpg
export const getStaticPaths = (async () => {
  const site = await getSite();
  return site.articles.map(({ item }) => ({ params: { id: item.id }, props: { item } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const item = props.item as FeedItem;
  const photo = item.photoId ? photoById(item.photoId) : undefined;
  const svg = coverSvg({
    photo: photo
      ? {
          href: await photoDataUri(photo.id),
          credit: `Photo d’illustration : ${photo.credit.author} · ${photo.credit.license} · Wikimedia Commons`,
        }
      : undefined,
    seed: item.id,
    initials: item.org.initials,
    cover: coverFor(item),
    text: 'full',
    size: OG_SIZE,
    share: { example: item.example, logoHref: await logoDataUri() },
  });
  return new Response(await svgToJpeg(svg), { headers: { 'Content-Type': 'image/jpeg' } });
};
