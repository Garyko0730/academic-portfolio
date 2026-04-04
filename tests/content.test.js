import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createContentStore,
  parseMarkdownDocument,
  sortByDateDesc,
} from '../src/lib/content.js';

test('parseMarkdownDocument extracts frontmatter and markdown body', () => {
  const raw = `---
title: "测试文章"
date: "2026-04-03"
tags: ["A", "B"]
excerpt: "摘要"
---

## 正文

内容段落。`;

  const document = parseMarkdownDocument('content/blog/test-post.md', raw);

  assert.equal(document.slug, 'test-post');
  assert.equal(document.title, '测试文章');
  assert.equal(document.date, '2026-04-03');
  assert.deepEqual(document.tags, ['A', 'B']);
  assert.equal(document.excerpt, '摘要');
  assert.match(document.body, /## 正文/);
});

test('sortByDateDesc sorts newer posts first', () => {
  const sorted = sortByDateDesc([
    { slug: 'older', date: '2026-04-01' },
    { slug: 'newer', date: '2026-04-03' },
    { slug: 'middle', date: '2026-04-02' },
  ]);

  assert.deepEqual(
    sorted.map((item) => item.slug),
    ['newer', 'middle', 'older']
  );
});

test('createContentStore maps project markdown by slug and sorts blog posts', () => {
  const store = createContentStore({
    site: { title: 'Demo Site' },
    projects: [{ id: 'vision-system', title: 'Vision System' }],
    papers: [{ id: 'paper-1', title: 'Paper One' }],
    blogPosts: [
      parseMarkdownDocument(
        'content/blog/older.md',
        `---
title: "旧文"
date: "2026-01-01"
---

旧内容`
      ),
      parseMarkdownDocument(
        'content/blog/newer.md',
        `---
title: "新文"
date: "2026-03-01"
---

新内容`
      ),
    ],
    projectDocuments: [
      parseMarkdownDocument(
        'content/projects/vision-system.md',
        `---
title: "Vision System"
---

项目内容`
      ),
    ],
  });

  assert.equal(store.blogPosts[0].slug, 'newer');
  assert.equal(store.projectContent['vision-system'].title, 'Vision System');
  assert.equal(store.site.title, 'Demo Site');
});
