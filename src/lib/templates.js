function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function placeholderVisual(title, subtitle = '') {
  return `
    <div class="flex h-full min-h-[220px] w-full flex-col justify-end rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-700 p-6 text-white">
      <p class="text-xs uppercase tracking-[0.3em] text-white/60">Portfolio v2</p>
      <h3 class="mt-3 font-serif text-2xl font-semibold">${escapeHtml(title)}</h3>
      ${subtitle ? `<p class="mt-2 max-w-md text-sm text-white/70">${escapeHtml(subtitle)}</p>` : ''}
    </div>
  `;
}

function renderProfilePlaceholder(site) {
  const authorInitial = escapeHtml((site.author || '').trim().slice(0, 1) || 'K');
  const [profileTitle, profileMeta] = site.researchFocus || [];
  const fallbackMeta = site.about?.education || site.description || '';
  return `
    <div class="profile-placeholder">
      <div class="profile-placeholder__initial">${authorInitial}</div>
      <p class="profile-placeholder__title">${escapeHtml(profileTitle || site.description || 'Academic Portfolio')}</p>
      <p class="profile-placeholder__meta">${escapeHtml(profileMeta || fallbackMeta)}</p>
    </div>
  `;
}

export function renderStars(rating) {
  if (!rating) return '';

  return Array.from({ length: 5 }, (_, index) => {
    const icon = index < rating ? '★' : '☆';
    return `<span class="rating-star">${icon}</span>`;
  }).join('');
}

export function renderTags(tags = []) {
  return tags
    .map(
      (tag) =>
        `<span class="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800">${escapeHtml(tag)}</span>`
    )
    .join('');
}

function isNavActive(navPath, currentPath) {
  if (navPath === '/') {
    return currentPath === '/';
  }

  return currentPath === navPath || currentPath.startsWith(navPath);
}

export function renderNavbar({ site, currentPath, buildHref }) {
  const navLinks = (site.nav || [])
    .map((item) => {
      const activeClass = isNavActive(item.path, currentPath)
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-zinc-600 dark:text-zinc-300';

      return `<a href="${buildHref(item.path)}" class="transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${activeClass}">${escapeHtml(item.label)}</a>`;
    })
    .join('');

  const mobileNavLinks = (site.nav || [])
    .map((item) => {
      const activeClass = isNavActive(item.path, currentPath)
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-zinc-700 dark:text-zinc-200';

      return `<a href="${buildHref(item.path)}" class="text-left text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${activeClass}">${escapeHtml(item.label)}</a>`;
    })
    .join('');

  return `
    <a href="#main-content" class="skip-link">Skip to content</a>
    <nav class="fixed left-4 right-4 top-4 z-50">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/85 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
        <a href="${buildHref('/')}" class="shrink-0 font-serif text-lg font-semibold tracking-tight sm:text-xl">${escapeHtml(site.author)}</a>

        <div id="desktop-nav" class="hidden items-center gap-8 text-sm font-medium md:flex">
          ${navLinks}
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <button id="hamburger-btn" class="rounded-lg p-2 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 md:hidden" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
            <svg data-menu-icon="open" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            <svg data-menu-icon="close" class="hidden h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <button class="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800" data-theme-toggle aria-label="Toggle theme">◐</button>
        </div>
      </div>

      <div id="mobile-menu" class="mx-auto mt-2 hidden max-w-6xl" data-mobile-menu>
        <div class="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white/95 px-4 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95">
          ${mobileNavLinks}
        </div>
      </div>
    </nav>
  `;
}

export function renderFooter(site) {
  return `
    <footer class="border-t border-zinc-200 px-6 py-8 dark:border-zinc-800">
      <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center text-sm text-zinc-500 md:flex-row md:text-left">
        <p>© 2026 ${escapeHtml(site.author)}. Academic Portfolio v2.</p>
        <p>Built for clarity, credibility, and maintainability.</p>
      </div>
    </footer>
  `;
}

