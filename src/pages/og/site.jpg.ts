import type { APIRoute } from 'astro';
import { OG_SIZE } from '../../lib/cover';
import { logoDataUri, svgToJpeg } from '../../lib/og';

// Image de partage par défaut (accueil, rubriques, pages hors article) : /og/site.jpg
export const GET: APIRoute = async () => {
  const logo = await logoDataUri();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="${OG_SIZE.width}" height="${OG_SIZE.height}" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="glow" cx="0.28" cy="0.45" r="0.6">
        <stop offset="0%" stop-color="#2c2c30"/>
        <stop offset="100%" stop-color="#0d0d0e"/>
      </radialGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#glow)"/>
    <g opacity="0.25">
      <polygon points="1180,0 1290,0 960,900 850,900" fill="#e6e6ea"/>
      <polygon points="1330,0 1374,0 1044,900 1000,900" fill="#8d8d93"/>
    </g>
    <image href="${logo}" x="130" y="170" width="420" height="560" preserveAspectRatio="xMidYMid meet"/>
    <g font-family="Barlow Condensed, sans-serif" font-weight="800">
      <text x="620" y="430" font-size="170" letter-spacing="4" fill="#f1f1ef">PRIMAL <tspan fill="#b9b9bf">MÉDIA</tspan></text>
      <text x="626" y="530" font-size="64" letter-spacing="8" fill="#c3c3c9">L’ACTU FIGHT AMATEUR</text>
      <text x="626" y="610" font-size="46" letter-spacing="3" fill="#909096">MMA · GRAPPLING · KICK &amp; BOXE</text>
    </g>
  </svg>`;
  return new Response(await svgToJpeg(svg), { headers: { 'Content-Type': 'image/jpeg' } });
};
