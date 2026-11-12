const paris: Intl.DateTimeFormatOptions = { timeZone: 'Europe/Paris' };

export function formatRelative(date: Date, now: Date = new Date()): string {
  const delta = date.getTime() - now.getTime();
  const future = delta > 0;
  const seconds = Math.abs(delta) / 1000;
  const phrase = (value: number, unit: string) =>
    future ? `dans ${value} ${unit}` : `il y a ${value} ${unit}`;

  if (seconds < 45) return future ? 'dans un instant' : "à l'instant";
  if (seconds < 3600) return phrase(Math.max(1, Math.floor(seconds / 60)), 'min');
  if (seconds < 86400) return phrase(Math.max(1, Math.floor(seconds / 3600)), 'h');
  if (seconds < 86400 * 30) return phrase(Math.max(1, Math.floor(seconds / 86400)), 'j');
  return formatDay(date);
}

export function formatDay(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    ...paris,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatFull(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    ...paris,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
