import type { SiteData } from './content';
import type { FeedAthlete, FeedEvent, FeedItem } from './types';

/** Prochain rendez-vous d'un combattant : une carte à venir qui le cite, sinon un article lié à un événement à venir. */
export type NextFight = {
  event: FeedEvent;
  opponent?: string;
  opponentRecord?: string;
  weightClass?: string;
  main: boolean;
};

export function nextFightFor(site: SiteData, profile: FeedAthlete, posts: FeedItem[]): NextFight | undefined {
  const upcoming = site.events
    .map((record) => record.event)
    .filter((event) => event.upcoming)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  for (const event of upcoming) {
    const bout = event.bouts.find((b) => b.redHref === profile.href || b.blueHref === profile.href);
    if (!bout) continue;
    const red = bout.redHref === profile.href;
    return {
      event,
      opponent: red ? bout.blueName : bout.redName,
      opponentRecord: red ? bout.blueRecord : bout.redRecord,
      weightClass: bout.weightClass,
      main: bout.main,
    };
  }

  const linked = upcoming.find((event) => posts.some((item) => item.eventId === event.id));
  return linked ? { event: linked, main: false } : undefined;
}

/** Libellé du palmarès selon le circuit (`recordScope`). */
export function recordLabel(profile: FeedAthlete): string {
  if (profile.recordScope === 'amateur') return 'Palmarès amateur';
  if (profile.recordScope === 'pro') return 'Palmarès pro';
  return 'Palmarès';
}

/** Record sans le suffixe « am. » (le libellé du palmarès le précise déjà). */
export function bareRecord(profile: FeedAthlete): string {
  return profile.record.replace(/ am\.$/, '');
}

/**
 * Phrase d'introduction construite uniquement à partir des champs de la fiche.
 * Sans pronom ni accord : le genre n'est pas une donnée de la fiche.
 */
export function athleteLede(profile: FeedAthlete): string {
  const palmares = profile.recordScope === 'amateur' ? 'palmarès amateur' : profile.recordScope === 'pro' ? 'palmarès pro' : 'palmarès';
  const club = profile.team ? `, ${profile.team}` : '';
  return `${profile.discipline}, ${profile.weightClass.toLowerCase()}${club} : ${profile.name} combat pour ${profile.org.name}, avec un ${palmares} de ${bareRecord(profile)}.`;
}

export function plural(n: number, word: string): string {
  return `${n} ${word}${n > 1 ? 's' : ''}`;
}
