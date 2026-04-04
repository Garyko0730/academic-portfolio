import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  buildCanonicalUrl,
  createSitePages,
  getOutputFilePath,
  renderHtmlDocument,
} from '../src/lib/site-builder.js';

const sampleAssetPaths = {
  css: '/academic-portfolio/assets/app.css',
  js: '/academic-portfolio/assets/app.js',
};

const mainCss = readFileSync(new URL('../src/styles/main.css', import.meta.url), 'utf8');

function createSampleStoreWithoutAvatar() {
  return {
    site: {
      title: 'KoPang · Academic Portfolio',
      author: 'Ada Lovelace',
      description: 'Portfolio placeholder',
      siteUrl: 'https://example.com/',
      github: 'https://github.com/Garyko0730',
      email: 'kopang@example.com',
      linkedin: null,
      cv: null,
      nav: [],
      researchFocus: [
        'Computer Vision Systems',
        'Reliable Automation Workflows',
      ],
      about: {
        education: 'JNU',
        bio: ['Intro paragraph'],
        skills: ['Python'],
      },
      availability: {
        cvLabel: 'Available on request',
        linkedinLabel: 'Not public yet',
      },
      avatar: null,
    },
    projects: [],
    papers: [],
    blogPosts: [],
    projectContent: {},
  };
}

function createSampleStoreWithAvailability() {
  return {
    site: {
      title: 'KoPang · Academic Portfolio',
      author: 'KoPang',
      description: 'Research and engineering placeholder',
      siteUrl: 'https://example.com/',
      github: 'https://github.com/Garyko0730',
      email: 'kopang@example.com',
      nav: [],
      researchFocus: ['Applied Vision', 'Reliable Autonomy'],
      about: {
        education: 'JNU',
        bio: ['Intro paragraph'],
        skills: ['Python'],
      },
      availability: {
        cvLabel: 'Portfolio CV card copy',
        homepageNote: 'CV available on request',
        linkedinLabel: 'Not public yet',
      },
    },
    projects: [],
    papers: [],
    blogPosts: [],
    projectContent: {},
  };
}

function createSampleStoreWithProject() {
  return {
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
    projects: [
      {
        id: 'vision-system',
        title: 'Vision System',
        subtitle: 'Industrial inspection',
        summary: '项目摘要',
        tech: ['YOLOv8', 'TensorRT'],
        featured: true,
        status: 'completed',
        role: '算法开发',
        github: 'https://github.com/example/vision-system',
        date: '2026-03',
      },
    ],
    papers: [],
    blogPosts: [],
    projectContent: {
      'vision-system': {
        slug: 'vision-system',
        body: '## Project Body',
      },
    },
  };
}

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

