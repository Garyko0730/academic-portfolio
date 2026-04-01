---
title: "Pixel Office"
title_en: "Pixel Office"
description: "展示 OpenClaw 多 Agent 状态的像素办公室网页 UI，Phaser 3 + Flask"
tech: ["Phaser 3", "Flask", "Python"]
github: "https://github.com/Garyko0730/pixel-office"
lang: "JavaScript"
image: "https://picsum.photos/seed/pixeloffice/800/600"
featured: true
---

## 项目背景

OpenClaw 多 Agent 系统在运行时缺乏统一的状态监控界面，开发者难以直观掌握各 Agent 的任务执行进度与资源占用情况。本项目为 OpenClaw 系统构建了一套轻量化的网页可视化方案，实现无需额外依赖即可在浏览器中实时查看 Agent 状态。

## 我的角色

作为项目负责人，负责整体产品设计、技术选型及可视化实现，协调 Python 后端与 JavaScript 前端的对接工作。

## 技术方案

**前端**：Phaser 3 构建像素风格办公室场景，每个 Agent 对应一个可动的 Sprite 单位，通过动画帧展示不同状态（站立、移动、工作中）。

**后端**：Flask 提供 Agent 状态查询 REST API 与 WebSocket 实时推送通道，后端定期轮询 OpenClaw 核心获取最新状态。

**轻量部署**：单页应用架构，无需构建工具即可直接通过浏览器访问；后端服务可通过 Docker 快速部署。

## 特色功能

- 像素风格办公室场景，视觉风格统一、占用资源低
- 多 Agent 状态实时同步，支持任务进度百分比可视化
- Agent 悬停信息卡，展示实时运行参数
- 响应式布局，适配桌面端与移动端浏览器

## 项目成果与局限

成果：为 OpenClaw 社区提供了一个开箱即用的可视化监控方案，已获得部分开发者采用。

局限：目前仅支持 OpenClaw 系统，通用性有限；状态数据刷新频率受限于后端轮询间隔，高频场景下可能存在延迟。
