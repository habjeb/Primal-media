import { octagon, seeded, surname, type Cover } from './cover';
import { palette } from './text';

/**
 * Visuel généré façon affiche de combat, sans photo, sous forme de chaîne SVG.
 * Utilisé à la fois dans les pages (composant `Visual.astro`) et pour les images
 * de partage PNG (`/og/<article>.jpg`), pour que les deux restent identiques.
 *
 * Tout est dérivé de `seed` : un même contenu garde le même visuel d’un build à l’autre.
 *
 * `text` :
 * - `full`    : grand nom en fond + nom, record et contexte en bas à gauche ;
 * - `texture` : seulement le grand nom en fond (quand la page pose déjà son titre dessus) ;
 * - `none`    : aucun texte.
 */
export type CoverSvgOptions = {
  seed: string;
  /** Texte de repli quand il n’y a pas de `cover`. */
  initials: string;
  /** Identifiant unique dans la page, pour les `id` des dégradés et motifs. */
  uid?: string;
  /** Texte alternatif ; vide = image décorative. */
  label?: string;
  cover?: Cover;
  text?: 'full' | 'texture' | 'none';
  /** Taille de sortie (attributs width/height). Absente = s’adapte au conteneur. */
  size?: { width: number; height: number };
  /** Habillage des images de partage : logo et mention « Contenu d’exemple ». */
  /** `logoHref` : logo en data URI (images de partage). */
  share?: { example: boolean; logoHref?: string };
  /**
   * Photo d’illustration en fond. Sur le site, la photo est une balise <img> placée sous le SVG :
   * le SVG reste transparent. Pour les images de partage, `href` (data URI) l’intègre au SVG,
   * et `credit` s’affiche en petit en bas à droite.
   */
  photo?: { href?: string; credit?: string };
};

