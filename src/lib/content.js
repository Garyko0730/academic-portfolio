import fs from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

function resolveSlug(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

// 统一解析 Markdown 文档，保证模板和实际解析规则一致。
export function parseMarkdownDocument(filePath, raw) {
  const { data, content } = matter(raw);

  return {
    slug: resolveSlug(filePath),
    ...data,
    body: content.trim(),
  };
}

export function sortByDateDesc(items = [], key = 'date') {
  return [...items].sort((left, right) =>
    String(right[key] || '').localeCompare(String(left[key] || ''))
  );
}

export function createContentStore({
  site,
  projects,
  papers,
  blogPosts = [],
  projectDocuments = [],
}) {
  return {
    site,
    projects,
    papers,
    blogPosts: sortByDateDesc(blogPosts, 'date'),
    projectContent: Object.fromEntries(
      projectDocuments.map((document) => [document.slug, document])
    ),
  };
}

export async function readJsonFile(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

export async function loadMarkdownCollection(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();

  const documents = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const fullPath = path.join(directoryPath, fileName);
      const raw = await fs.readFile(fullPath, 'utf8');
      return parseMarkdownDocument(fullPath, raw);
    })
  );

  return documents;
}

export async function loadSiteContent(rootDir) {
  const [site, projects, papers, blogPosts, projectDocuments] = await Promise.all([
    readJsonFile(path.join(rootDir, 'src/data/site.json')),
    readJsonFile(path.join(rootDir, 'src/data/projects.json')),
    readJsonFile(path.join(rootDir, 'src/data/papers.json')),
    loadMarkdownCollection(path.join(rootDir, 'content/blog')),
    loadMarkdownCollection(path.join(rootDir, 'content/projects')),
  ]);

  return createContentStore({
    site,
    projects,
    papers,
    blogPosts,
    projectDocuments,
  });
}
