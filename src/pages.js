import {
  store,
  renderMarkdown,
  renderRevealElements,
  renderStars,
  renderTags,
} from './main.js';

function appRoot() {
  return document.getElementById('app');
}

function placeholderVisual(title, subtitle = '') {
  return `
    <div class="flex h-full min-h-[220px] w-full flex-col justify-end rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-700 p-6 text-white">
      <p class="text-xs uppercase tracking-[0.3em] text-white/60">Portfolio v2</p>
      <h3 class="mt-3 font-serif text-2xl font-semibold">${title}</h3>
      ${subtitle ? `<p class="mt-2 max-w-md text-sm text-white/70">${subtitle}</p>` : ''}
    </div>
  `;
}

function renderCover(project, className = 'aspect-[4/3]') {
  if (project.cover) {
    return `<img src="${project.cover}" alt="${project.title}" class="h-full w-full object-cover" loading="lazy" />`;
  }

  return `
    <div class="${className} overflow-hidden rounded-3xl">
      ${placeholderVisual(project.title, project.subtitle)}
    </div>
  `;
}

function renderNavbar() {
  const { author, nav = [] } = store.site;

  return `
    <nav class="fixed left-4 right-4 top-4 z-50">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/85 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
        <button onclick="window.navigateTo('/')" class="shrink-0 font-serif text-lg font-semibold tracking-tight sm:text-xl">${author}</button>

        <div id="desktop-nav" class="hidden items-center gap-8 text-sm font-medium md:flex">
          ${nav
            .map(
              (item) => `<button onclick="window.navigateTo('${item.path}')" class="transition-colors hover:text-cta">${item.label}</button>`
            )
            .join('')}
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <button id="hamburger-btn" class="rounded-lg p-2 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 md:hidden" onclick="toggleMobileMenu()" aria-label="Open menu">
            <svg id="hamburger-icon" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            <svg id="close-icon" class="hidden h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <button class="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800" onclick="toggleTheme()" aria-label="Toggle theme">◐</button>
        </div>
      </div>

      <div id="mobile-menu" class="mx-auto mt-2 hidden max-w-6xl">
        <div class="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white/95 px-4 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95">
          ${nav
            .map(
              (item) => `<button onclick="closeMobileMenu();window.navigateTo('${item.path}')" class="text-left text-sm font-medium transition-colors hover:text-cta">${item.label}</button>`
            )
            .join('')}
        </div>
      </div>
    </nav>
  `;
}

function renderFooter() {
  return `
    <footer class="border-t border-zinc-200 px-6 py-8 dark:border-zinc-800">
      <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center text-sm text-zinc-500 md:flex-row md:text-left">
        <p>© 2026 ${store.site.author}. Academic Portfolio v2 draft.</p>
        <p>Built for clarity, credibility, and maintainability.</p>
      </div>
    </footer>
  `;
}

function renderProjectCard(project) {
  return `
    <article onclick="window.navigateTo('/projects/${project.id}')" class="project-card reveal cursor-pointer overflow-hidden rounded-3xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      <div class="aspect-[4/3] overflow-hidden">
        ${project.cover ? `<img src="${project.cover}" alt="${project.title}" class="h-full w-full object-cover transition-transform duration-500" loading="lazy" />` : placeholderVisual(project.title, project.subtitle)}
      </div>
      <div class="space-y-4 p-6">
        <div>
          <div class="mb-2 flex items-start justify-between gap-4">
            <div>
              <h3 class="font-serif text-xl font-semibold">${project.title}</h3>
              <p class="mt-1 text-sm text-zinc-500">${project.subtitle}</p>
            </div>
            <span class="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">${project.date}</span>
          </div>
          <p class="text-sm leading-6 text-zinc-600 dark:text-zinc-400">${project.summary}</p>
        </div>
        <div class="flex flex-wrap gap-2">${renderTags(project.tech)}</div>
        <div class="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <span>${project.role}</span>
          <a href="${project.github}" onclick="event.stopPropagation()" target="_blank" rel="noreferrer" class="font-medium text-blue-600 hover:underline dark:text-blue-400">GitHub ↗</a>
        </div>
      </div>
    </article>
  `;
}

