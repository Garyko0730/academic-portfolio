import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build as viteBuild } from 'vite';

import { loadSiteContent } from '../src/lib/content.js';
import {
  createNotFoundDocument,
  createRobotsTxt,
  createSitePages,
  createSitemapXml,
  getOutputFilePath,
} from '../src/lib/site-builder.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist');

function getBasePath(siteUrl) {
  return new URL(siteUrl).pathname.replace(/\/?$/, '/');
}

function joinBasePath(basePath, assetFile) {
  return `${basePath}${assetFile}`.replace(/\/{2,}/g, '/');
}

async function ensureParentDirectory(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function writeOutputFile(relativePath, content) {
  const fullPath = path.join(distDir, relativePath);
  await ensureParentDirectory(fullPath);
  await fs.writeFile(fullPath, content, 'utf8');
}

async function readManifest() {
  const manifestPath = path.join(distDir, '.vite/manifest.json');
  return JSON.parse(await fs.readFile(manifestPath, 'utf8'));
}

function resolveAssetPaths({ manifest, siteUrl }) {
  const entry = manifest['index.html'] || Object.values(manifest).find((item) => item.isEntry);

  if (!entry?.file) {
    throw new Error('Unable to resolve Vite entry asset from manifest.');
  }

  const basePath = getBasePath(siteUrl);
  const cssFile = entry.css?.[0];

  return {
    js: joinBasePath(basePath, entry.file),
    css: cssFile ? joinBasePath(basePath, cssFile) : '',
  };
}

async function buildSite() {
  await viteBuild({
    configFile: path.join(rootDir, 'vite.config.js'),
  });

  const store = await loadSiteContent(rootDir);
  const manifest = await readManifest();
  const assetPaths = resolveAssetPaths({
    manifest,
    siteUrl: store.site.siteUrl,
  });

  const pages = createSitePages({ store, assetPaths });

  await Promise.all(
    pages.map((page) => writeOutputFile(getOutputFilePath(page.routePath), page.html))
  );

  await Promise.all([
    writeOutputFile('404.html', createNotFoundDocument({ site: store.site, assetPaths })),
    writeOutputFile(
      'sitemap.xml',
      createSitemapXml({ siteUrl: store.site.siteUrl, pages })
    ),
    writeOutputFile('robots.txt', createRobotsTxt({ siteUrl: store.site.siteUrl })),
    writeOutputFile('.nojekyll', ''),
  ]);
}

buildSite().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
