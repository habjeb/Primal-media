import { getCollection, getEntries, getEntry, type CollectionEntry } from 'astro:content';
import { formatDay, formatFull } from './dates';
import { matchFilter } from './filters';
import { withBase } from './paths';
import { formatRecord } from './text';
import type {
  AthleteFight,
  FeedAthlete,
  FeedEvent,
  FeedItem,
  FeedOrg,
  ResolvedBout,
  Story,
} from './types';

export type ArticleRecord = { item: FeedItem; entry: CollectionEntry<'articles'> };
export type AthleteRecord = { profile: FeedAthlete; fights: AthleteFight[]; entry: CollectionEntry<'athletes'> };
export type EventRecord = { event: FeedEvent; entry: CollectionEntry<'events'> };

export type SiteData = {
  items: FeedItem[];
  stories: Story[];
  articles: ArticleRecord[];
  athletes: AthleteRecord[];
  events: EventRecord[];
  organisations: { org: FeedOrg; entry: CollectionEntry<'organisations'> }[];
};

type OrgRef = { collection: 'organisations'; id: string };
type AthleteRef = { collection: 'athletes'; id: string };
type EventRef = { collection: 'events'; id: string };

let pending: Promise<SiteData> | undefined;

export function getSite(): Promise<SiteData> {
  if (import.meta.env.DEV) return loadSite();
  if (!pending) pending = loadSite();
  return pending;
}

async function loadSite(): Promise<SiteData> {
  const [orgEntries, athleteEntries, eventEntries, articleEntries] = await Promise.all([
    getCollection('organisations'),
    getCollection('athletes'),
    getCollection('events'),
    getCollection('articles'),
  ]);

  const orgById = new Map(orgEntries.map((entry) => [entry.id, toOrg(entry)]));
  const athleteById = new Map<string, FeedAthlete>();

  for (const entry of athleteEntries) {
    const org = orgById.get(entry.data.organisation.id);
    if (!org) continue;
    athleteById.set(entry.id, toAthlete(entry, org));
  }

  const events: EventRecord[] = [];
  for (const entry of eventEntries) {
    const org = orgById.get(entry.data.organisation.id);
    if (!org) continue;
    events.push({ event: await toEvent(entry, org, athleteById), entry });
  }
  const eventById = new Map(events.map((record) => [record.event.id, record.event]));

  const athletes: AthleteRecord[] = athleteEntries
    .map((entry) => {
      const profile = athleteById.get(entry.id);
      if (!profile) return undefined;
      return { profile, fights: toFights(entry, eventById), entry };
    })
    .filter((record): record is AthleteRecord => Boolean(record))
    .sort((a, b) => a.profile.name.localeCompare(b.profile.name, 'fr'));

  const articles: ArticleRecord[] = [];
  for (const entry of articleEntries) {
    if (entry.data.draft) continue;
    const org = orgById.get(entry.data.organisation.id);
    if (!org) continue;
    const linked = entry.data.athletes?.length ? await getEntries(entry.data.athletes) : [];
    const people = linked
      .map((athlete) => (athlete ? athleteById.get(athlete.id) : undefined))
      .filter((athlete): athlete is FeedAthlete => Boolean(athlete));
    articles.push({
      item: toItem(entry, org, people),
      entry,
    });
  }

  articles.sort((a, b) => b.item.pubDate.getTime() - a.item.pubDate.getTime());
  const items = articles.map((article) => article.item);

  const organisations = orgEntries
    .map((entry) => {
      const org = orgById.get(entry.id);
      return org ? { org, entry } : undefined;
    })
    .filter((record): record is { org: FeedOrg; entry: CollectionEntry<'organisations'> } => Boolean(record))
    .sort((a, b) => a.org.name.localeCompare(b.org.name, 'fr'));

  events.sort((a, b) => a.event.date.getTime() - b.event.date.getTime());

  return {
    items,
    stories: buildStories(organisations.map((record) => record.org), athletes, items),
    articles,
    athletes,
    events,
    organisations,
  };
}

function toOrg(entry: CollectionEntry<'organisations'>): FeedOrg {
  return {
    id: entry.id,
    name: entry.data.name,
    href: withBase(`/organisations/${entry.id}/`),
    initials: entry.data.mark,
    place: entry.data.place,
    kind: entry.data.kind,
    description: entry.data.description,
    example: entry.data.example,
  };
}

function toAthlete(entry: CollectionEntry<'athletes'>, org: FeedOrg): FeedAthlete {
  return {
    id: entry.id,
    name: entry.data.name,
    nickname: entry.data.nickname,
    href: withBase(`/athletes/${entry.id}/`),
    record: formatRecord(entry.data.record),
    wins: entry.data.record.wins,
    losses: entry.data.record.losses,
    draws: entry.data.record.draws,
    discipline: entry.data.discipline,
    weightClass: entry.data.weightClass,
    team: entry.data.team,
    country: entry.data.country,
    example: entry.data.example,
    org,
  };
}

function toFights(entry: CollectionEntry<'athletes'>, events: Map<string, FeedEvent>): AthleteFight[] {
  return (entry.data.fights ?? []).map((fight) => ({
    date: fight.date,
    opponent: fight.opponent,
    opponentRecord: fight.opponentRecord,
    result: fight.result,
    method: fight.method,
    eventName: fight.eventName,
    eventHref: fight.event ? events.get(fight.event.id)?.href : undefined,
    round: fight.round,
  }));
}

