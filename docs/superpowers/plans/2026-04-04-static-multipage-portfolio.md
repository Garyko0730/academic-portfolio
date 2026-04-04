# Static Multipage Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hash-router SPA with a statically generated multipage portfolio that is indexable, shareable, and maintainable.

**Architecture:** Extract content loading and page rendering into reusable server-side modules, bundle shared CSS and client behavior with Vite, then generate route-specific HTML files during build. Keep JSON + Markdown as the authoring source of truth and limit runtime JavaScript to progressive enhancement.

**Tech Stack:** Node.js, Vite, Vanilla JavaScript, MarkdownIt, gray-matter, node:test

---

### Task 1: Content loading foundation

**Files:**
- Create: `tests/content.test.js`
- Create: `src/lib/content.js`

- [ ] Step 1: Write a failing test for Markdown frontmatter parsing from a realistic blog post fixture.
- [ ] Step 2: Run `node --test tests/content.test.js` and confirm it fails because `src/lib/content.js` does not exist yet.
- [ ] Step 3: Implement the smallest content helpers needed to load Markdown, parse frontmatter, sort blog posts, and map project details by slug.
- [ ] Step 4: Re-run `node --test tests/content.test.js` and confirm it passes.

### Task 2: Static page generation foundation

**Files:**
- Create: `tests/site-builder.test.js`
- Create: `src/lib/templates.js`
- Create: `src/lib/site-builder.js`

- [ ] Step 1: Write a failing test for canonical URL generation, output route paths, and page-level meta tags.
- [ ] Step 2: Run `node --test tests/site-builder.test.js` and confirm it fails because the builder helpers are missing.
- [ ] Step 3: Implement the minimal route and HTML generation helpers needed to satisfy the tests.
- [ ] Step 4: Re-run `node --test tests/site-builder.test.js` and confirm it passes.

### Task 3: Progressive enhancement runtime

**Files:**
- Create: `src/client.js`
- Modify: `src/styles/main.css`
- Modify: `index.html`

- [ ] Step 1: Move theme toggling, mobile menu behavior, and reveal animation setup into `src/client.js`.
- [ ] Step 2: Ensure the runtime no longer renders page content in the browser.
- [ ] Step 3: Update styles and shell markup so statically rendered pages still get enhancement after load.
- [ ] Step 4: Re-run automated tests and a full build.

### Task 4: Full static site build pipeline

**Files:**
- Create: `scripts/build-site.mjs`
- Modify: `package.json`
- Modify: `vite.config.js`
- Modify: `src/data/site.json`
- Modify: `docs/blog-template.md`
- Modify: `README.md`

- [ ] Step 1: Implement a build script that bundles assets, reads content, and writes all static HTML pages into `dist/`.
- [ ] Step 2: Generate supporting files including `sitemap.xml`, `robots.txt`, and `404.html`.
- [ ] Step 3: Update scripts and docs so local build instructions match the new flow.
- [ ] Step 4: Run `node --test` and `npm run build`, then inspect the generated `dist/` structure.

### Task 5: Release validation

**Files:**
- Modify: repository files touched above

- [ ] Step 1: Manually inspect generated pages for broken links, missing metadata, and accessibility regressions.
- [ ] Step 2: Preview the build locally.
- [ ] Step 3: Commit the feature with a focused message.
- [ ] Step 4: Push the branch and confirm the GitHub Pages deployment renders direct detail-page URLs.
