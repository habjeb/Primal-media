import type { FeedItem } from './types';

/** Ce qu’un visuel généré affiche : un nom, un record, une ligne de contexte. */
export type Cover = {
  name: string;
  record?: string;
  kicker?: string;
  discipline: 'MMA' | 'Grappling' | 'Mixte';
};

const FORMAT_KICKER: Record<FeedItem['format'], string> = {
  breve: 'L’actu fight',
  diffusion: 'Quelle heure, quelle chaîne ?',
  resultats: 'Tous les résultats',
  decryptage: 'Tout savoir',
};

export function coverFor(item: FeedItem): Cover {
  const athlete = item.athletes[0];
  return {
    name: athlete?.name ?? item.org.name,
    record: athlete?.record,
    kicker: item.hasVideo ? 'Vidéo' : FORMAT_KICKER[item.format],
    discipline: item.category,
  };
}

/** Générateur pseudo-aléatoire déterministe : même identifiant, même visuel à chaque build. */
export function seeded(seed: string): () => number {
  let h = 2166136261;
  for (const char of seed) h = Math.imul(h ^ char.charCodeAt(0), 16777619) >>> 0;
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0;
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/** Sommets d’un octogone (la cage) centré en (cx, cy). */
export function octagon(cx: number, cy: number, r: number): string {
  return Array.from({ length: 8 }, (_, i) => {
    const a = Math.PI / 8 + (i * Math.PI) / 4;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

/** Dernier mot du nom, pour le grand lettrage en fond. */
export function surname(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts.length > 1 ? parts[parts.length - 1] : parts[0])!.toUpperCase();
}
