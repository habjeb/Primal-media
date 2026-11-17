export type RecordScore = { wins: number; losses: number; draws: number };

// Gris graphite (identité Primal : noir, blanc, argent), à peine teintés pour varier les visuels.
const PALETTES = [
  { bg: '#141416', mid: '#4a4a50', ink: '#f0f0f0' },
  { bg: '#161514', mid: '#55514c', ink: '#f1eeea' },
  { bg: '#131518', mid: '#454b54', ink: '#e9edf1' },
  { bg: '#161517', mid: '#504b53', ink: '#efecf1' },
  { bg: '#141614', mid: '#4b504a', ink: '#ecefe9' },
  { bg: '#171616', mid: '#5a5655', ink: '#f2f0ee' },
] as const;

export function palette(seed: string): { bg: string; mid: string; ink: string } {
  let hash = 0;
  for (const char of seed) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  return PALETTES[hash % PALETTES.length]!;
}

export function formatRecord(record: RecordScore): string {
  return record.draws > 0
    ? `${record.wins}-${record.losses}-${record.draws}`
    : `${record.wins}-${record.losses}`;
}

export function withRecord(name: string, record: string): string {
  return `${name} (${record})`;
}

export function initials(name: string): string {
  const parts = name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(/\s+/)
    .filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function excerpt(category: string, description: string): string {
  const prefix = `${category} – `;
  return description.startsWith(prefix) ? description : `${prefix}${description}`;
}

const YOUTUBE_ID = /^[A-Za-z0-9_-]{6,16}$/;
const INSTAGRAM_ID = /^[A-Za-z0-9_-]{5,30}$/;

export function safeVideoId(provider: string, id: string | undefined): string | null {
  if (!id || id.toUpperCase() === 'EXEMPLE') return null;
  if (provider === 'youtube' && YOUTUBE_ID.test(id)) return id;
  if (provider === 'instagram' && INSTAGRAM_ID.test(id)) return id;
  return null;
}

/** Découpe un titre pour qu’un record « (14-2) » ne soit jamais coupé en fin de ligne. */
export function titleParts(title: string): { text: string; record: boolean }[] {
  return title
    .split(/(\(\d+-\d+(?:-\d+)?(?: en amateur| am\.)?\))/)
    .filter(Boolean)
    .map((text) => ({ text, record: /^\(\d+-\d+(?:-\d+)?(?: en amateur| am\.)?\)$/.test(text) }));
}

/** Temps de lecture estimé (≈ 200 mots par minute), au moins 1 min. */
export function readingTime(body: string | undefined): number {
  const words = (body ?? '').replace(/[#*_`>-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
