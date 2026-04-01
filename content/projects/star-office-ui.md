---
title: "Star Office UI"
title_en: "Star Office UI"
description: "像素风格的 AI Agent 办公室状态看板，多 Agent 可视化，三语言支持"
tech: ["Phaser 3", "Flask", "JavaScript"]
github: "https://github.com/Garyko0730/Star-Office-UI-Ko"
lang: "JavaScript"
image: "https://picsum.photos/seed/staroffice/800/600"
featured: true
---

## 项目背景

在多 AI Agent 协作系统中，Agent 状态与任务进度往往缺乏直观可见的反馈机制。本项目旨在为 AI Agent 系统提供一个像素风格的可视化状态面板，使运维人员能够实时感知各 Agent 的运行状态与工作负荷。

## 我的角色

主要负责前端交互设计与状态同步逻辑实现，独立完成从 UI 架构设计到 WebSocket 通信层搭建的全流程。

## 技术方案

**前端渲染**：Phaser 3 像素游戏引擎构建办公室场景，利用其内置的 Sprite 动画系统实现 Agent 状态的流畅切换。

**后端服务**：Flask 提供 REST API 与 WebSocket 端点，接收 Agent 状态更新并广播至所有已连接的客户端。

**多语言支持**：i18n 架构支持中文、英文、韩文三语言界面，通过 JSON 语言文件管理翻译资源。

**状态同步**：客户端与服务器通过 WebSocket 维持长连接，Agent 状态变更后服务器主动推送，客户端实时更新对应 Sprite 动画帧。

## 特色功能

- 像素风格视觉设计，还原经典办公室场景
- 多 Agent 状态实时更新，状态包括：空闲、工作中、异常、离线
- 三语言界面切换（zh / en / ko）
- 支持动态增删 Agent，界面自适应布局

## 项目成果与局限

成果：已在多个 AI Agent 原型系统中集成使用，状态面板显著提升了多 Agent 系统的可观测性。

局限：当前为 2D 平面视角，未来可探索 isometric 或 3D 视角以提升视觉沉浸感；状态同步在网络波动时存在短暂延迟。
