import { PAGE_SIZE } from '../lib/filters';

function setup(root: HTMLElement) {
  const cards = [...root.querySelectorAll<HTMLElement>('[data-card]')];
  const blocks = [...root.querySelectorAll<HTMLElement>('[data-block]')];
  const more = root.querySelector<HTMLButtonElement>('[data-more]');
  const live = root.querySelector<HTMLElement>('[data-status]');
  const empty = root.querySelector<HTMLElement>('[data-empty]');
  const chips = [...root.querySelectorAll<HTMLAnchorElement>('[data-filter]')];
  const mode = root.dataset.mode ?? 'archive';
  const params = new URLSearchParams(location.search);
  let filter = mode === 'home' ? params.get('filtre') || 'tout' : root.dataset.active || 'tout';
  const known = new Set(chips.map((chip) => chip.dataset.filter));
  if (!known.has(filter)) filter = 'tout';
  let extra = 0;

  const matches = (card: HTMLElement) => {
    switch (filter) {
      case 'mma':
        return card.dataset.category === 'MMA';
      case 'grappling':
        return card.dataset.category === 'Grappling';
      case 'hexagone-mma':
      case 'duel-albertville':
        return card.dataset.org === filter;
      case 'resultats':
        return card.dataset.format === 'resultats';
      case 'videos':
        return card.dataset.video === 'true';
      case 'horaires':
        return card.dataset.format === 'diffusion';
      case 'une':
        return card.dataset.section === 'une';
      default:
        return true;
    }
  };

  const apply = () => {
    const pinUne = mode === 'home' && filter === 'tout';
    let paged = 0;
    let visible = 0;
    for (const card of cards) {
      if (!matches(card)) {
        card.hidden = true;
        continue;
      }
      const pinned = pinUne && card.dataset.section === 'une';
      if (pinned) {
        card.hidden = false;
        card.removeAttribute('data-deferred');
        visible += 1;
        continue;
      }
      const show = paged < PAGE_SIZE + extra;
      card.hidden = !show;
      if (show) card.removeAttribute('data-deferred');
      if (show) visible += 1;
      paged += 1;
    }
    for (const block of blocks) {
      const any = [...block.querySelectorAll<HTMLElement>('[data-card]')].some((card) => !card.hidden);
      block.hidden = !any;
    }
    const remaining = Math.max(0, paged - (PAGE_SIZE + extra));
    if (more) more.hidden = remaining === 0;
    if (empty) empty.hidden = visible !== 0;
    if (live) {
      if (visible === 0) live.textContent = 'Aucun contenu pour ce filtre.';
      else if (remaining > 0) live.textContent = `${visible} contenus affichés. ${remaining} de plus.`;
      else live.textContent = `${visible} contenu${visible > 1 ? 's' : ''} affiché${visible > 1 ? 's' : ''}.`;
    }
    for (const chip of chips) {
      if (chip.dataset.filter === filter) chip.setAttribute('aria-current', 'page');
      else chip.removeAttribute('aria-current');
    }
  };

  if (mode === 'home') {
    for (const chip of chips) {
      chip.addEventListener('click', (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        filter = chip.dataset.filter || 'tout';
        extra = 0;
        const url = new URL(location.href);
        if (filter === 'tout') url.searchParams.delete('filtre');
        else url.searchParams.set('filtre', filter);
        history.replaceState({}, '', url);
        apply();
        const first = root.querySelector<HTMLElement>('[data-card]:not([hidden]) h3 a, [data-card]:not([hidden]) .splash');
        first?.focus();
      });
    }
  }

  more?.addEventListener('click', () => {
    extra += PAGE_SIZE;
    apply();
  });

  if (more && 'IntersectionObserver' in window) {
    let locked = false;
    const observer = new IntersectionObserver((entries) => {
      const hit = entries.some((entry) => entry.isIntersecting);
      if (!hit) {
        locked = false;
        return;
      }
      if (locked || more.hidden) return;
      locked = true;
      extra += PAGE_SIZE;
      apply();
    });
    observer.observe(more);
  }

  apply();
}

export function setupFeed() {
  document.querySelectorAll<HTMLElement>('[data-feed]').forEach((root) => setup(root));
}
