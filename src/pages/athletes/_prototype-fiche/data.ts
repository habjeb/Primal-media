// PROTOTYPE — fiche combattant. Code jetable : ne pas fusionner dans main.
// Données partagées par les trois variantes (calculées à partir des contenus existants).
import type { SiteData } from '../../../lib/content';
import type { AthleteFight, FeedAthlete, FeedEvent, FeedItem } from '../../../lib/types';

export type MethodKind = 'KO/TKO' | 'Soumission' | 'Décision' | 'Autre';

/** Classement approximatif d'une méthode de victoire, d'après son libellé. */
export function methodKind(method: string): MethodKind {
  const m = method.toLowerCase();
  if (/\b(t?ko)\b|arrêt|arret|abandon|médical|medical/.test(m)) return 'KO/TKO';
  if (/décision|decision|points/.test(m)) return 'Décision';
  if (/soumission|étranglement|etranglement|clé|guillotine|triangle|armbar|kimura|choke/.test(m)) return 'Soumission';
  return 'Autre';
}

export type NextFight = {
  event: FeedEvent;
  opponent?: string;
  opponentRecord?: string;
  weightClass?: string;
  main: boolean;
};

export type TimelineEntry =
  | { kind: 'upcoming'; date: Date; next: NextFight }
  | { kind: 'fight'; date: Date; fight: AthleteFight }
  | { kind: 'post'; date: Date; item: FeedItem };

export type FicheData = {
  profile: FeedAthlete;
  fights: AthleteFight[];
  posts: FeedItem[];
  form: AthleteFight['result'][];
  winsBy: Record<MethodKind, number>;
  followedWins: number;
  streak?: { result: AthleteFight['result']; count: number };
  next?: NextFight;
  timeline: TimelineEntry[];
  scopeLabel: string;
};

export function ficheData(site: SiteData, profile: FeedAthlete, fightsIn: AthleteFight[], posts: FeedItem[]): FicheData {
  const fights = fightsIn.slice().sort((a, b) => b.date.getTime() - a.date.getTime());
  const form = fights.slice(0, 5).map((fight) => fight.result);

  const winsBy: Record<MethodKind, number> = { 'KO/TKO': 0, Soumission: 0, Décision: 0, Autre: 0 };
  for (const fight of fights) if (fight.result === 'Victoire') winsBy[methodKind(fight.method)] += 1;
  const followedWins = fights.filter((fight) => fight.result === 'Victoire').length;

  let streak: FicheData['streak'];
  if (fights[0]) {
    let count = 0;
    for (const fight of fights) {
      if (fight.result !== fights[0].result) break;
      count += 1;
    }
    streak = { result: fights[0].result, count };
  }

  // Prochain combat : une carte à venir qui le cite, sinon un article lié à un événement à venir.
  const upcoming = site.events.map((record) => record.event).filter((event) => event.upcoming);
  let next: NextFight | undefined;
  for (const event of upcoming) {
    const bout = event.bouts.find((b) => b.redHref === profile.href || b.blueHref === profile.href);
    if (!bout) continue;
    const red = bout.redHref === profile.href;
    next = {
      event,
      opponent: red ? bout.blueName : bout.redName,
      opponentRecord: red ? bout.blueRecord : bout.redRecord,
      weightClass: bout.weightClass,
      main: bout.main,
    };
    break;
  }
  if (!next) {
    const linked = posts.map((item) => upcoming.find((event) => event.id === item.eventId)).find(Boolean);
    if (linked) next = { event: linked, main: false };
  }

  const timeline: TimelineEntry[] = [
    ...(next ? [{ kind: 'upcoming' as const, date: next.event.date, next }] : []),
    ...fights.map((fight) => ({ kind: 'fight' as const, date: fight.date, fight })),
    ...posts.map((item) => ({ kind: 'post' as const, date: item.pubDate, item })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const scopeLabel = profile.recordScope === 'amateur' ? 'Palmarès amateur' : profile.recordScope === 'pro' ? 'Palmarès pro' : 'Palmarès';

  return { profile, fights, posts, form, winsBy, followedWins, streak, next, timeline, scopeLabel };
}

/**
 * Une phrase de présentation construite uniquement à partir des champs de la fiche.
 * Sans pronom ni accord : le genre n'est pas une donnée de la fiche.
 */
export function chapo(profile: FeedAthlete): string {
  const discipline = profile.discipline === 'Kick/Boxe' ? 'kick/boxe' : profile.discipline === 'Grappling' ? 'grappling' : 'MMA';
  const record = profile.record.replace(' am.', '');
  const palmares = profile.recordScope === 'amateur' ? 'palmarès amateur' : 'palmarès';
  return `${discipline.toUpperCase() === 'MMA' ? 'MMA' : discipline[0]!.toUpperCase() + discipline.slice(1)}, ${profile.weightClass.toLowerCase()}, ${profile.team} : ${profile.name} combat pour ${profile.org.name}, avec un ${palmares} de ${record}.`;
}