function renderProjectCard(project, buildHref) {
  return `
    <a href="${buildHref(`/projects/${project.id}/`)}" class="project-card reveal block overflow-hidden rounded-3xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900">
      <div class="aspect-[4/3] overflow-hidden">
        ${project.cover ? `<img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.title)}" class="h-full w-full object-cover transition-transform duration-500" loading="lazy" />` : placeholderVisual(project.title, project.subtitle)}
      </div>
      <div class="space-y-4 p-6">
        <div>
          <div class="mb-2 flex items-start justify-between gap-4">
            <div>
              <h3 class="font-serif text-xl font-semibold">${escapeHtml(project.title)}</h3>
              <p class="mt-1 text-sm text-zinc-500">${escapeHtml(project.subtitle || '')}</p>
            </div>
            <span class="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">${escapeHtml(project.date || '')}</span>
          </div>
          <p class="text-sm leading-6 text-zinc-600 dark:text-zinc-400">${escapeHtml(project.summary || '')}</p>
        </div>
        <div class="flex flex-wrap gap-2">${renderTags(project.tech || [])}</div>
        <div class="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <span>${escapeHtml(project.role || '')}</span>
          <span class="font-medium text-blue-600 dark:text-blue-400">View details →</span>
        </div>
      </div>
    </a>
  `;
}

function renderPaperCard(paper) {
  return `
    <article class="reveal rounded-3xl border border-zinc-200 bg-white p-6 transition-colors hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-400">
      <div class="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 class="font-serif text-lg font-semibold leading-snug">${escapeHtml(paper.title)}</h3>
          <p class="mt-1 text-xs text-zinc-500">${escapeHtml(paper.authors || '')} · ${escapeHtml(paper.venue || '')}</p>
        </div>
        <div class="shrink-0">${renderStars(paper.rating)}</div>
      </div>
      <p class="mb-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">${escapeHtml(paper.summary || '')}</p>
      <ul class="mb-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
        ${(paper.keyIdeas || [])
          .map((idea) => `<li class="flex gap-2"><span class="text-blue-500">→</span><span>${escapeHtml(idea)}</span></li>`)
          .join('')}
      </ul>
      <p class="mb-4 text-sm italic text-zinc-500 dark:text-zinc-400">${escapeHtml(paper.myTake || '')}</p>
      <div class="flex items-center justify-between gap-4">
        <div class="flex flex-wrap gap-2">${renderTags(paper.tags || [])}</div>
        <a href="${escapeHtml(paper.paperUrl || '#')}" target="_blank" rel="noreferrer" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">Source ↗</a>
      </div>
    </article>
  `;
}

function renderBlogCard(post, buildHref) {
  return `
    <a href="${buildHref(`/blog/${post.slug}/`)}" class="reveal block rounded-3xl border border-zinc-200 bg-white p-6 transition-colors hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-400">
      <div class="mb-3 flex items-center gap-3 text-xs text-zinc-500">
        <span class="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">Blog</span>
        <span>${escapeHtml(post.date || '')}</span>
      </div>
      <h3 class="mb-3 font-serif text-xl font-semibold">${escapeHtml(post.title)}</h3>
      <p class="mb-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">${escapeHtml(post.excerpt || '')}</p>
      <div class="flex flex-wrap gap-2">${renderTags(post.tags || [])}</div>
    </a>
  `;
}

function renderHero(site, buildHref) {
  return `
    <section class="flex min-h-screen items-center justify-center px-6 pt-24">
      <div class="reveal max-w-4xl text-center">
        <p class="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-blue-600 dark:text-blue-400">Machine Vision · Research Portfolio</p>
        <h1 class="font-serif text-5xl font-bold leading-tight sm:text-6xl md:text-7xl">${escapeHtml(site.author)}</h1>
        <p class="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-400 sm:text-lg">${escapeHtml(site.description)}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          ${(site.researchFocus || [])
            .map(
              (focus) => `<span class="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">${escapeHtml(focus)}</span>`
            )
            .join('')}
        </div>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="${buildHref('/projects/')}" class="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">View Projects</a>
          <a href="${escapeHtml(site.github)}" target="_blank" rel="noreferrer" class="rounded-xl border border-zinc-300 px-6 py-3 font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">GitHub ↗</a>
        </div>
      </div>
    </section>
  `;
}

export function renderHomePage({ store, currentPath, buildHref }) {
  const featuredProjects = store.projects.filter((project) => project.featured);
  const latestPosts = store.blogPosts.slice(0, 3);
  const selectedPapers = store.papers.slice(0, 4);

  return `
    ${renderNavbar({ site: store.site, currentPath, buildHref })}
    <main id="main-content">
      ${renderHero(store.site, buildHref)}

      <section class="px-6 py-24">
        <div class="mx-auto max-w-6xl">
          <div class="mb-12 reveal">
            <h2 class="font-serif text-4xl font-bold">Featured Projects</h2>
            <p class="mt-3 text-zinc-600 dark:text-zinc-400">精选代表性项目，展示从问题定义到成果验证的完整工程实践。</p>
          </div>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            ${featuredProjects.map((project) => renderProjectCard(project, buildHref)).join('')}
          </div>
        </div>
      </section>

      <section class="bg-zinc-100/60 px-6 py-24 dark:bg-zinc-900/50">
        <div class="mx-auto max-w-6xl">
          <div class="mb-12 reveal">
            <h2 class="font-serif text-4xl font-bold">Paper Reading</h2>
            <p class="mt-3 text-zinc-600 dark:text-zinc-400">聚焦目标检测、分割与视觉基础模型，记录结构化阅读笔记与个人评注。</p>
          </div>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            ${selectedPapers.map(renderPaperCard).join('')}
          </div>
        </div>
      </section>

      <section class="px-6 py-24">
        <div class="mx-auto max-w-6xl">
          <div class="mb-12 reveal">
            <h2 class="font-serif text-4xl font-bold">Latest Writing</h2>
            <p class="mt-3 text-zinc-600 dark:text-zinc-400">技术实践与研究方法论沉淀，筛选可公开分享的内容。</p>
          </div>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            ${latestPosts.map((post) => renderBlogCard(post, buildHref)).join('')}
          </div>
        </div>
      </section>

      ${renderFooter(store.site)}
    </main>
  `;
}

export function renderProjectsPage({ store, currentPath, buildHref }) {
  return `
    ${renderNavbar({ site: store.site, currentPath, buildHref })}
    <main id="main-content" class="min-h-screen px-6 pt-32">
      <div class="mx-auto max-w-6xl">
        <div class="mb-12 reveal">
          <h1 class="font-serif text-4xl font-bold md:text-5xl">Projects</h1>
          <p class="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">收录全部工程项目，每项包含问题背景、角色、技术方案与可验证链接。</p>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          ${store.projects.map((project) => renderProjectCard(project, buildHref)).join('')}
        </div>
      </div>
      ${renderFooter(store.site)}
    </main>
  `;
}

export function renderProjectDetailPage({
  store,
  currentPath,
  buildHref,
  project,
  detail,
  renderMarkdown,
}) {
  return `
    ${renderNavbar({ site: store.site, currentPath, buildHref })}
    <main id="main-content" class="min-h-screen px-6 pt-32">
      <div class="mx-auto max-w-4xl">
        <a href="${buildHref('/projects/')}" class="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400">← Back to Projects</a>

        <div class="mb-8 overflow-hidden rounded-3xl">
          ${project.cover ? `<img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.title)}" class="h-full w-full object-cover" />` : placeholderVisual(project.title, project.subtitle)}
        </div>

        <div class="mb-8 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <span>${escapeHtml(project.date || '')}</span>
          <span>•</span>
          <span>${escapeHtml(project.role || '')}</span>
          <span>•</span>
          <span class="capitalize">${escapeHtml(project.status || '')}</span>
        </div>

        <h1 class="font-serif text-4xl font-bold md:text-5xl">${escapeHtml(project.title)}</h1>
        <p class="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">${escapeHtml(project.summary || '')}</p>

        <div class="mt-6 flex flex-wrap gap-2">${renderTags(project.tech || [])}</div>

        <div class="mt-8 flex flex-wrap gap-4">
          <a href="${escapeHtml(project.github || '#')}" target="_blank" rel="noreferrer" class="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">View on GitHub ↗</a>
          ${project.demo ? `<a href="${escapeHtml(project.demo)}" target="_blank" rel="noreferrer" class="rounded-xl border border-zinc-300 px-6 py-3 font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">Live Demo ↗</a>` : ''}
        </div>

        <article class="article-content mt-12 rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          ${renderMarkdown(detail?.body || '## TODO\n\n待补充项目正文。')}
        </article>
      </div>
      ${renderFooter(store.site)}
    </main>
  `;
}

export function renderPapersPage({ store, currentPath, buildHref }) {
  return `
    ${renderNavbar({ site: store.site, currentPath, buildHref })}
    <main id="main-content" class="min-h-screen px-6 pt-32">
      <div class="mx-auto max-w-6xl">
        <div class="mb-12 reveal">
          <h1 class="font-serif text-4xl font-bold md:text-5xl">Paper Reading</h1>
          <p class="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">统一结构：问题、方法、关键 idea 与个人评注。</p>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          ${store.papers.map(renderPaperCard).join('')}
        </div>
      </div>
      ${renderFooter(store.site)}
    </main>
  `;
}

export function renderBlogPage({ store, currentPath, buildHref }) {
  return `
    ${renderNavbar({ site: store.site, currentPath, buildHref })}
    <main id="main-content" class="min-h-screen px-6 pt-32">
      <div class="mx-auto max-w-6xl">
        <div class="mb-12 reveal">
          <h1 class="font-serif text-4xl font-bold md:text-5xl">Blog</h1>
          <p class="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">技术文章与研究方法论沉淀。</p>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          ${store.blogPosts.map((post) => renderBlogCard(post, buildHref)).join('')}
        </div>
      </div>
      ${renderFooter(store.site)}
    </main>
  `;
}

export function renderBlogDetailPage({
  store,
  currentPath,
  buildHref,
  post,
  renderMarkdown,
}) {
  return `
    ${renderNavbar({ site: store.site, currentPath, buildHref })}
    <main id="main-content" class="min-h-screen px-6 pt-32">
      <div class="mx-auto max-w-3xl">
        <a href="${buildHref('/blog/')}" class="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400">← Back to Blog</a>
        <div class="mb-6 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <span class="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">Blog</span>
          <span>${escapeHtml(post.date || '')}</span>
        </div>
        <h1 class="font-serif text-4xl font-bold md:text-5xl">${escapeHtml(post.title)}</h1>
        <div class="mt-6 flex flex-wrap gap-2">${renderTags(post.tags || [])}</div>
        <article class="article-content mt-10 rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          ${renderMarkdown(post.body || '')}
        </article>
      </div>
      ${renderFooter(store.site)}
    </main>
  `;
}

export function renderAboutPage({ store, currentPath, buildHref }) {
  const { about, avatar, email, github, linkedin, cv } = store.site;
  const availability = store.site?.availability ?? {};
  const linkedinPlaceholder = escapeHtml(availability.linkedinLabel || 'Not public yet');
  const cvPlaceholder = escapeHtml(availability.cvLabel || 'Available on request');

  return `
    ${renderNavbar({ site: store.site, currentPath, buildHref })}
    <main id="main-content" class="min-h-screen px-6 pt-32">
      <div class="mx-auto max-w-6xl">
        <div class="grid grid-cols-1 items-start gap-16 lg:grid-cols-[280px,1fr]">
          <div class="reveal">
            <div class="overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              ${avatar ? `<img src="${escapeHtml(avatar)}" alt="${escapeHtml(store.site.author)}" class="aspect-square w-full object-cover" loading="lazy" />` : renderProfilePlaceholder(store.site)}
            </div>
          </div>

          <div class="reveal">
            <h1 class="font-serif text-4xl font-bold md:text-5xl">About</h1>
            <p class="mt-4 text-sm uppercase tracking-[0.25em] text-zinc-500">${escapeHtml(about.education || '')}</p>
            <div class="mt-8 space-y-4 text-base leading-8 text-zinc-600 dark:text-zinc-400">
              ${(about.bio || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
            </div>

            <div class="mt-10 flex flex-wrap gap-3">
              ${(about.skills || [])
                .map(
                  (skill) => `<span class="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">${escapeHtml(skill)}</span>`
                )
                .join('')}
            </div>

            <div class="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <a href="mailto:${escapeHtml(email)}" class="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-400">
                <p class="text-sm font-medium">Email</p>
                <p class="mt-2 text-sm text-zinc-500">${escapeHtml(email)}</p>
              </a>
              <a href="${escapeHtml(github)}" target="_blank" rel="noreferrer" class="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-400">
                <p class="text-sm font-medium">GitHub</p>
                <p class="mt-2 text-sm text-zinc-500">@Garyko0730</p>
              </a>
              ${linkedin ? `<a href="${escapeHtml(linkedin)}" target="_blank" rel="noreferrer" class="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-400"><p class="text-sm font-medium">LinkedIn</p><p class="mt-2 text-sm text-zinc-500">Open profile ↗</p></a>` : `<div class="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40"><p class="text-sm font-medium">LinkedIn</p><p class="mt-2 text-sm">${linkedinPlaceholder}</p></div>`}
              ${cv ? `<a href="${escapeHtml(cv)}" target="_blank" rel="noreferrer" class="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-400"><p class="text-sm font-medium">CV</p><p class="mt-2 text-sm text-zinc-500">Open PDF ↗</p></a>` : `<div class="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40"><p class="text-sm font-medium">CV</p><p class="mt-2 text-sm">${cvPlaceholder}</p></div>`}
            </div>
          </div>
        </div>
      </div>
      ${renderFooter(store.site)}
    </main>
  `;
}

export function renderNotFoundPage({ site, buildHref }) {
  return `
    ${renderNavbar({ site, currentPath: '/404/', buildHref })}
    <main id="main-content" class="flex min-h-screen items-center justify-center px-6 pt-24">
      <div class="max-w-xl text-center">
        <p class="text-sm uppercase tracking-[0.25em] text-zinc-500">404</p>
        <h1 class="mt-4 font-serif text-4xl font-bold">Page not found</h1>
        <p class="mt-4 text-zinc-600 dark:text-zinc-400">页面未找到，请返回首页继续浏览。</p>
        <a href="${buildHref('/')}" class="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">Back Home</a>
      </div>
    </main>
  `;
}
