import MarkdownIt from 'markdown-it';

import {
  renderAboutPage,
  renderBlogDetailPage,
  renderBlogPage,
  renderHomePage,
  renderNotFoundPage,
  renderPapersPage,
  renderProjectDetailPage,
  renderProjectsPage,
} from './templates.js';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function normalizeRoutePath(routePath = '/') {
  if (!routePath || routePath === '/') {
    return '/';
  }

  const withLeadingSlash = routePath.startsWith('/') ? routePath : `/${routePath}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function buildCanonicalUrl(siteUrl, routePath = '/') {
  const normalizedPath = normalizeRoutePath(routePath);

  if (normalizedPath === '/') {
    return new URL('./', siteUrl).toString();
  }

  return new URL(normalizedPath.slice(1), siteUrl).toString();
}

export function getOutputFilePath(routePath = '/') {
  const normalizedPath = normalizeRoutePath(routePath);

  if (normalizedPath === '/') {
    return 'index.html';
  }

  return `${normalizedPath.slice(1)}index.html`;
}

// 所有静态页面共用同一份文档壳，便于统一维护 SEO 和资源引入。
export function renderHtmlDocument({
  lang = 'zh-CN',
  title,
  description,
  canonicalUrl,
  assetPaths,
  bodyClassName = '',
  bodyHtml,
}) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeCanonicalUrl = escapeHtml(canonicalUrl);
  const safeBodyClassName = escapeHtml(bodyClassName);

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <meta name="theme-color" content="#09090b" />
    <link rel="canonical" href="${safeCanonicalUrl}" />
    <link rel="icon" href="data:image/svg+xml,&lt;svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'&gt;&lt;text y='.9em' font-size='90'&gt;🦞&lt;/text&gt;&lt;/svg&gt;" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeCanonicalUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" />
    <link rel="stylesheet" href="${escapeHtml(assetPaths.css)}" />
    <script type="module" src="${escapeHtml(assetPaths.js)}"></script>
  </head>
  <body class="${safeBodyClassName}">
    ${bodyHtml}
  </body>
</html>`;
}

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

const BODY_CLASS_NAME =
  'bg-zinc-50 font-sans text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100';

export function buildSiteHref(siteUrl, routePath = '/') {
  const url = new URL(buildCanonicalUrl(siteUrl, routePath));
  return `${url.pathname}${url.search}${url.hash}`;
}

function renderPageDocument({
  store,
  assetPaths,
  routePath,
  title,
  description,
  bodyHtml,
}) {
  return {
    routePath,
    title,
    description,
    html: renderHtmlDocument({
      lang: 'zh-CN',
      title,
      description,
      canonicalUrl: buildCanonicalUrl(store.site.siteUrl, routePath),
      assetPaths,
      bodyClassName: BODY_CLASS_NAME,
      bodyHtml,
    }),
  };
}

export function createSitePages({ store, assetPaths }) {
  const buildHref = (routePath) => buildSiteHref(store.site.siteUrl, routePath);
  const renderMarkdown = (content = '') => markdown.render(content);
  const pages = [
    renderPageDocument({
      store,
      assetPaths,
      routePath: '/',
      title: store.site.title,
      description: store.site.description,
      bodyHtml: renderHomePage({ store, currentPath: '/', buildHref }),
    }),
    renderPageDocument({
      store,
      assetPaths,
      routePath: '/projects/',
      title: `Projects · ${store.site.title}`,
      description: '收录全部工程项目，每项包含问题背景、角色、技术方案与可验证链接。',
      bodyHtml: renderProjectsPage({
        store,
        currentPath: '/projects/',
        buildHref,
      }),
    }),
    renderPageDocument({
      store,
      assetPaths,
      routePath: '/papers/',
      title: `Papers · ${store.site.title}`,
      description: '统一结构记录论文阅读摘要、关键 idea 与个人评注。',
      bodyHtml: renderPapersPage({
        store,
        currentPath: '/papers/',
        buildHref,
      }),
    }),
    renderPageDocument({
      store,
      assetPaths,
      routePath: '/blog/',
      title: `Blog · ${store.site.title}`,
      description: '技术文章与研究方法论沉淀。',
      bodyHtml: renderBlogPage({
        store,
        currentPath: '/blog/',
        buildHref,
      }),
    }),
    renderPageDocument({
      store,
      assetPaths,
      routePath: '/about/',
      title: `About · ${store.site.title}`,
      description: store.site.about?.bio?.[0] || store.site.description,
      bodyHtml: renderAboutPage({
        store,
        currentPath: '/about/',
        buildHref,
      }),
    }),
  ];

  store.projects.forEach((project) => {
    pages.push(
      renderPageDocument({
        store,
        assetPaths,
        routePath: `/projects/${project.id}/`,
        title: `${project.title} · ${store.site.title}`,
        description: project.summary || store.site.description,
        bodyHtml: renderProjectDetailPage({
          store,
          currentPath: '/projects/',
          buildHref,
          project,
          detail: store.projectContent[project.id],
          renderMarkdown,
        }),
      })
    );
  });

  store.blogPosts.forEach((post) => {
    pages.push(
      renderPageDocument({
        store,
        assetPaths,
        routePath: `/blog/${post.slug}/`,
        title: `${post.title} · ${store.site.title}`,
        description: post.excerpt || store.site.description,
        bodyHtml: renderBlogDetailPage({
          store,
          currentPath: '/blog/',
          buildHref,
          post,
          renderMarkdown,
        }),
      })
    );
  });

  return pages;
}

export function createNotFoundDocument({ site, assetPaths }) {
  const buildHref = (routePath) => buildSiteHref(site.siteUrl, routePath);

  return renderHtmlDocument({
    lang: 'zh-CN',
    title: `404 · ${site.title}`,
    description: site.description,
    canonicalUrl: buildCanonicalUrl(site.siteUrl, '/404/'),
    assetPaths,
    bodyClassName: BODY_CLASS_NAME,
    bodyHtml: renderNotFoundPage({ site, buildHref }),
  });
}

export function createSitemapXml({ siteUrl, pages }) {
  const urls = pages
    .map(
      (page) =>
        `  <url>\n    <loc>${escapeHtml(buildCanonicalUrl(siteUrl, page.routePath))}</loc>\n  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function createRobotsTxt({ siteUrl }) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', siteUrl).toString()}\n`;
}