function renderPaperCard(paper) {
  return `
    <article class="reveal rounded-3xl border border-zinc-200 bg-white p-6 transition-colors hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-400">
      <div class="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 class="font-serif text-lg font-semibold leading-snug">${paper.title}</h3>
          <p class="mt-1 text-xs text-zinc-500">${paper.authors} · ${paper.venue}</p>
        </div>
        <div class="shrink-0">${renderStars(paper.rating)}</div>
      </div>
      <p class="mb-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">${paper.summary}</p>
      <ul class="mb-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
        ${paper.keyIdeas.map((idea) => `<li class="flex gap-2"><span class="text-blue-500">→</span><span>${idea}</span></li>`).join('')}
      </ul>
      <p class="mb-4 text-sm italic text-zinc-500 dark:text-zinc-400">${paper.myTake}</p>
      <div class="flex items-center justify-between gap-4">
        <div class="flex flex-wrap gap-2">${renderTags(paper.tags)}</div>
        <a href="${paper.paperUrl}" target="_blank" rel="noreferrer" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">Source ↗</a>
      </div>
    </article>
  `;
}

function renderBlogCard(post) {
  return `
    <article onclick="window.navigateTo('/blog/${post.slug}')" class="reveal cursor-pointer rounded-3xl border border-zinc-200 bg-white p-6 transition-colors hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-400">
      <div class="mb-3 flex items-center gap-3 text-xs text-zinc-500">
        <span class="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">Blog</span>
        <span>${post.date}</span>
      </div>
      <h3 class="mb-3 font-serif text-xl font-semibold">${post.title}</h3>
      <p class="mb-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">${post.excerpt || ''}</p>
      <div class="flex flex-wrap gap-2">${renderTags(post.tags || [])}</div>
    </article>
  `;
}

function renderHero() {
  return `
    <section class="flex min-h-screen items-center justify-center px-6 pt-24">
      <div class="reveal max-w-4xl text-center">
        <p class="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-blue-600 dark:text-blue-400">Machine Vision · Research Portfolio</p>
        <h1 class="font-serif text-5xl font-bold leading-tight sm:text-6xl md:text-7xl">${store.site.author}</h1>
        <p class="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-400 sm:text-lg">${store.site.description}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          ${store.site.researchFocus
            .map(
              (focus) => `<span class="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">${focus}</span>`
            )
            .join('')}
        </div>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button onclick="window.navigateTo('/projects')" class="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">View Projects</button>
          <a href="${store.site.github}" target="_blank" rel="noreferrer" class="rounded-xl border border-zinc-300 px-6 py-3 font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">GitHub ↗</a>
        </div>
      </div>
    </section>
  `;
}

function renderHome() {
  const featuredProjects = store.projects.filter((project) => project.featured);
  const latestPosts = store.blogPosts.slice(0, 3);
  const selectedPapers = store.papers.slice(0, 4);

  appRoot().innerHTML = `
    ${renderNavbar()}
    <main>
      ${renderHero()}

      <section class="px-6 py-24">
        <div class="mx-auto max-w-6xl">
          <div class="mb-12 reveal">
            <h2 class="font-serif text-4xl font-bold">Featured Projects</h2>
            <p class="mt-3 text-zinc-600 dark:text-zinc-400">挑 3 个最能代表研究与工程能力的项目，先讲清楚价值，再展示实现。</p>
          </div>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            ${featuredProjects.map(renderProjectCard).join('')}
          </div>
        </div>
      </section>

      <section class="bg-zinc-100/60 px-6 py-24 dark:bg-zinc-900/50">
        <div class="mx-auto max-w-6xl">
          <div class="mb-12 reveal">
            <h2 class="font-serif text-4xl font-bold">Paper Reading</h2>
            <p class="mt-3 text-zinc-600 dark:text-zinc-400">聚焦目标检测、分割与视觉基础模型，保留我自己的评注，而不只是摘录摘要。</p>
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
            <p class="mt-3 text-zinc-600 dark:text-zinc-400">只保留可以公开分享的技术内容，不让 diary 稀释正式感。</p>
          </div>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            ${latestPosts.map(renderBlogCard).join('')}
          </div>
        </div>
      </section>

      ${renderFooter()}
    </main>
  `;
}

function renderProjectsPage() {
  appRoot().innerHTML = `
    ${renderNavbar()}
    <main class="min-h-screen px-6 pt-32">
      <div class="mx-auto max-w-6xl">
        <div class="mb-12 reveal">
          <h1 class="font-serif text-4xl font-bold md:text-5xl">Projects</h1>
          <p class="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">v2 只收录最能代表能力的项目，强调问题、角色、结果与可验证链接。</p>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          ${store.projects.map(renderProjectCard).join('')}
        </div>
      </div>
      ${renderFooter()}
    </main>
  `;
}

