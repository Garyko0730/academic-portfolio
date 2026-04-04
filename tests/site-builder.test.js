import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildCanonicalUrl,
  createSitePages,
  getOutputFilePath,
  renderHtmlDocument,
} from '../src/lib/site-builder.js';

test('buildCanonicalUrl joins siteUrl and route path correctly', () => {
  assert.equal(
    buildCanonicalUrl('https://garyko0730.github.io/academic-portfolio/', '/blog/post-a/'),
    'https://garyko0730.github.io/academic-portfolio/blog/post-a/'
  );
});

test('getOutputFilePath maps routes to index.html files', () => {
  assert.equal(getOutputFilePath('/'), 'index.html');
  assert.equal(getOutputFilePath('/blog/'), 'blog/index.html');
  assert.equal(getOutputFilePath('/blog/post-a/'), 'blog/post-a/index.html');
});

test('renderHtmlDocument includes route-specific meta tags', () => {
  const html = renderHtmlDocument({
    lang: 'zh-CN',
    title: '文章标题 · KoPang',
    description: '文章摘要',
    canonicalUrl: 'https://garyko0730.github.io/academic-portfolio/blog/post-a/',
    assetPaths: {
      css: '/academic-portfolio/assets/app.css',
      js: '/academic-portfolio/assets/app.js',
    },
    bodyClassName: 'bg-zinc-50',
    bodyHtml: '<main><h1>文章标题</h1></main>',
  });

  assert.match(html, /<title>文章标题 · KoPang<\/title>/);
  assert.match(html, /name="description" content="文章摘要"/);
  assert.match(
    html,
    /property="og:url" content="https:\/\/garyko0730\.github\.io\/academic-portfolio\/blog\/post-a\/"/
  );
  assert.match(html, /<main><h1>文章标题<\/h1><\/main>/);
});

test('createSitePages generates static routes for list and detail pages', () => {
  const pages = createSitePages({
    store: {
      site: {
        title: 'KoPang · Academic Portfolio',
        author: 'KoPang',
        description: '站点描述',
        siteUrl: 'https://garyko0730.github.io/academic-portfolio/',
        github: 'https://github.com/Garyko0730',
        email: 'kopang@example.com',
        nav: [
          { label: 'Projects', path: '/projects/' },
          { label: 'Papers', path: '/papers/' },
          { label: 'Blog', path: '/blog/' },
          { label: 'About', path: '/about/' },
        ],
        researchFocus: ['机器视觉'],
        about: {
          education: 'JNU',
          bio: ['个人简介'],
          skills: ['PyTorch'],
        },
      },
      projects: [
        {
          id: 'vision-system',
          title: 'Vision System',
          subtitle: 'Industrial inspection',
          summary: '项目摘要',
          tech: ['YOLOv8'],
          featured: true,
          status: 'completed',
          role: '算法开发',
          github: 'https://github.com/example/vision-system',
          date: '2026-03',
        },
      ],
      papers: [
        {
          id: 'paper-1',
          title: 'Paper One',
          authors: 'Author A',
          venue: 'Venue',
          summary: '论文摘要',
          keyIdeas: ['Idea'],
          myTake: '个人评注',
          tags: ['Detection'],
          paperUrl: 'https://example.com/paper',
          rating: 4,
        },
      ],
      blogPosts: [
        {
          slug: 'post-a',
          title: 'Post A',
          date: '2026-04-03',
          excerpt: '文章摘要',
          tags: ['Engineering'],
          body: '## Blog Body',
        },
      ],
      projectContent: {
        'vision-system': {
          slug: 'vision-system',
          body: '## Project Body',
        },
      },
    },
    assetPaths: {
      css: '/academic-portfolio/assets/app.css',
      js: '/academic-portfolio/assets/app.js',
    },
  });

  assert.deepEqual(
    pages.map((page) => page.routePath).sort(),
    [
      '/',
      '/about/',
      '/blog/',
      '/blog/post-a/',
      '/papers/',
      '/projects/',
      '/projects/vision-system/',
    ]
  );

  assert.match(
    pages.find((page) => page.routePath === '/blog/post-a/').html,
    /Blog Body/
  );
  assert.match(
    pages.find((page) => page.routePath === '/projects/vision-system/').html,
    /Project Body/
  );
});

test('createSitePages uses professional placeholder copy for unavailable profile assets', () => {
  const pages = createSitePages({
    store: {
      site: {
        title: 'KoPang · Academic Portfolio',
        author: 'KoPang',
        description: 'Portfolio placeholder',
        siteUrl: 'https://example.com/',
        github: 'https://github.com/Garyko0730',
        email: 'kopang@example.com',
        linkedin: null,
        cv: null,
        nav: [],
        about: {
          education: 'JNU',
          bio: ['Intro paragraph'],
          skills: ['Python'],
        },
        availability: {
          cvLabel: 'Available on request',
          linkedinLabel: 'Not public yet',
        },
      },
      projects: [],
      papers: [],
      blogPosts: [],
      projectContent: {},
    },
    assetPaths: {
      css: '/academic-portfolio/assets/app.css',
      js: '/academic-portfolio/assets/app.js',
    },
  });

  const aboutPage = pages.find((page) => page.routePath === '/about/');

  assert.match(aboutPage.html, /Available on request/);
  assert.match(aboutPage.html, /Not public yet/);
  assert.doesNotMatch(aboutPage.html, /TODO/);
});

test('createSitePages falls back to professional availability copy when availability data is missing', () => {
  const pages = createSitePages({
    store: {
      site: {
        title: 'KoPang · Academic Portfolio',
        author: 'KoPang',
        description: 'Portfolio placeholder',
        siteUrl: 'https://example.com/',
        github: 'https://github.com/Garyko0730',
        email: 'kopang@example.com',
        linkedin: null,
        cv: null,
        nav: [],
        about: {
          education: 'JNU',
          bio: ['Intro paragraph'],
          skills: ['Python'],
        },
        availability: null,
      },
      projects: [],
      papers: [],
      blogPosts: [],
      projectContent: {},
    },
    assetPaths: {
      css: '/academic-portfolio/assets/app.css',
      js: '/academic-portfolio/assets/app.js',
    },
  });

  const aboutPage = pages.find((page) => page.routePath === '/about/');

  assert.match(aboutPage.html, /Available on request/);
  assert.match(aboutPage.html, /Not public yet/);
  assert.doesNotMatch(aboutPage.html, /TODO/);
});
