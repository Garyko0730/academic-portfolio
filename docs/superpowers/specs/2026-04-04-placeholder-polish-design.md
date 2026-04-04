# Placeholder Asset Polish Design

## Goal

在没有真实头像、CV PDF、LinkedIn 链接和项目截图的前提下，将当前站点从“明显未完成的草稿感”提升到“可以公开展示和投递使用”的正式状态，同时不伪造任何真实素材或外部身份信息。

## Current Problems

- `About` 页当前头像区域只是单字母占位，完成度不足。
- `LinkedIn` 和 `CV` 卡片直接显示 `TODO`，会削弱专业感。
- 项目封面占位虽然能工作，但信息密度偏低，不像完整案例封面。
- 首页缺少明确的投递导向区，站点目标还不够清晰。

## Proposed Approach

### 1. Professional Placeholder System

- 为 `About` 页设计正式的 profile placeholder 卡片：
  - 保留非真人占位性质
  - 增加身份标签、研究方向、状态信息
  - 风格与全站一致
- 为项目封面占位统一生成 case-study 风格封面：
  - 显示项目标题、副标题、技术关键词和状态
  - 列表页与详情页复用同一视觉体系

### 2. Career-Oriented Messaging

- 将 `TODO` 文案替换为职业化表达：
  - `LinkedIn`: `Not public yet`
  - `CV`: `Available on request`
- 首页新增投递导向区：
  - 强调研究方向、工程落地能力和联系方式
  - 引导访问项目页和邮件联系

### 3. Scope Boundaries

- 不伪造 LinkedIn 链接
- 不生成虚假的 CV PDF
- 不伪造真实照片或项目截图
- 仅使用正式占位设计和真实文本信息提升成品感

## Pages Affected

- `/`
- `/about/`
- `/projects/`
- `/projects/<slug>/`

## Implementation Notes

- 优先复用现有模板结构，避免扩大重构范围。
- 将占位视觉封装为模板层的独立渲染函数，后续替换真实素材时只需替换输入数据。
- 文案调整保持简洁、可信，不使用夸张宣传语。

## Verification

- 本地检查首页、About、项目列表和项目详情页的视觉一致性。
- 确认没有残留 `TODO` 文案。
- 运行测试与构建，确保改动不影响静态页面生成。
