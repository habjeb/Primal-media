export type Category = 'MMA' | 'Grappling';
export type Format = 'breve' | 'diffusion' | 'resultats' | 'decryptage';
export type Section = 'une' | 'fight';
export type Tile = 'landscape' | 'square' | 'portrait';
export type VideoProvider = 'youtube' | 'instagram' | 'fichier';

export type FeedOrg = {
  id: string;
  name: string;
  href: string;
  initials: string;
  place: string;
  kind: 'professionnelle' | 'amateur';
  description: string;
  example: boolean;
};

export type FeedAthlete = {
  id: string;
  name: string;
  nickname?: string;
  href: string;
  record: string;
  wins: number;
  losses: number;
  draws: number;
  discipline: Category;
  weightClass: string;
  team: string;
  country: string;
  example: boolean;
  org: FeedOrg;
};

export type AthleteFight = {
  date: Date;
  opponent: string;
  opponentRecord?: string;
  result: 'Victoire' | 'Défaite' | 'Nul';
  method: string;
  eventName: string;
  eventHref?: string;
  round?: number;
};

export type FeedItem = {
  id: string;
  href: string;
  title: string;
  description: string;
  pubDate: Date;
  author: string;
  category: Category;
  format: Format;
  section: Section;
  tile: Tile;
  spotlight: boolean;
  example: boolean;
  duration?: string;
  hasVideo: boolean;
  video?: { provider: VideoProvider; id?: string; duration: string };
  tags: string[];
  org: FeedOrg;
  athletes: FeedAthlete[];
  eventId?: string;
};

export type Story = {
  href: string;
  label: string;
  initials: string;
  seed: string;
  kind: 'athlete' | 'org';
};

export type ResolvedBout = {
  weightClass: string;
  redName: string;
  blueName: string;
  redRecord?: string;
  blueRecord?: string;
  redHref?: string;
  blueHref?: string;
  winner?: 'red' | 'blue' | 'draw';
  method?: string;
  round?: number;
  main: boolean;
};

export type FeedEvent = {
  id: string;
  href: string;
  title: string;
  description: string;
  date: Date;
  city: string;
  venue: string;
  discipline: 'MMA' | 'Grappling' | 'Mixte';
  example: boolean;
  org: FeedOrg;
  broadcast?: { when: string; channel: string };
  bouts: ResolvedBout[];
  upcoming: boolean;
};

export type NextEvent = {
  href: string;
  title: string;
  when: string;
  detail: string;
};
