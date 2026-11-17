import type { ImageMetadata } from 'astro';
import { seeded } from './cover';
import type { Category } from './types';

/**
 * Photos d’illustration sous licence libre (Wikimedia Commons).
 *
 * Règles de sélection :
 * - licence CC0, domaine public, CC BY ou CC BY-SA, auteur et source notés ci-dessous ;
 * - pas de visage reconnaissable, pas d’enfant, pas de marque mise en avant : la photo illustre
 *   une discipline, jamais la personne nommée dans l’article ;
 * - images recadrées, redimensionnées et légèrement désaturées sur le site (adaptations) :
 *   les adaptations de photos CC BY-SA restent sous la même licence.
 */
export type Photo = {
  id: string;
  image: ImageMetadata;
  alt: string;
  disciplines: Category[];
  /** Point focal pour le recadrage (CSS object-position). */
  focus?: string;
  credit: {
    title: string;
    author: string;
    license: string;
    licenseUrl?: string;
    source: string;
  };
};

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });
const image = (id: string): ImageMetadata => {
  const file = files[`../assets/photos/${id}.jpg`];
  if (!file) throw new Error(`Photo introuvable : ${id}`);
  return file.default;
};

const BY_SA_4 = { license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.fr' };

export const PHOTOS: Photo[] = [
  {
    id: 'grappling-cle-de-bras',
    image: image('grappling-cle-de-bras'),
    alt: 'Deux grapplers en kimono au sol sur un tapis bleu, visages cachés.',
    disciplines: ['Grappling'],
    credit: {
      title: 'Brazilian Jiu-Jitsu Gi Competition-Armbar',
      author: 'parhessiastes',
      license: 'CC BY-SA 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/deed.fr',
      source: 'https://commons.wikimedia.org/wiki/File:Brazilian_Jiu-Jitsu_Gi_Competition-Armbar.jpg',
    },
  },
  {
    id: 'grappling-open-plein-air',
    image: image('grappling-open-plein-air'),
    alt: 'Combat de jiu-jitsu en plein air devant une foule, vu de loin.',
    disciplines: ['Grappling'],
    focus: '60% 70%',
    credit: {
      title: 'Jiu-jitsu brasileño 20180120 131743',
      author: 'Alejandro Martín Lodes',
      ...BY_SA_4,
      source: 'https://commons.wikimedia.org/wiki/File:Jiu-jitsu_brasile%C3%B1o_20180120_131743.jpg',
    },
  },
  {
    id: 'gants-cuir-anciens',
    image: image('gants-cuir-anciens'),
    alt: 'Une paire de vieux gants de boxe en cuir noir, lacés.',
    disciplines: ['Kick/Boxe', 'MMA'],
    credit: {
      title: 'Black boxing gloves',
      author: 'Airman 1st Class Kerelin Molina',
      license: 'Domaine public',
      source: 'https://commons.wikimedia.org/wiki/File:Black_boxing_gloves.jpg',
    },
  },
  {
    id: 'gants-sur-les-cordes',
    image: image('gants-sur-les-cordes'),
    alt: 'Des gants de boxe jaunes et noirs suspendus aux cordes d’un ring.',
    disciplines: ['Kick/Boxe'],
    focus: '40% 50%',
    credit: {
      title: 'Lace Up Boxing Gloves',
      author: 'Danielaarceo123',
      ...BY_SA_4,
      source: 'https://commons.wikimedia.org/wiki/File:Lace_Up_Boxing_Gloves.jpg',
    },
  },
  {
    id: 'salle-comble-ring',
    image: image('salle-comble-ring'),
    alt: 'Une salle comble plongée dans la pénombre, le ring éclairé au centre.',
    disciplines: ['MMA', 'Kick/Boxe'],
    focus: '50% 60%',
    credit: {
      title: 'Bonjasky vs Hari',
      author: 'Vanbasten 23',
      license: 'Domaine public',
      source: 'https://commons.wikimedia.org/wiki/File:Bonjasky_vs_Hari.jpg',
    },
  },
  {
    id: 'ring-sous-les-projecteurs',
    image: image('ring-sous-les-projecteurs'),
    alt: 'Un ring sous des faisceaux de lumière colorés, dans une salle de gala.',
    disciplines: ['Kick/Boxe', 'MMA'],
    focus: '45% 60%',
    credit: {
      title: 'Glory kickboxing',
      author: 'Seeuws',
      ...BY_SA_4,
      source: 'https://commons.wikimedia.org/wiki/File:Glory_kickboxing.jpg',
    },
  },
  {
    id: 'sac-suspendu-charpente',
    image: image('sac-suspendu-charpente'),
    alt: 'Un sac de frappe usé suspendu par des chaînes sous une charpente, en noir et blanc.',
    disciplines: ['MMA', 'Kick/Boxe'],
    focus: '50% 70%',
    credit: {
      title: 'Accroches sac',
      author: 'Roxe',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.fr',
      source: 'https://commons.wikimedia.org/wiki/File:Accroches_sac.JPG',
    },
  },
  {
    id: 'salle-de-boxe-sacs',
    image: image('salle-de-boxe-sacs'),
    alt: 'Une salle d’entraînement vide, avec des sacs de frappe suspendus.',
    disciplines: ['MMA', 'Kick/Boxe'],
    credit: {
      title: 'Boxing club of Peycho Bagdatov in Botevgrad 01',
      author: 'Dimitǎr Boevski',
      ...BY_SA_4,
      source: 'https://commons.wikimedia.org/wiki/File:Boxing_club_of_Peycho_Bagdatov_in_Botevgrad_01.jpg',
    },
  },
  {
    id: 'sac-rouge-mur',
    image: image('sac-rouge-mur'),
    alt: 'Un sac de frappe rouge suspendu contre un mur clair.',
    disciplines: ['Kick/Boxe', 'MMA'],
    focus: '25% 50%',
    credit: {
      title: 'Boxing wrong barbershop',
      author: 'Demidland',
      ...BY_SA_4,
      source: 'https://commons.wikimedia.org/wiki/File:Boxing_wrong_barbershop.jpg',
    },
  },
];

export function photoById(id: string): Photo | undefined {
  return PHOTOS.find((photo) => photo.id === id);
}

/**
 * Photo d’un contenu : celle fixée dans le frontmatter (`photo: <id>`), aucune (`photo: false`),
 * sinon une photo de la discipline, toujours la même pour un identifiant donné.
 */
export function photoFor(seed: string, category: Category, choice?: string | false): Photo | undefined {
  if (choice === false) return undefined;
  if (choice) {
    const photo = photoById(choice);
    if (!photo) throw new Error(`Photo inconnue dans le frontmatter : « ${choice} ». Voir src/lib/photos.ts.`);
    return photo;
  }
  const pool = PHOTOS.filter((photo) => photo.disciplines.includes(category));
  if (pool.length === 0) return undefined;
  return pool[Math.floor(seeded(`photo:${seed}`)() * pool.length)];
}

/**
 * Attribue une photo à chaque contenu du fil, dans l’ordre du fil, en évitant de reprendre une
 * photo déjà utilisée par les `window` contenus précédents (pas de doublon côte à côte).
 * Un choix explicite du frontmatter (`photo: <id>` ou `photo: false`) est toujours respecté.
 */
export function assignPhotos<T extends { id: string; category: Category; photo?: string | false }>(
  items: T[],
  window = 4,
): Map<string, string | undefined> {
  const result = new Map<string, string | undefined>();
  const recent: string[] = [];
  let turn = 0;
  for (const item of items) {
    let chosen: Photo | undefined;
    if (item.photo !== undefined) {
      chosen = photoFor(item.id, item.category, item.photo);
    } else {
      const pool = PHOTOS.filter((photo) => photo.disciplines.includes(item.category));
      for (let k = 0; k < pool.length && !chosen; k++) {
        const candidate = pool[(turn + k) % pool.length]!;
        if (!recent.includes(candidate.id)) chosen = candidate;
      }
      chosen ??= pool[turn % Math.max(1, pool.length)];
      turn += 1;
    }
    result.set(item.id, chosen?.id);
    if (chosen) {
      recent.push(chosen.id);
      if (recent.length > window) recent.shift();
    }
  }
  return result;
}
