interface Env {
  ASSETS: Fetcher;
}

const I18N: Record<string, Record<string, string>> = {
  en: {
    'apps.portty.flair': ' — Pluggable Architecture',
    'apps.portty.description':
      'A terminal emulator with pluggable backends for rendering, windowing, and fonts. Ships with SDL3 or Sokol, FreeType/HarfBuzz, and gamma-correct text.',
    'apps.ditty.flair': ' — Interactive REPL',
    'apps.ditty.description':
      'An interactive Lisp REPL with Flare-powered syntax highlighting. Evaluate expressions, define functions, and load libraries in real time.',
    'apps.mudlark.flair': ' — Bound for Adventure',
    'apps.mudlark.description':
      'Connect to MUDs and telnet servers with full scripting support. Aliases, triggers, speedwalk, and TinTin++ compatibility — all driven by Ditty Lisp.',
    'libs.coffer.flair': ' — Virtual Engine',
    'libs.coffer.description':
      'Virtual terminal engine: VT parser, UAX-aware grid, scrollback, reflow, sixel, Lottie, damage tracking, kitty keyboard. Zero dependencies.',
    'libs.boba.flair': ' — Taro Flavor',
    'libs.boba.description':
      'TUI library with Elm Architecture — runtime, styles, and components in one package. The Bubbletea, Lipgloss, and Bubbles of C.',
    'libs.ditty.flair': ' — Embeddable Lisp',
    'libs.ditty.description':
      'Embeddable Lisp interpreter with packages, condition system, tail-call optimization, and Flare syntax highlighting.',
    'apps.download': 'Download',
    'apps.source': 'Source',
    'community.project': 'project',
    'community.projects': 'projects',
    'community.view': 'View',
    'community.yours': 'Get your own page',
  },
};

const dict = I18N.en;

function capitalizeName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function repoUrl(repo: string): string {
  return `https://github.com/${repo}`;
}

function releaseUrl(repo: string): string {
  return `https://github.com/${repo}/releases/latest`;
}

function renderApps(
  apps: Array<{
    name: string;
    icon: string;
    iconType: string;
    repo: string;
    version: string;
    flair: string;
    description: string;
  }>,
): string {
  let html = '';
  for (const p of apps) {
    const displayName = capitalizeName(p.name);
    const flairText = dict[p.flair] || '';
    const descText = dict[p.description] || '';
    html += `<div class="feature-card" data-project="${escapeHtml(p.name)}">`;
    html += `<div class="feature-icon">`;
    if (p.iconType === 'img') {
      html += `<img src="${escapeHtml(p.icon)}" alt="${escapeHtml(displayName)}" width="48" height="48" />`;
    } else {
      html += escapeHtml(p.icon);
    }
    html += `</div>`;
    html += `<h3>${escapeHtml(displayName)}<span class="badge-version">${escapeHtml(p.version || '')}</span><span class="card-flair" data-i18n="${escapeHtml(p.flair)}">${flairText}</span></h3>`;
    html += `<p data-i18n="${escapeHtml(p.description)}">${descText}</p>`;
    html += `<div class="feature-actions">`;
    html += `<a href="${releaseUrl(p.repo)}" class="btn btn-small btn-primary" target="_blank" rel="noopener" data-i18n="apps.download">${escapeHtml(dict['apps.download'])}</a>`;
    html += `<a href="${repoUrl(p.repo)}" class="btn btn-small" target="_blank" rel="noopener" data-i18n="apps.source">${escapeHtml(dict['apps.source'])}</a>`;
    html += `</div></div>`;
  }
  return html;
}

function renderLibs(
  libs: Array<{
    name: string;
    icon: string;
    repo: string;
    version: string;
    flair: string;
    description: string;
  }>,
): string {
  let html = '';
  for (const p of libs) {
    const displayName = capitalizeName(p.name);
    const flairText = dict[p.flair] || '';
    const descText = dict[p.description] || '';
    html += `<a href="${repoUrl(p.repo)}" class="card" target="_blank" rel="noopener" data-project="${escapeHtml(p.name)}">`;
    html += `<div class="card-icon">${escapeHtml(p.icon)}</div>`;
    html += `<h3>${escapeHtml(displayName)}`;
    if (p.version) {
      html += `<span class="badge-version">${escapeHtml(p.version)}</span>`;
    }
    html += `<span class="card-flair" data-i18n="${escapeHtml(p.flair)}">${flairText}</span></h3>`;
    html += `<p data-i18n="${escapeHtml(p.description)}">${descText}</p>`;
    html += `</a>`;
  }
  return html;
}

