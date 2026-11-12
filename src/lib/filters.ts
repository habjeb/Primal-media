import type { FeedItem } from './types';

export const PAGE_SIZE = 8;

export const FILTERS = [
  { id: 'tout', label: 'Tout', href: '/' },
  { id: 'mma', label: 'MMA', href: '/actualites/mma/' },
  { id: 'grappling', label: 'Grappling', href: '/actualites/grappling/' },
  { id: 'hexagone-mma', label: 'Hexagone', href: '/organisations/hexagone-mma/#publications' },
  { id: 'duel-albertville', label: 'Duel', href: '/organisations/duel-albertville/#publications' },
  { id: 'resultats', label: 'Résultats', href: '/actualites/resultats/' },
  { id: 'videos', label: 'Vidéos', href: '/actualites/videos/' },
  { id: 'horaires', label: 'Horaires', href: '/actualites/horaires/' },
  { id: 'une', label: 'À la une', href: '/actualites/a-la-une/' },
] as const;

export type FilterId = (typeof FILTERS)[number]['id'];

export const ARCHIVE_FILTERS: {
  id: Exclude<FilterId, 'tout' | 'hexagone-mma' | 'duel-albertville'>;
  slug: string;
  title: string;
  description: string;
}[] = [
  {
    id: 'mma',
    slug: 'mma',
    title: 'MMA',
    description: 'Brèves, horaires et résultats de MMA du fil Primal Média.',
  },
  {
    id: 'grappling',
    slug: 'grappling',
    title: 'Grappling',
    description: 'Le grappling amateur et pro du fil Primal Média.',
  },
  {
    id: 'resultats',
    slug: 'resultats',
    title: 'Tous les résultats',
    description: 'Cartes d’exemple : tous les résultats fictifs publiés sur le fil.',
  },
  {
    id: 'videos',
    slug: 'videos',
    title: 'Vidéos',
    description: 'Sujets vidéo du fil. Les lecteurs intégrés sont signalés comme exemples.',
  },
  {
    id: 'horaires',
    slug: 'horaires',
    title: 'Quelle heure, quelle chaîne ?',
    description: 'Horaires et diffuseurs fictifs des cartes d’exemple.',
  },
  {
    id: 'une',
    slug: 'a-la-une',
    title: 'À la une',
    description: 'Les sujets mis en avant sur le fil Primal Média.',
  },
];

export function matchFilter(item: FeedItem, filter: string): boolean {
  switch (filter) {
    case 'mma':
      return item.category === 'MMA';
    case 'grappling':
      return item.category === 'Grappling';
    case 'hexagone-mma':
    case 'duel-albertville':
      return item.org.id === filter;
    case 'resultats':
      return item.format === 'resultats';
    case 'videos':
      return item.hasVideo;
    case 'horaires':
      return item.format === 'diffusion';
    case 'une':
      return item.section === 'une';
    default:
      return true;
  }
}
