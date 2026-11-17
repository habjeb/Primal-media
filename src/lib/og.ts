import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

import { OG_SIZE } from './cover';

const FONTS = [
  'barlow-condensed-latin-800-normal.woff',
  'barlow-condensed-latin-ext-800-normal.woff',
];

/**
 * resvg ne lit que TrueType / OpenType, alors que Fontsource ne livre que du WOFF.
 * Le WOFF 1 n’est qu’un conteneur : chaque table de la police y est compressée
 * en zlib. On la décompresse et on reconstruit le fichier TrueType d’origine.
 * Spécification : https://www.w3.org/TR/WOFF/
 */
export function woffToSfnt(woff: Buffer): Buffer {
  if (woff.toString('ascii', 0, 4) !== 'wOFF') throw new Error('Fichier WOFF 1 attendu');
  const flavor = woff.readUInt32BE(4);
  const numTables = woff.readUInt16BE(12);

  const tables = Array.from({ length: numTables }, (_, i) => {
    const entry = 44 + i * 20;
    const offset = woff.readUInt32BE(entry + 4);
    const compLength = woff.readUInt32BE(entry + 8);
    const origLength = woff.readUInt32BE(entry + 12);
    const raw = woff.subarray(offset, offset + compLength);
    return {
      tag: woff.subarray(entry, entry + 4),
      checksum: woff.readUInt32BE(entry + 16),
      data: compLength < origLength ? inflateSync(raw) : raw,
    };
  });

  const pad = (n: number) => (n + 3) & ~3;
  const headerSize = 12 + numTables * 16;
  const total = tables.reduce((sum, table) => sum + pad(table.data.length), headerSize);
  const out = Buffer.alloc(total);

  // En-tête sfnt : les trois champs de recherche binaire découlent du nombre de tables.
  const entrySelector = Math.floor(Math.log2(numTables));
  const searchRange = 2 ** entrySelector * 16;
  out.writeUInt32BE(flavor, 0);
  out.writeUInt16BE(numTables, 4);
  out.writeUInt16BE(searchRange, 6);
  out.writeUInt16BE(entrySelector, 8);
  out.writeUInt16BE(numTables * 16 - searchRange, 10);

  let cursor = headerSize;
  tables.forEach((table, i) => {
    const record = 12 + i * 16;
    table.tag.copy(out, record);
    out.writeUInt32BE(table.checksum, record + 4);
    out.writeUInt32BE(cursor, record + 8);
    out.writeUInt32BE(table.data.length, record + 12);
    table.data.copy(out, cursor);
    cursor += pad(table.data.length);
  });
  return out;
}

let fontFiles: string[] | undefined;

/** Convertit une seule fois par build les polices du site en .ttf lisibles par resvg. */
function fonts(): string[] {
  if (fontFiles) return fontFiles;
  const require = createRequire(import.meta.url);
  const dir = join(tmpdir(), 'primal-media-og-fonts');
  mkdirSync(dir, { recursive: true });
  fontFiles = FONTS.map((file) => {
    const source = require.resolve(`@fontsource/barlow-condensed/files/${file}`);
    const target = join(dir, file.replace(/\.woff$/, '.ttf'));
    writeFileSync(target, woffToSfnt(readFileSync(source)));
    return target;
  });
  return fontFiles;
}

/**
 * SVG → JPEG. resvg dessine (avec la police du site), sharp compresse : le PNG brut
 * pèse ~450 Ko à cause des dégradés, trop lourd pour certains aperçus de liens.
 */
export async function svgToJpeg(svg: string): Promise<Uint8Array> {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: OG_SIZE.width },
    font: {
      fontFiles: fonts(),
      loadSystemFonts: false,
      defaultFontFamily: 'Barlow Condensed',
    },
  });
  const png = resvg.render().asPng();
  return new Uint8Array(await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer());
}

/**
 * Photo d’illustration en data URI pour resvg : lue depuis src/assets/photos (le build tourne à la
 * racine du projet), redimensionnée à 1600 px et légèrement désaturée comme sur le site.
 */
export async function photoDataUri(id: string): Promise<string> {
  const file = join(process.cwd(), 'src', 'assets', 'photos', `${id}.jpg`);
  const jpeg = await sharp(file).resize({ width: 1600 }).modulate({ saturation: 0.82 }).jpeg({ quality: 80 }).toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString('base64')}`;
}

let logoUri: string | undefined;

/** Logo Primal Média en data URI (PNG transparent, 256 px de haut), lu une fois par build. */
export async function logoDataUri(): Promise<string> {
  if (logoUri) return logoUri;
  const file = join(process.cwd(), 'src', 'assets', 'brand', 'logo.png');
  const png = await sharp(file).resize({ height: 256 }).png().toBuffer();
  logoUri = `data:image/png;base64,${png.toString('base64')}`;
  return logoUri;
}