function renderCommunity(
  users: Array<{
    username: string;
    displayName: string;
    tagline: string;
    avatarHash: string;
    projectCount: number;
  }>,
): string {
  let html = '';
  for (const u of users) {
    const initials = (u.displayName || u.username)
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const avatarUrl = `https://seccdn.libravatar.org/avatar/${u.avatarHash}?s=56&d=404`;
    const url = `${u.username}/`;
    html += `<a href="${escapeHtml(url)}" class="community-card">`;
    html += `<img src="${avatarUrl}" alt="${escapeHtml(u.displayName || u.username)}" class="community-avatar" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />`;
    html += `<div class="community-avatar-placeholder" style="display:none">${escapeHtml(initials)}</div>`;
    html += `<h3>${escapeHtml(u.displayName || u.username)}</h3>`;
    if (u.tagline) {
      html += `<p class="community-card-tagline">${escapeHtml(u.tagline)}</p>`;
    }
    const label = `${u.projectCount || 0} ${u.projectCount === 1 ? dict['community.project'] : dict['community.projects']}`;
    html += `<p class="community-card-count">${escapeHtml(label)}</p>`;
    html += `<span class="btn btn-small btn-primary">${escapeHtml(dict['community.view'])}</span>`;
    html += `</a>`;
  }
  html += `<a href="https://github.com/chestso/chest-so-site" class="community-card community-card-yours" target="_blank" rel="noopener"><div class="yours-icon">+</div><div class="yours-text">${escapeHtml(dict['community.yours'])}</div></a>`;
  return html;
}

function buildJsonLd(
  projects: {
    apps: Array<{ name: string; repo: string; version: string }>;
    libs: Array<{ name: string; repo: string; version: string }>;
  },
  url: string,
): string {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Chest',
    url: 'https://chest.so',
    logo: 'https://chest.so/assets/banner.webp',
    sameAs: ['https://github.com/chestso', 'https://codeberg.org/chestso'],
  };
  const apps = projects.apps.map((p) => ({
    '@type': 'SoftwareApplication',
    name: capitalizeName(p.name),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Linux, macOS, Windows',
    url: repoUrl(p.repo),
    version: p.version.replace(/^v/, ''),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }));
  const libs = projects.libs.map((p) => ({
    '@type': 'SoftwareSourceCode',
    name: capitalizeName(p.name),
    programmingLanguage: 'C',
    url: repoUrl(p.repo),
    version: p.version.replace(/^v/, ''),
    codeRepository: repoUrl(p.repo),
  }));
  const items = [org, ...apps, ...libs];
  return JSON.stringify(items);
}

function isCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return (
    ua.includes('bot') ||
    ua.includes('crawler') ||
    ua.includes('spider') ||
    ua.includes('slurp') ||
    ua.includes('facebookexternalhit') ||
    ua.includes('twitterbot') ||
    ua.includes('linkedinbot') ||
    ua.includes('telegrambot') ||
    ua.includes('whatsapp') ||
    ua.includes('discordbot') ||
    ua.includes('preview') ||
    ua.includes('fetch')
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Pass through non-HTML requests unchanged
    if (
      !url.pathname.endsWith('/') &&
      !url.pathname.endsWith('.html') &&
      url.pathname !== '/'
    ) {
      return env.ASSETS.fetch(request);
    }

    const userAgent = request.headers.get('user-agent') || '';
    const shouldPrerender = isCrawler(userAgent);

    // Fetch the static HTML asset
    const response = await env.ASSETS.fetch(request);

    if (!shouldPrerender) {
      return response;
    }

    // Fetch data files for pre-rendering
    const [projectsRes, usersRes] = await Promise.all([
      env.ASSETS.fetch(new Request(new URL('/projects.json', url.origin))),
      env.ASSETS.fetch(new Request(new URL('/users.json', url.origin))),
    ]);

    let projects = { apps: [] as any[], libs: [] as any[] };
    let users: any[] = [];

    try {
      if (projectsRes.ok) projects = await projectsRes.json();
    } catch {}
    try {
      if (usersRes.ok) users = await usersRes.json();
    } catch {}

    const appsHtml = renderApps(projects.apps);
    const libsHtml = renderLibs(projects.libs);
    const communityHtml = renderCommunity(users);
    const jsonLd = buildJsonLd(projects, url.origin);

    return new HTMLRewriter()
      .on('#apps-grid', {
        element(element) {
          element.setInnerContent(appsHtml, { html: true });
        },
      })
      .on('#libs-grid', {
        element(element) {
          element.setInnerContent(libsHtml, { html: true });
        },
      })
      .on('#community-grid', {
        element(element) {
          element.setInnerContent(communityHtml, { html: true });
        },
      })
      .on('head', {
        element(element) {
          element.append(jsonLd, { html: true });
        },
      })
      .transform(response);
  },
};
