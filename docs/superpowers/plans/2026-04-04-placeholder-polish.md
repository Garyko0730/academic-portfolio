# Placeholder Asset Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the portfolio's placeholder avatar, unavailable CV/LinkedIn states, and project cover placeholders so the site feels presentation-ready without inventing real assets.

**Architecture:** Keep all changes inside the existing static site pipeline by extending the template layer and a small amount of supporting site data. Add regression tests for the new placeholder messaging and hero/case-study rendering so the polished states remain stable across future content edits.

**Tech Stack:** Node.js, node:test, Vite, Vanilla JavaScript, MarkdownIt, Tailwind CSS

---

### Task 1: Lock in professional placeholder messaging with tests

**Files:**
- Modify: `tests/site-builder.test.js`
- Modify: `src/data/site.json`
- Test: `tests/site-builder.test.js`

- [ ] **Step 1: Write the failing test**

```js
test('createSitePages uses professional placeholder copy for unavailable profile assets', () => {
  const pages = createSitePages({
    store: {
      site: {
        title: 'KoPang · Academic Portfolio',
        author: 'KoPang',
        description: '站点描述',
        siteUrl: 'https://garyko0730.github.io/academic-portfolio/',
        github: 'https://github.com/Garyko0730',
        email: 'kopang@example.com',
        linkedin: null,
        cv: null,
        nav: [],
        researchFocus: [],
        availability: {
          cvLabel: 'Available on request',
          linkedinLabel: 'Not public yet',
        },
        about: {
          education: 'JNU',
          bio: ['个人简介'],
          skills: ['PyTorch'],
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/site-builder.test.js`
Expected: FAIL because `/about/` still renders `TODO` placeholder copy.

- [ ] **Step 3: Write minimal implementation**

```json
{
  "availability": {
    "cvLabel": "Available on request",
    "linkedinLabel": "Not public yet"
  }
}
```

