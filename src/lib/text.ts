export type RecordScore = { wins: number; losses: number; draws: number };

const PALETTES = [
  { bg: '#2a0c10', mid: '#8e1d2a', ink: '#ffd7a8' },
  { bg: '#1a100c', mid: '#a33b16', ink: '#ffe1c2' },
  { bg: '#10141c', mid: '#2c3d5c', ink: '#e4edf8' },
  { bg: '#1c1018', mid: '#6d2248', ink: '#ffd0dc' },
  { bg: '#12160f', mid: '#3c4a28', ink: '#f0d78a' },
  { bg: '#1a1010', mid: '#5c1518', ink: '#f4f4f4' },
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