test('about page omits the mailto link when email is blank', () => {
  const pages = createSitePages({
    store: {
      site: {
        title: 'KoPang · Academic Portfolio',
        author: 'KoPang',
        description: 'Portfolio placeholder',
        siteUrl: 'https://example.com/',
        github: 'https://github.com/Garyko0730',
        email: '   ',
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
    assetPaths: sampleAssetPaths,
  });

  const aboutPage = pages.find((page) => page.routePath === '/about/');

  assert.match(aboutPage.html, /<p class="text-sm font-medium">Email<\/p>/);
  assert.match(aboutPage.html, /Available on request/);
  assert.doesNotMatch(aboutPage.html, /href="mailto:/);
});

test('about page renders a structured profile placeholder module when avatar is missing', () => {
  const pages = createSitePages({
    store: createSampleStoreWithoutAvatar(),
    assetPaths: sampleAssetPaths,
  });

  const aboutPage = pages.find((page) => page.routePath === '/about/');

  assert.doesNotMatch(aboutPage.html, /Profile placeholder/);
  assert.match(aboutPage.html, /profile-placeholder__initial">A</);
  assert.match(aboutPage.html, /Computer Vision Systems/);
  assert.match(aboutPage.html, /Reliable Automation Workflows/);
});

test('about page placeholder falls back to site description, education, and default initial', () => {
  const pages = createSitePages({
    store: {
      site: {
        title: 'Fallback Portfolio',
        author: '   ',
        description: 'Applied AI Portfolio',
        siteUrl: 'https://example.com/',
        github: 'https://github.com/Garyko0730',
        email: 'kopang@example.com',
        linkedin: null,
        cv: null,
        nav: [],
        researchFocus: [],
        about: {
          education: 'Graduate Researcher',
          bio: ['Intro paragraph'],
          skills: ['Python'],
        },
        availability: {
          cvLabel: 'Available on request',
          linkedinLabel: 'Not public yet',
        },
        avatar: null,
      },
      projects: [],
      papers: [],
      blogPosts: [],
      projectContent: {},
    },
    assetPaths: sampleAssetPaths,
  });

  const aboutPage = pages.find((page) => page.routePath === '/about/');

  assert.match(aboutPage.html, /profile-placeholder__initial">K</);
  assert.match(aboutPage.html, /Applied AI Portfolio/);
  assert.match(aboutPage.html, /Graduate Researcher/);
});

test('about page placeholder falls back to education when only one research focus item exists', () => {
  const pages = createSitePages({
    store: {
      site: {
        title: 'Single Focus Portfolio',
        author: 'Grace Hopper',
        description: 'Systems portfolio',
        siteUrl: 'https://example.com/',
        github: 'https://github.com/Garyko0730',
        email: 'kopang@example.com',
        linkedin: null,
        cv: null,
        nav: [],
        researchFocus: ['Vision Platforms'],
        about: {
          education: 'Computing Research Lead',
          bio: ['Intro paragraph'],
          skills: ['Python'],
        },
        availability: {
          cvLabel: 'Available on request',
          linkedinLabel: 'Not public yet',
        },
        avatar: null,
      },
      projects: [],
      papers: [],
      blogPosts: [],
      projectContent: {},
    },
    assetPaths: sampleAssetPaths,
  });

  const aboutPage = pages.find((page) => page.routePath === '/about/');

  assert.match(aboutPage.html, /Vision Platforms/);
  assert.match(aboutPage.html, /Computing Research Lead/);
});

test('project pages render a structured case-study placeholder cover when screenshots are missing', () => {
  const pages = createSitePages({
    store: createSampleStoreWithProject(),
    assetPaths: sampleAssetPaths,
  });

  const projectPage = pages.find((page) => page.routePath === '/projects/vision-system/');
  const projectsListPage = pages.find((page) => page.routePath === '/projects/');

  assert.match(projectPage.html, /<div class="case-study-cover(?: [^"]*)?"/);
  assert.match(projectPage.html, /data-case-study-placeholder="detail"/);
  assert.match(projectPage.html, /case-study-cover--detail/);
  assert.match(projectPage.html, /case-study-cover__title">Vision System/);
  assert.match(projectPage.html, /case-study-cover__tags/);
  assert.match(projectPage.html, /case-study-cover__status">completed/);
  assert.match(projectsListPage.html, /<div class="case-study-cover(?: [^"]*)?"/);
  assert.match(projectsListPage.html, /data-case-study-placeholder="card"/);
  assert.match(projectsListPage.html, /case-study-cover--card/);
  assert.match(mainCss, /\.case-study-cover--detail\s*\{[^}]*min-height:\s*24rem;/s);
});

test('home page includes a contact-oriented availability section', () => {
  const pages = createSitePages({
    store: createSampleStoreWithAvailability(),
    assetPaths: sampleAssetPaths,
  });

  const homePage = pages.find((page) => page.routePath === '/');

  assert.match(homePage.html, /href="mailto:kopang@example\.com"/);
  assert.match(homePage.html, />Email me</);
  assert.match(homePage.html, /CV available on request/);
  assert.doesNotMatch(homePage.html, /Portfolio CV card copy/);
});

test('home page availability section omits the CTA when email is missing', () => {
  const pages = createSitePages({
    store: {
      ...createSampleStoreWithAvailability(),
      site: {
        ...createSampleStoreWithAvailability().site,
        email: '   ',
      },
    },
    assetPaths: sampleAssetPaths,
  });

  const homePage = pages.find((page) => page.routePath === '/');

  assert.match(homePage.html, /CV available on request/);
  assert.doesNotMatch(homePage.html, /href="mailto:/);
  assert.doesNotMatch(homePage.html, />Email me</);
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