Then update the About template to read from `site.availability` instead of hard-coded TODO text.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/site-builder.test.js`
Expected: PASS with the new placeholder copy present in `/about/`.

- [ ] **Step 5: Commit**

```bash
git add tests/site-builder.test.js src/data/site.json src/lib/templates.js
git commit -m "test: lock professional placeholder messaging"
```

### Task 2: Upgrade the About page placeholder profile module

**Files:**
- Modify: `tests/site-builder.test.js`
- Modify: `src/lib/templates.js`
- Modify: `src/styles/main.css`
- Test: `tests/site-builder.test.js`

- [ ] **Step 1: Write the failing test**

```js
test('about page renders a structured profile placeholder module when avatar is missing', () => {
  const pages = createSitePages({
    store: sampleStoreWithoutAvatar,
    assetPaths: sampleAssets,
  });

  const aboutPage = pages.find((page) => page.routePath === '/about/');

  assert.match(aboutPage.html, /Profile placeholder/);
  assert.match(aboutPage.html, /Machine Vision Researcher/);
  assert.match(aboutPage.html, /Industrial AI Systems/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/site-builder.test.js`
Expected: FAIL because the current About page only renders a gradient letter block.

- [ ] **Step 3: Write minimal implementation**

```js
function renderProfilePlaceholder(site) {
  return `
    <div class="profile-placeholder">
      <p class="profile-placeholder__eyebrow">Profile placeholder</p>
      <div class="profile-placeholder__initial">${escapeHtml(site.author.slice(0, 1))}</div>
      <p class="profile-placeholder__title">Machine Vision Researcher</p>
      <p class="profile-placeholder__meta">Industrial AI Systems</p>
    </div>
  `;
}
```

Use this module in the About template when `site.avatar` is missing and add the required CSS in `src/styles/main.css`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/site-builder.test.js`
Expected: PASS with the new profile placeholder content rendered.

- [ ] **Step 5: Commit**

```bash
git add tests/site-builder.test.js src/lib/templates.js src/styles/main.css
git commit -m "feat: add polished profile placeholder module"
```

### Task 3: Upgrade project cover placeholders into case-study covers

**Files:**
- Modify: `tests/site-builder.test.js`
- Modify: `src/lib/templates.js`
- Modify: `src/styles/main.css`
- Test: `tests/site-builder.test.js`

- [ ] **Step 1: Write the failing test**

```js
test('project pages render a structured case-study placeholder cover when screenshots are missing', () => {
  const pages = createSitePages({
    store: sampleStoreWithProject,
    assetPaths: sampleAssets,
  });

  const projectPage = pages.find((page) => page.routePath === '/projects/vision-system/');

  assert.match(projectPage.html, /Case Study/);
  assert.match(projectPage.html, /YOLOv8/);
  assert.match(projectPage.html, /completed/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/site-builder.test.js`
Expected: FAIL because current project placeholders only show title + subtitle.

- [ ] **Step 3: Write minimal implementation**

```js
function renderProjectCoverPlaceholder(project) {
  return `
    <div class="case-study-cover">
      <p class="case-study-cover__eyebrow">Case Study</p>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.subtitle || '')}</p>
      <div>${renderTags((project.tech || []).slice(0, 3))}</div>
      <p>${escapeHtml(project.status || '')}</p>
    </div>
  `;
}
```

Use this helper for both project cards and project detail pages whenever `project.cover` is missing.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/site-builder.test.js`
Expected: PASS with structured placeholder content on project routes.

- [ ] **Step 5: Commit**

```bash
git add tests/site-builder.test.js src/lib/templates.js src/styles/main.css
git commit -m "feat: add case study project placeholders"
```

### Task 4: Add a career-oriented section to the homepage

**Files:**
- Modify: `tests/site-builder.test.js`
- Modify: `src/lib/templates.js`
- Modify: `src/styles/main.css`
- Test: `tests/site-builder.test.js`

- [ ] **Step 1: Write the failing test**

```js
test('home page includes a contact-oriented availability section', () => {
  const pages = createSitePages({
    store: sampleStoreWithAvailability,
    assetPaths: sampleAssets,
  });

  const homePage = pages.find((page) => page.routePath === '/');

  assert.match(homePage.html, /Open for research and engineering opportunities/);
  assert.match(homePage.html, /Email me/);
  assert.match(homePage.html, /Available on request/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/site-builder.test.js`
Expected: FAIL because the homepage currently ends after the latest writing section.

- [ ] **Step 3: Write minimal implementation**

```js
function renderAvailabilitySection(site) {
  return `
    <section class="availability-panel">
      <p>Open for research and engineering opportunities</p>
      <a href="mailto:${escapeHtml(site.email)}">Email me</a>
      <p>${escapeHtml(site.availability.cvLabel)}</p>
    </section>
  `;
}
```

Render this section on the homepage below the writing section and style it to match the rest of the site.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/site-builder.test.js`
Expected: PASS with the new contact-oriented section present.

- [ ] **Step 5: Commit**

```bash
git add tests/site-builder.test.js src/lib/templates.js src/styles/main.css
git commit -m "feat: add homepage availability section"
```

### Task 5: Final verification and release

**Files:**
- Modify: repository files touched above

- [ ] **Step 1: Run the full automated test suite**

Run: `npm test`
Expected: PASS with all site-builder tests green.

- [ ] **Step 2: Run a production build**

Run: `npm run build`
Expected: PASS and `dist/` regenerated without errors.

- [ ] **Step 3: Inspect the generated output**

Run:

```bash
find dist -maxdepth 3 -type f | sort
sed -n '1,120p' dist/about/index.html
sed -n '1,120p' dist/projects/printing-defect-detection/index.html
sed -n '1,120p' dist/index.html
```

Expected: `/about/`, `/projects/<slug>/`, and `/` contain the new polished placeholder copy and no `TODO` text.

- [ ] **Step 4: Commit the final polish**

```bash
git add src/data/site.json src/lib/templates.js src/styles/main.css tests/site-builder.test.js
git commit -m "feat: polish placeholder assets for public portfolio"
```

- [ ] **Step 5: Push to GitHub Pages**

```bash
git push origin main
```

Expected: remote `main` updated and Pages deployment triggered.