function renderProjectDetailPage(slug) {
  const project = store.projects.find((item) => item.id === slug);
  const detail = store.projectContent[slug];

  if (!project) {
    renderNotFound('Project not found');
    return;
  }

  appRoot().innerHTML = `
    ${renderNavbar()}
    <main class="min-h-screen px-6 pt-32">
      <div class="mx-auto max-w-4xl">
        <button onclick="window.navigateTo('/projects')" class="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-cta">← Back to Projects</button>

        <div class="mb-8 overflow-hidden rounded-3xl">
          ${project.cover ? `<img src="${project.cover}" alt="${project.title}" class="h-full w-full object-cover" />` : placeholderVisual(project.title, project.subtitle)}
        </div>

        <div class="mb-8 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <span>${project.date}</span>
          <span>•</span>
          <span>${project.role}</span>
          <span>•</span>
          <span class="capitalize">${project.status}</span>
        </div>

        <h1 class="font-serif text-4xl font-bold md:text-5xl">${project.title}</h1>
        <p class="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">${project.summary}</p>

        <div class="mt-6 flex flex-wrap gap-2">${renderTags(project.tech)}</div>

        <div class="mt-8 flex flex-wrap gap-4">
          <a href="${project.github}" target="_blank" rel="noreferrer" class="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">View on GitHub ↗</a>
          ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noreferrer" class="rounded-xl border border-zinc-300 px-6 py-3 font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">Live Demo ↗</a>` : ''}
        </div>

        <article class="article-content mt-12 rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          ${renderMarkdown(detail?.body || '## TODO\n\n待补充项目正文。')}
        </article>
      </div>
      ${renderFooter()}
    </main>
  `;
}

function renderPapersPage() {
  appRoot().innerHTML = `
    ${renderNavbar()}
    <main class="min-h-screen px-6 pt-32">
      <div class="mx-auto max-w-6xl">
        <div class="mb-12 reveal">
          <h1 class="font-serif text-4xl font-bold md:text-5xl">Paper Reading</h1>
          <p class="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">保留统一结构：问题、方法、关键 idea、我的判断。</p>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          ${store.papers.map(renderPaperCard).join('')}
        </div>
      </div>
      ${renderFooter()}
    </main>
  `;
}

function renderBlogPage() {
  appRoot().innerHTML = `
    ${renderNavbar()}
    <main class="min-h-screen px-6 pt-32">
      <div class="mx-auto max-w-6xl">
        <div class="mb-12 reveal">
          <h1 class="font-serif text-4xl font-bold md:text-5xl">Blog</h1>
          <p class="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">只保留可公开分享的技术文章与研究方法论。</p>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          ${store.blogPosts.map(renderBlogCard).join('')}
        </div>
      </div>
      ${renderFooter()}
    </main>
  `;
}

function renderBlogDetailPage(slug) {
  const post = store.blogPosts.find((item) => item.slug === slug);

  if (!post) {
    renderNotFound('Blog post not found');
    return;
  }

  appRoot().innerHTML = `
    ${renderNavbar()}
    <main class="min-h-screen px-6 pt-32">
      <div class="mx-auto max-w-3xl">
        <button onclick="window.navigateTo('/blog')" class="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-cta">← Back to Blog</button>
        <div class="mb-6 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <span class="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">Blog</span>
          <span>${post.date}</span>
        </div>
        <h1 class="font-serif text-4xl font-bold md:text-5xl">${post.title}</h1>
        <div class="mt-6 flex flex-wrap gap-2">${renderTags(post.tags || [])}</div>
        <article class="article-content mt-10 rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          ${renderMarkdown(post.body)}
        </article>
      </div>
      ${renderFooter()}
    </main>
  `;
}

function renderAboutPage() {
  const { about, avatar, email, github, linkedin, cv } = store.site;

  appRoot().innerHTML = `
    ${renderNavbar()}
    <main class="min-h-screen px-6 pt-32">
      <div class="mx-auto max-w-6xl">
        <div class="grid grid-cols-1 items-start gap-16 lg:grid-cols-[280px,1fr]">
          <div class="reveal">
            <div class="overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              ${avatar ? `<img src="${avatar}" alt="${store.site.author}" class="aspect-square w-full object-cover" loading="lazy" />` : `<div class="flex aspect-square items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-700 text-5xl font-serif text-white">K</div>`}
            </div>
          </div>

          <div class="reveal">
            <h1 class="font-serif text-4xl font-bold md:text-5xl">About</h1>
            <p class="mt-4 text-sm uppercase tracking-[0.25em] text-zinc-500">${about.education}</p>
            <div class="mt-8 space-y-4 text-base leading-8 text-zinc-600 dark:text-zinc-400">
              ${about.bio.map((paragraph) => `<p>${paragraph}</p>`).join('')}
            </div>

            <div class="mt-10 flex flex-wrap gap-3">
              ${about.skills
                .map(
                  (skill) => `<span class="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">${skill}</span>`
                )
                .join('')}
            </div>

            <div class="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <a href="mailto:${email}" class="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-400">
                <p class="text-sm font-medium">Email</p>
                <p class="mt-2 text-sm text-zinc-500">${email}</p>
              </a>
              <a href="${github}" target="_blank" rel="noreferrer" class="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-400">
                <p class="text-sm font-medium">GitHub</p>
                <p class="mt-2 text-sm text-zinc-500">@Garyko0730</p>
              </a>
              ${linkedin ? `<a href="${linkedin}" target="_blank" rel="noreferrer" class="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-400"><p class="text-sm font-medium">LinkedIn</p><p class="mt-2 text-sm text-zinc-500">Open profile ↗</p></a>` : `<div class="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40"><p class="text-sm font-medium">LinkedIn</p><p class="mt-2 text-sm">TODO: 补真实链接</p></div>`}
              ${cv ? `<a href="${cv}" target="_blank" rel="noreferrer" class="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-400"><p class="text-sm font-medium">CV</p><p class="mt-2 text-sm text-zinc-500">Open PDF ↗</p></a>` : `<div class="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40"><p class="text-sm font-medium">CV</p><p class="mt-2 text-sm">TODO: 补正式 PDF</p></div>`}
            </div>
          </div>
        </div>
      </div>
      ${renderFooter()}
    </main>
  `;
}

function renderNotFound(message = 'Page not found') {
  appRoot().innerHTML = `
    ${renderNavbar()}
    <main class="flex min-h-screen items-center justify-center px-6 pt-24">
      <div class="max-w-xl text-center">
        <p class="text-sm uppercase tracking-[0.25em] text-zinc-500">404</p>
        <h1 class="mt-4 font-serif text-4xl font-bold">${message}</h1>
        <p class="mt-4 text-zinc-600 dark:text-zinc-400">当前临时骨架只实现了 portfolio 主流程；你可以先回首页继续看结构。</p>
        <button onclick="window.navigateTo('/')" class="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">Back Home</button>
      </div>
    </main>
  `;
}

function setDocumentMeta(page, params = {}) {
  const baseTitle = store.site.title;
  const titles = {
    home: baseTitle,
    projects: `Projects · ${baseTitle}`,
    papers: `Papers · ${baseTitle}`,
    blog: `Blog · ${baseTitle}`,
    about: `About · ${baseTitle}`,
  };

  if (page === 'project-detail') {
    const project = store.projects.find((item) => item.id === params.slug);
    document.title = project ? `${project.title} · ${baseTitle}` : baseTitle;
    return;
  }

  if (page === 'blog-detail') {
    const post = store.blogPosts.find((item) => item.slug === params.slug);
    document.title = post ? `${post.title} · ${baseTitle}` : baseTitle;
    return;
  }

  document.title = titles[page] || baseTitle;
}

export function renderPage(page, params = {}) {
  setDocumentMeta(page, params);

  switch (page) {
    case 'home':
      renderHome();
      break;
    case 'projects':
      renderProjectsPage();
      break;
    case 'project-detail':
      renderProjectDetailPage(params.slug);
      break;
    case 'papers':
      renderPapersPage();
      break;
    case 'blog':
      renderBlogPage();
      break;
    case 'blog-detail':
      renderBlogDetailPage(params.slug);
      break;
    case 'about':
      renderAboutPage();
      break;
    default:
      renderNotFound();
      break;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  requestAnimationFrame(() => renderRevealElements());
}
