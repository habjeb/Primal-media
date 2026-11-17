import type { APIRoute } from 'astro';
import { OG_SIZE } from '../../lib/cover';
import { logoDataUri, svgToJpeg } from '../../lib/og';

// Image de partage par défaut (accueil, rubriques, pages hors article) : /og/site.jpg
export const GET: APIRoute = async () => {
  const logo = await logoDataUri();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="${OG_SIZE.width}" height="${OG_SIZE.height}" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="glow" cx="0.28" cy="0.45" r="0.6">
        <stop offset="0%" stop-color="#3a2f31"/>
        <stop offset="100%" stop-color="#16171b"/>
      </radialGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#glow)"/>
    <g opacity="0.35">
      <polygon points="1180,0 1290,0 960,900 850,900" fill="#a94b43"/>
      <polygon points="1330,0 1374,0 1044,900 1000,900" fill="#d8b46e"/>
    </g>
    <image href="${logo}" x="130" y="170" width="420" height="560" preserveAspectRatio="xMidYMid meet"/>
    <g font-family="Barlow Condensed, sans-serif" font-weight="800">
      <text x="620" y="430" font-size="170" letter-spacing="4" fill="#ece7de">PRIMAL <tspan fill="#d0756b">MÉDIA</tspan></text>
      <text x="626" y="530" font-size="64" letter-spacing="6" fill="#d8b46e">L’ACTU FIGHT AMATEUR</text>
      <text x="626" y="610" font-size="46" letter-spacing="3" fill="#aaa49a">MMA · GRAPPLING · KICK &amp; BOXE</text>
    </g>
  </svg>`;
  return new Response(await svgToJpeg(svg), { headers: { 'Content-Type': 'image/jpeg' } });
};
