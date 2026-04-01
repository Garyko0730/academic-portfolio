# Academic Portfolio v2

正式版 v2 的目标不是继续修补单页 demo，而是把现有项目升级为一个 **可维护、可分享、可投递** 的学术作品集网站。

## 技术栈

- **Build**: Vite 5
- **UI**: Vanilla JavaScript
- **Styling**: Tailwind CSS（build 版）
- **Markdown**: markdown-it
- **Frontmatter**: gray-matter
- **Deploy**: GitHub Pages

## 本地开发

```bash
npm install
npm run dev
```

默认启动 Vite dev server，访问终端输出的本地地址即可。

## 生产构建

```bash
npm run build
npm run preview
```

构建产物输出到 `dist/`。

## 目录结构

```text
.
├── content/
│   ├── blog/              # Blog 正文（Markdown）
│   └── projects/          # Project detail 正文（Markdown）
├── data/                  # 旧版静态数据，暂时保留供迁移参考
├── src/
│   ├── data/
│   │   ├── site.json      # 站点级元数据
│   │   ├── projects.json  # 项目列表 metadata
│   │   └── papers.json    # 论文列表 metadata
│   ├── main.js            # 数据装载、主题、markdown、入口
│   ├── pages.js           # 页面渲染
│   ├── router.js          # hash 路由
│   └── styles/
│       └── main.css
├── index.html
└── .github/workflows/deploy.yml
```

## 内容维护方式

### 1. 修改站点资料
编辑 `src/data/site.json`：
- 基本标题与描述
- Email / GitHub / LinkedIn / CV
- About 文案
- 导航项

### 2. 新增/修改项目
- 列表信息：`src/data/projects.json`
- 详情正文：`content/projects/<slug>.md`

要求：
- `projects.json` 的 `id` 必须和 markdown 文件名一致
- 如果没有真实封面图，`cover` 先留 `null`
- 不要使用 `href="#"` 或假链接

### 3. 新增/修改论文卡片
编辑 `src/data/papers.json`。

建议字段：
- `title`
- `authors`
- `venue`
- `dateRead`
- `tags`
- `summary`
- `keyIdeas`
- `myTake`
- `paperUrl`

### 4. 新增 Blog
在 `content/blog/` 下新建 markdown 文件：

```md
---
title: "文章标题"
date: "2026-04-02"
tags: ["TagA", "TagB"]
excerpt: "一句话摘要"
---

## 正文
```

文件名会作为 slug，例如：
- `content/blog/yolo-training-guide.md`
- 路由为 `#/blog/yolo-training-guide`

## 当前已知 TODO

- [ ] 换成真实头像资源（当前 About 用字母占位）
- [ ] 补 LinkedIn 正式链接
- [ ] 补 CV PDF
- [ ] 为项目补真实 cover 图 / 截图
- [ ] 如需去掉 hash 路由，再单独做 GitHub Pages 的 404 fallback 方案

## 为什么当前先用 hash 路由

因为这版的第一目标是 **稳定上线**。

在 GitHub Pages 上，hash 路由可以避免直接打开 detail 页时出现 404；等内容和结构稳定后，再决定是否升级为 history 路由 + fallback。
