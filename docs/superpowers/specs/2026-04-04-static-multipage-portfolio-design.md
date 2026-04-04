# Static Multipage Portfolio Design

## 目标

将当前依赖 hash 路由的单页作品集改造成适合公开博客、作品集展示和投递使用的静态多页面站点，同时保留现有 JSON + Markdown 的内容维护方式。

## 现状问题

- 详情页依赖 `/#/...` 路由，搜索引擎和社交分享难以稳定识别独立页面。
- 页面内容在浏览器端动态拼接，首屏 HTML 不包含主要正文。
- 博客模板与 frontmatter 解析规则不一致，后续发文容易出错。
- 卡片主要依赖 `onclick`，键盘可访问性较差。
- 页面标题和描述仅在客户端修改，无法为每个页面提供稳定的 canonical / Open Graph 信息。

## 设计方案

### 内容来源

- 保留 `src/data/site.json` 作为站点级元数据来源，并补充 `siteUrl` 字段。
- 保留 `src/data/projects.json`、`src/data/papers.json` 作为列表元数据。
- 保留 `content/blog/*.md` 与 `content/projects/*.md` 作为 Markdown 正文来源。
- 改用可靠 frontmatter 解析，确保模板与解析逻辑一致。

### 构建方式

- 使用 Node 构建脚本统一生成站点。
- Vite 负责打包共享 CSS 和轻交互脚本。
- 构建脚本在打包完成后读取产物文件名，生成所有静态 HTML 页面。
- 输出真实目录路由：
  - `/`
  - `/projects/`
  - `/projects/<slug>/`
  - `/papers/`
  - `/blog/`
  - `/blog/<slug>/`
  - `/about/`
  - `/404.html`

### 页面渲染

- 页面主体内容在构建阶段直接写入 HTML。
- 客户端脚本只负责轻交互：
  - 深浅色主题切换
  - 移动端菜单展开/收起
  - reveal 动画
- 所有导航和卡片入口改为真实 `<a>` 元素。

### SEO 与公开可见性

- 为每个页面生成独立的 `<title>` 和 `meta description`。
- 生成 canonical URL。
- 补充基础 Open Graph / Twitter meta。
- 生成 `sitemap.xml` 与 `robots.txt`。
- 保持 GitHub Pages 项目路径兼容，确保线上链接正确。

### 可访问性

- 卡片和导航使用可聚焦、可键盘操作的真实链接。
- `prefers-reduced-motion` 用户不触发强制平滑滚动。
- 保留图片 `alt` 文本和必要的 `aria-label`。

## 非目标

- 本轮不迁移到 Astro 等新框架。
- 本轮不引入 CMS、全文搜索、RSS、评论系统等扩展功能。
- 本轮不做整站视觉重设计，只做必要的结构和体验优化。

## 验证方式

- 增加 frontmatter 解析和页面生成的自动化测试。
- 运行构建命令，确认 `dist/` 中存在预期页面与站点元文件。
- 本地预览构建产物，确认页面链接、主题切换和移动端菜单工作正常。
- 推送后检查 GitHub Pages 的线上页面是否能直接访问文章页和项目详情页。
