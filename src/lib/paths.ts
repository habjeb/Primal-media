/** Préfixe les liens internes avec la base GitHub Pages (`/Primal-media/`). */
export function withBase(path: string = '/'): string {
  const base = import.meta.env.BASE_URL;
  if (!path || path === '/') return base;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${clean}`;
}

export function isCurrent(pathname: string, href: string): boolean {
  const target = withBase(href).replace(/\/$/, '') || '/';
  const current = pathname.replace(/\/$/, '') || '/';
  if (href === '/') return current === target;
  return current === target || current.startsWith(`${target}/`);
}