async function toEvent(
  entry: CollectionEntry<'events'>,
  org: FeedOrg,
  athletes: Map<string, FeedAthlete>,
): Promise<FeedEvent> {
  const bouts: ResolvedBout[] = [];
  for (const fight of entry.data.fights ?? []) {
    const red = fight.redAthlete ? athletes.get(fight.redAthlete.id) : undefined;
    const blue = fight.blueAthlete ? athletes.get(fight.blueAthlete.id) : undefined;
    bouts.push({
      weightClass: fight.weightClass,
      redName: red?.name ?? fight.red,
      blueName: blue?.name ?? fight.blue,
      redRecord: red?.record ?? fight.redRecord,
      blueRecord: blue?.record ?? fight.blueRecord,
      redHref: red?.href,
      blueHref: blue?.href,
      winner: fight.winner,
      method: fight.method,
      round: fight.round,
      main: Boolean(fight.main),
    });
  }

  return {
    id: entry.id,
    href: withBase(`/evenements/${entry.id}/`),
    title: entry.data.title,
    description: entry.data.description,
    date: entry.data.date,
    city: entry.data.city,
    venue: entry.data.venue,
    discipline: entry.data.discipline,
    example: entry.data.example,
    org,
    broadcast: entry.data.broadcast,
    bouts,
    upcoming: entry.data.date.getTime() >= Date.now(),
  };
}

function toItem(entry: CollectionEntry<'articles'>, org: FeedOrg, athletes: FeedAthlete[]): FeedItem {
  return {
    id: entry.id,
    href: withBase(`/actualites/${entry.id}/`),
    title: entry.data.title,
    description: entry.data.description,
    pubDate: entry.data.pubDate,
    author: entry.data.author,
    category: entry.data.category,
    format: entry.data.format,
    section: entry.data.section,
    tile: entry.data.tile,
    spotlight: entry.data.spotlight,
    example: entry.data.example,
    duration: entry.data.video?.duration,
    hasVideo: Boolean(entry.data.video),
    video: entry.data.video,
    tags: entry.data.tags ?? [],
    org,
    athletes,
    eventId: entry.data.event?.id,
  };
}

function buildStories(orgs: FeedOrg[], athletes: AthleteRecord[], items: FeedItem[]): Story[] {
  const orgStories: Story[] = orgs.map((org) => ({
    href: org.href,
    label: org.name,
    initials: org.initials,
    seed: org.id,
    kind: 'org',
  }));
  const ranked = [...athletes].sort((a, b) => latest(b.profile.id, items) - latest(a.profile.id, items));
  const athleteStories: Story[] = ranked.map(({ profile }) => ({
    href: profile.href,
    label: profile.name,
    initials: profile.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0] ?? '')
      .join('')
      .toUpperCase(),
    seed: profile.id,
    kind: 'athlete',
  }));
  return [...orgStories, ...athleteStories];
}

function latest(id: string, items: FeedItem[]): number {
  return items.find((item) => item.athletes.some((athlete) => athlete.id === id))?.pubDate.getTime() ?? 0;
}

export function relatedItems(item: FeedItem, items: FeedItem[], limit = 8): FeedItem[] {
  return items
    .filter((other) => other.id !== item.id)
    .map((other) => {
      let score = 0;
      if (other.org.id === item.org.id) score += 2;
      if (other.category === item.category) score += 1;
      if (other.athletes.some((athlete) => item.athletes.some((current) => current.id === athlete.id))) score += 3;
      return { other, score };
    })
    .sort((a, b) => b.score - a.score || b.other.pubDate.getTime() - a.other.pubDate.getTime())
    .slice(0, limit)
    .map((row) => row.other);
}

export function itemsForAthlete(id: string, items: FeedItem[]): FeedItem[] {
  return items.filter((item) => item.athletes.some((athlete) => athlete.id === id));
}

export function itemsForOrg(id: string, items: FeedItem[]): FeedItem[] {
  return items.filter((item) => item.org.id === id);
}

export function eventsForOrg(id: string, events: EventRecord[]): EventRecord[] {
  return events.filter((record) => record.event.org.id === id);
}

export function athletesForOrg(id: string, athletes: AthleteRecord[]): AthleteRecord[] {
  return athletes.filter((record) => record.profile.org.id === id);
}

export function filterItems(items: FeedItem[], filter: string): FeedItem[] {
  return items.filter((item) => matchFilter(item, filter));
}

export function eventWhen(event: FeedEvent): string {
  return formatFull(event.date);
}

export function eventDay(event: FeedEvent): string {
  return formatDay(event.date);
}

export async function resolveOrg(ref: OrgRef): Promise<CollectionEntry<'organisations'> | undefined> {
  return getEntry(ref);
}

export async function resolveAthletes(refs: AthleteRef[]): Promise<CollectionEntry<'athletes'>[]> {
  if (!refs.length) return [];
  const entries = await getEntries(refs);
  return entries.filter((entry): entry is CollectionEntry<'athletes'> => Boolean(entry));
}

export async function resolveEvent(ref: EventRef | undefined): Promise<CollectionEntry<'events'> | undefined> {
  if (!ref) return undefined;
  return getEntry(ref);
}
