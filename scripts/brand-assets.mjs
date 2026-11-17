// Déclinaisons du logo à partir de src/assets/brand/logo-source.png (PNG détouré).
// Usage : npm run brand
// Produit :
//   src/assets/brand/logo.png      logo recadré (512 px de haut), utilisé par le site et les images de partage
//   public/favicon-32.png          favicon 32×32 (fond transparent)
//   public/favicon-192.png         icône 192×192 (fond transparent)
//   public/apple-touch-icon.png    icône iOS 180×180 (fond sombre : iOS ne gère pas la transparence)
//   public/logo-512.png            logo carré 512×512 pour les données structurées (éditeur)
import sharp from 'sharp';

const SRC = 'src/assets/brand/logo-source.png';
const BG = { r: 22, g: 23, b: 27, alpha: 1 }; // --bg du site
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

// Recadrage sur la partie opaque du logo.
const trimmed = await sharp(SRC).trim({ threshold: 1 }).png().toBuffer();
const { width, height } = await sharp(trimmed).metadata();
console.log(`logo recadré : ${width}×${height}`);

await sharp(trimmed).resize({ height: 512 }).png({ compressionLevel: 9 }).toFile('src/assets/brand/logo.png');

// Icône carrée : logo centré avec une marge, sur fond transparent ou sombre.
async function square(size, padding, background, file) {
  const inner = Math.round(size * (1 - 2 * padding));
  const logo = await sharp(trimmed).resize({ width: inner, height: inner, fit: 'contain', background: CLEAR }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: logo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(file);
  console.log(file);
}

await square(32, 0.02, CLEAR, 'public/favicon-32.png');
await square(192, 0.04, CLEAR, 'public/favicon-192.png');
await square(180, 0.1, BG, 'public/apple-touch-icon.png');
await square(512, 0.06, BG, 'public/logo-512.png');
