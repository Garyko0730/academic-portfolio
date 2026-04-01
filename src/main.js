import './styles/main.css';

import MarkdownIt from 'markdown-it';

import siteData from './data/site.json';
import projectsData from './data/projects.json';
import papersData from './data/papers.json';
import { initRouter } from './router.js';
import { renderPage } from './pages.js';

const blogModules = import.meta.glob('../content/blog/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
});

const projectModules = import.meta.glob('../content/projects/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
});

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

let revealObserver;

function parseFrontmatterValue(value) {
  const trimmed = value.trim();

  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;

  if (
    (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

function parseFrontmatter(raw) {
  const normalized = raw.replace(/\r\n/g, '\n');

  if (!normalized.startsWith('---\n')) {
    return { data: {}, content: normalized };
  }

  const endIndex = normalized.indexOf('\n---\n', 4);
  if (endIndex === -1) {
    return { data: {}, content: normalized };
  }

  const frontmatterBlock = normalized.slice(4, endIndex);
  const content = normalized.slice(endIndex + 5);
  const data = {};

  frontmatterBlock.split('\n').forEach((line) => {
    if (!line.trim()) return;
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) return;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1);
    data[key] = parseFrontmatterValue(value);
  });

  return { data, content };
}

function parseMarkdownCollection(modules) {
  return Object.entries(modules).map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '');
    const { data, content } = parseFrontmatter(raw);

    return {
      slug,
      ...data,
      body: content.trim(),
    };
  });
}

const blogPosts = parseMarkdownCollection(blogModules).sort((a, b) =>
  String(b.date || '').localeCompare(String(a.date || ''))
);

const projectContent = Object.fromEntries(
  parseMarkdownCollection(projectModules).map((item) => [item.slug, item])
);

export const store = {
  site: siteData,
  projects: projectsData,
  papers: papersData,
  blogPosts,
  projectContent,
};

export function renderStars(rating) {
  if (!rating) return '';
  return Array.from({ length: 5 }, (_, index) =>
    `<span class="rating-star">${index < rating ? '★' : '☆'}</span>`
  ).join('');
}

export function renderTags(tags = []) {
  return tags
    .map(
      (tag) =>
        `<span class="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800">${tag}</span>`
    )
    .join('');
}

export function renderMarkdown(content = '') {
  return markdown.render(content);
}

export function renderRevealElements() {
  if (!revealObserver) return;

  document.querySelectorAll('.reveal').forEach((element) => {
    element.classList.remove('visible');
    revealObserver.observe(element);
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  }

  window.toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem(
      'portfolio-theme',
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
  };
}

function initMobileMenu() {
  window.toggleMobileMenu = () => {
    document.getElementById('mobile-menu')?.classList.toggle('hidden');
    document.getElementById('hamburger-icon')?.classList.toggle('hidden');
    document.getElementById('close-icon')?.classList.toggle('hidden');
  };

  window.closeMobileMenu = () => {
    document.getElementById('mobile-menu')?.classList.add('hidden');
    document.getElementById('hamburger-icon')?.classList.remove('hidden');
    document.getElementById('close-icon')?.classList.add('hidden');
  };
}

function initRevealObserver() {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
}

function init() {
  initTheme();
  initMobileMenu();
  initRevealObserver();
  initRouter(renderPage);
}

init();
