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

const part = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('fr-FR', { ...paris, ...options }).format(date);

/** Morceaux d’une date pour les blocs du calendrier (heure de Paris). */
export function dateParts(date: Date) {
  return {
    weekday: part(date, { weekday: 'short' }).replace('.', ''),
    day: part(date, { day: 'numeric' }),
    month: part(date, { month: 'short' }).replace('.', ''),
    time: part(date, { hour: 'numeric', minute: '2-digit' }).replace(':', ' h '),
    monthLabel: part(date, { month: 'long', year: 'numeric' }),
    monthKey: part(date, { year: 'numeric', month: '2-digit' }),
  };
}

/** Date du jour (AAAA-MM-JJ) à l’heure de Paris. */
function parisDay(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { ...paris, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

/**
 * Nombre de jours de calendrier (heure de Paris) entre aujourd’hui et la date : 0 le jour même.
 * À utiliser quand l’heure de l’événement n’est pas connue, plutôt qu’un décompte en tranches de 24 h.
 */
export function calendarDaysUntil(date: Date, now: Date = new Date()): number {
  return Math.round((Date.parse(parisDay(date)) - Date.parse(parisDay(now))) / 86400000);
}
