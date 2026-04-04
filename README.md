# Academic Portfolio v2

这版已经从 hash 路由单页站改为 **静态多页面作品集**。目标是让博客、项目详情和 About 页面都能作为真实 URL 被分享、收录和直接访问。

## 技术栈

- **Build**: Vite 5 + Node build script
- **UI**: Vanilla JavaScript
- **Styling**: Tailwind CSS
- **Markdown**: markdown-it
- **Frontmatter**: gray-matter
- **Deploy**: GitHub Pages

## 常用命令

```bash
npm install
npm test
npm run build
npm run preview
```

- `npm test`：运行内容解析和静态页面生成测试
- `npm run build`：打包静态资源并生成整站 HTML 到 `dist/`
- `npm run preview`：预览已生成的静态站点
- `npm run dev`：执行一次完整构建后直接启动预览

## 目录结构

```text
.
├── content/
│   ├── blog/              # Blog 正文（Markdown）
│   └── projects/          # Project detail 正文（Markdown）
├── src/
│   ├── client.js          # 主题、菜单、reveal 等轻交互
│   ├── data/
│   │   ├── site.json      # 站点级元数据
│   │   ├── projects.json  # 项目列表 metadata
│   │   └── papers.json    # 论文列表 metadata
│   ├── lib/
│   │   ├── content.js     # 内容读取与 frontmatter 解析
│   │   ├── site-builder.js# 静态页面与站点文件生成逻辑
│   │   └── templates.js   # 页面模板
│   └── styles/
│       └── main.css
├── scripts/
│   └── build-site.mjs     # 站点构建入口
├── tests/
│   ├── content.test.js
│   └── site-builder.test.js
├── index.html             # Vite 资源打包壳
└── .github/workflows/deploy.yml
```

## 内容维护方式

### 1. 修改站点资料

编辑 `src/data/site.json`：

- `title`：站点标题
- `siteUrl`：线上正式地址，用于 canonical、sitemap、OG URL
- `description`：首页与默认 SEO 描述
- `email / github / linkedin / cv`
- `about`：About 页面文案
- `nav`：导航项

### 2. 新增/修改项目

- 列表信息：`src/data/projects.json`
- 详情正文：`content/projects/<slug>.md`

要求：

- `projects.json` 里的 `id` 必须和 Markdown 文件名一致
- 如果没有真实封面图，`cover` 留 `null`
- GitHub / Demo 链接写真实 URL，不要留假链接

### 3. 新增/修改论文卡片

编辑 `src/data/papers.json`，常用字段：

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

参考 `docs/blog-template.md`，在 `content/blog/` 下新建 Markdown 文件。

例如：

- `content/blog/yolo-training-guide.md`
- 最终页面路由为 `/blog/yolo-training-guide/`

最小格式如下：

```md
---
title: "文章标题"
date: "2026-04-02"
tags: ["TagA", "TagB"]
excerpt: "一句话摘要"
---

## 正文
```

注意：frontmatter 必须从第一行开始，不要在前面放说明文字。

## 部署

仓库已经包含 GitHub Pages 工作流：

- `push` 到 `main` 后自动构建 `dist/`
- GitHub Actions 上传静态产物并部署到 Pages

如果你后续换成自定义域名，记得同步修改 `src/data/site.json` 里的 `siteUrl`。
