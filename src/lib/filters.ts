import type { Category, FeedItem, Format, Section } from './types';

export const PAGE_SIZE = 8;

/** Les trois disciplines couvertes, avec leur rubrique. */
export const DISCIPLINES: {
  id: 'mma' | 'grappling' | 'kick-boxe';
  category: Category;
  label: string;
  href: string;
  title: string;
  lede: string;
}[] = [
  {
    id: 'mma',
    category: 'MMA',
    label: 'MMA',
    href: '/mma/',
    title: 'L’actu MMA',
    lede: 'Galas amateurs, championnats et petites ligues pro : le MMA vu depuis les combattants.',
  },
  {
    id: 'grappling',
    category: 'Grappling',
    label: 'Grappling',
    href: '/grappling/',
    title: 'L’actu grappling',
    lede: 'Opens, tournois et soumissions : le grappling amateur et ses meilleurs profils.',
  },
  {
    id: 'kick-boxe',
    category: 'Kick/Boxe',
    label: 'Kick/Boxe',
    href: '/kick-boxe/',
    title: 'L’actu kick & boxe',
    lede: 'Kickboxing, K1 et boxe : les galas amateurs et les combattants qui montent.',
  },
];

export const FILTERS = [
  { id: 'tout', label: 'Tout', href: '/' },
  ...DISCIPLINES.map((d) => ({ id: d.id, label: d.label, href: d.href })),
  { id: 'resultats', label: 'Résultats', href: '/actualites/resultats/' },
  { id: 'videos', label: 'Vidéos', href: '/videos/' },
  { id: 'horaires', label: 'Horaires', href: '/actualites/horaires/' },
  { id: 'portraits', label: 'Portraits', href: '/portraits/' },
  { id: 'guides', label: 'Guides', href: '/guides/' },
  { id: 'une', label: 'À la une', href: '/actualites/a-la-une/' },
] as const;

export type FilterId = (typeof FILTERS)[number]['id'];

/** Filtres qui n’ont pas de rubrique à eux : une page d’archive sous /actualites/<slug>/. */
export const ARCHIVE_FILTERS: {
  id: FilterId;
  slug: string;
  title: string;
  description: string;
}[] = [
  {
    id: 'resultats',
    slug: 'resultats',
    title: 'Tous les résultats',
    description: 'Les comptes rendus de cartes publiés sur le fil.',
  },
  {
    id: 'horaires',
    slug: 'horaires',
    title: 'Quelle heure, quelle chaîne ?',
    description: 'Horaires et diffusion des prochaines cartes.',
  },
  {
    id: 'une',
    slug: 'a-la-une',
    title: 'À la une',
    description: 'Les sujets mis en avant sur le fil Primal Média.',
  },
];

/** Ce qu’il faut savoir d’un contenu pour le filtrer, côté serveur comme dans le navigateur. */
export type Filterable = {
  category: string;
  org: string;
  format: Format | string;
  video: boolean;
  section: Section | string;
};

export function matches(card: Filterable, filter: string): boolean {
  const discipline = DISCIPLINES.find((d) => d.id === filter);
  if (discipline) return card.category === discipline.category;
  switch (filter) {
    case 'resultats':
      return card.format === 'resultats';
    case 'videos':
      return card.video;
    case 'horaires':
      return card.format === 'diffusion';
    case 'portraits':
      return card.format === 'portrait';
    case 'guides':
      return card.format === 'guide';
    case 'une':
      return card.section === 'une';
    case 'tout':
      return true;
    default:
      // Identifiant d’organisation (liens « ?filtre=<organisation> »).
      return card.org === filter;
  }
}

export function matchFilter(item: FeedItem, filter: string): boolean {
  return matches(
    { category: item.category, org: item.org.id, format: item.format, video: item.hasVideo, section: item.section },
    filter,
  );
}