const FONT = 'Barlow Condensed, Impact, sans-serif';

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function attrs(values: Record<string, string | number | undefined>): string {
  return Object.entries(values)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}="${esc(String(value))}"`)
    .join(' ');
}

export function coverSvg(options: CoverSvgOptions): string {
  const { seed, initials, uid = seed, label = '', cover, size, share, photo } = options;
  const text = options.text ?? 'full';
  const colors = palette(seed);
  const rand = seeded(seed);
  const id = `v${uid.replace(/[^a-zA-Z0-9]/g, '')}`;

  const discipline = cover?.discipline ?? 'MMA';
  const name = cover?.name ?? initials;
  const big = cover ? surname(cover.name) : initials;
  const nameSize = name.length > 16 ? 118 : name.length > 12 ? 134 : 150;

  // Composition : la cage (ou le tapis) à droite, les barres « // » à gauche.
  const cx = 880 + rand() * 380;
  const cy = 360 + rand() * 160;
  const r = 300 + rand() * 120;
  // Sur les images de partage, les barres passent à droite du logo.
  const slashSeed = 260 + rand() * 360;
  const slashX = share ? 700 + (slashSeed - 260) / 3 : slashSeed;
  const angle = rand() > 0.5 ? { x1: 0, y1: 0, x2: 1, y2: 1 } : { x1: 1, y1: 0, x2: 0, y2: 1 };
  const bigX = 30 + rand() * 160;
  const bigSize = big.length > 7 ? 470 : 560;
  const outer = octagon(cx, cy, r);
  const inner = octagon(cx, cy, r * 0.86);
  const slash = (x: number, w: number) => `${x},0 ${x + w},0 ${x + w - 330},900 ${x - 330},900`;

  const root = attrs({
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 1600 900',
    preserveAspectRatio: 'xMidYMid slice',
    width: size?.width,
    height: size?.height,
    role: label ? 'img' : undefined,
    'aria-label': label || undefined,
    'aria-hidden': label ? undefined : 'true',
  });

  // Ring de boxe vu de face : poteaux avant (coins rouge et bleu), poteaux arrière plus petits, cordes.
  const ring = () => {
    // Plus étroit que la cage, et recentré pour que les deux poteaux restent dans le cadre.
    const r = rBase * 0.72;
    const cx = Math.min(cxBase, 1480 - r * 1.4);
    const ropes = [0.6, 0.3, 0].map((k) => cy - r * k);
    const sag = (y: number, x1: number, x2: number, depth: number) =>
      `M${x1} ${y} Q${(x1 + x2) / 2} ${y + depth} ${x2} ${y}`;
    const fl = cx - r;
    const fr = cx + r;
    const bl = cx - r * 0.62;
    const br = cx + r * 0.62;
    return `<g fill="none" stroke="${colors.ink}" stroke-linecap="round">
        <g opacity="0.2" stroke-width="6">
          <path d="M${bl} ${cy - r * 0.62} V${cy + r * 0.25} M${br} ${cy - r * 0.62} V${cy + r * 0.25}"/>
          ${ropes.map((y) => `<path d="${sag(y - r * 0.02, bl, br, 10)}"/>`).join('')}
        </g>
        <path d="M${cx - r * 1.15} ${cy + r * 0.55} H${cx + r * 1.15} L${cx + r * 1.4} ${cy + r * 0.82} H${cx - r * 1.4} Z" stroke-width="8" opacity="0.35"/>
        <path d="M${fl} ${cy - r * 0.75} V${cy + r * 0.55} M${fr} ${cy - r * 0.75} V${cy + r * 0.55}" stroke-width="14" opacity="0.5"/>
        ${ropes.map((y) => `<path d="${sag(y, fl, fr, 26)}" stroke-width="8" opacity="0.45"/>`).join('')}
        <rect x="${fl - 16}" y="${cy - r * 0.78}" width="32" height="${r * 0.22}" rx="6" fill="#b5544b" stroke="none" opacity="0.7"/>
        <rect x="${fr - 16}" y="${cy - r * 0.78}" width="32" height="${r * 0.22}" rx="6" fill="#5b7fb8" stroke="none" opacity="0.7"/>
      </g>`;
  };

  const rBase = r;
  const cxBase = cx;
  const motif =
    discipline === 'Kick/Boxe'
      ? ring()
      : discipline === 'Grappling'
      ? `<g opacity="0.9">
          <rect width="1600" height="900" fill="url(#${id}-mat)" opacity="0.1"/>
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colors.ink}" stroke-width="12" opacity="0.45"/>
          <circle cx="${cx}" cy="${cy}" r="${r * 0.3}" fill="none" stroke="${colors.ink}" stroke-width="6" opacity="0.3"/>
        </g>`
      : `<g>
          <rect width="1600" height="900" fill="url(#${id}-mesh)" clip-path="url(#${id}-cage)" opacity="0.12"/>
          <polygon points="${outer}" fill="none" stroke="${colors.ink}" stroke-width="12" opacity="0.5"/>
          <polygon points="${inner}" fill="none" stroke="${colors.ink}" stroke-width="4" opacity="0.25"/>
        </g>`;

  const motifDefs =
    discipline === 'Grappling'
      ? `<pattern id="${id}-mat" width="200" height="100" patternUnits="userSpaceOnUse">
          <path d="M0 0 H200 M0 0 V100 M100 50 V100" stroke="${colors.ink}" stroke-width="3" fill="none"/>
        </pattern>`
      : `<pattern id="${id}-mesh" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 H46 M0 0 V46" stroke="${colors.ink}" stroke-width="3" fill="none"/>
        </pattern>
        <clipPath id="${id}-cage"><polygon points="${outer}"/></clipPath>`;

  const texture =
    text === 'none' || photo
      ? ''
      : `<text x="${bigX}" y="560" font-size="${bigSize}" font-family="${FONT}" font-weight="800" fill="none" stroke="${colors.ink}" stroke-width="3" opacity="0.22">${esc(big)}</text>`;

  const caption =
    text === 'full'
      ? `<g font-family="${FONT}" font-weight="800">
          ${cover?.kicker ? `<text x="70" y="640" font-size="64" letter-spacing="6" fill="#c3c3c9">${esc(cover.kicker.toUpperCase())}</text>` : ''}
          <text x="66" y="770" font-size="${nameSize}" fill="${colors.ink}">${esc(name.toUpperCase())}${
            cover?.record ? `<tspan dx="28" fill="#ffffff" opacity="0.85">${esc(cover.record)}</tspan>` : ''
          }</text>
        </g>`
      : '';

  // Habillage des images de partage. Le cadre 1200×630 rogne environ 30 unités en haut et en bas.
  const shareLayer = share
    ? `<g font-family="${FONT}" font-weight="800">
        ${
          share.logoHref
            ? `<image href="${share.logoHref}" x="58" y="46" width="98" height="131" preserveAspectRatio="xMidYMid meet"/>`
            : `<g transform="translate(66 74) scale(2.4)">
          <rect width="36" height="36" rx="8" fill="#a94b43"/>
          <path d="M7 29 L16 7 H20 L11 29 Z" fill="#fff"/>
          <path d="M16 29 L24 9 H28 L20 29 Z" fill="#d8b46e"/>
        </g>`
        }
        <text x="174" y="148" font-size="78" letter-spacing="3" fill="#f1f1ef">PRIMAL <tspan fill="#b9b9bf">MÉDIA</tspan></text>
        ${
          share.example
            ? `<g transform="translate(1534 74)">
                <rect x="-470" width="470" height="80" rx="40" fill="#000" opacity="0.75"/>
                <text x="-235" y="56" font-size="44" letter-spacing="3" fill="#d9b26a" text-anchor="middle">CONTENU D’EXEMPLE</text>
              </g>`
            : ''
        }
      </g>`
    : '';

  return `<svg ${root}>
    <defs>
      <linearGradient id="${id}-bg" ${attrs(angle)}>
        <stop offset="0%" stop-color="${colors.bg}"/>
        <stop offset="100%" stop-color="${colors.mid}"/>
      </linearGradient>
      <radialGradient id="${id}-spot" cx="${cx / 1600}" cy="${(cy - 260) / 900}" r="0.55">
        <stop offset="0%" stop-color="#fff" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="${id}-vig" cx="0.5" cy="0.5" r="0.75">
        <stop offset="55%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.6"/>
      </radialGradient>
      <linearGradient id="${id}-shade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="${photo ? '30%' : '45%'}" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity="${photo ? '0.8' : '0.6'}"/>
      </linearGradient>
      <pattern id="${id}-dots" width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="11" cy="11" r="4" fill="${colors.ink}"/>
      </pattern>
      <linearGradient id="${id}-fade" x1="1" y1="1" x2="0.3" y2="0">
        <stop offset="0%" stop-color="#fff"/>
        <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <mask id="${id}-mask"><rect width="1600" height="900" fill="url(#${id}-fade)"/></mask>
      ${motifDefs}
    </defs>
    ${
      photo
        ? `${photo.href ? `<image href="${photo.href}" width="1600" height="900" preserveAspectRatio="xMidYMid slice"/>` : ''}
    <rect width="1600" height="900" fill="#111113" opacity="0.2"/>`
        : `<rect width="1600" height="900" fill="url(#${id}-bg)"/>
    <rect width="1600" height="900" fill="url(#${id}-spot)"/>
    ${motif}
    <rect width="1600" height="900" fill="url(#${id}-dots)" mask="url(#${id}-mask)" opacity="0.16"/>`
    }
    <g opacity="${photo ? '0.35' : '0.6'}">
      <polygon class="slash-a" points="${slash(slashX, 110)}" fill="#e6e6ea" opacity="0.22"/>
      <polygon class="slash-b" points="${slash(slashX + 150, 44)}" fill="#9a9aa0" opacity="0.3"/>
    </g>
    ${texture}
    <rect width="1600" height="900" fill="url(#${id}-shade)"/>
    <rect width="1600" height="900" fill="url(#${id}-vig)"/>
    ${caption}
    ${shareLayer}
    ${
      photo?.credit
        ? `<text x="1560" y="852" font-family="Barlow Condensed, sans-serif" font-weight="700" font-size="26" fill="#f1f1ef" opacity="0.75" text-anchor="end">${esc(photo.credit)}</text>`
        : ''
    }
  </svg>`;
}
