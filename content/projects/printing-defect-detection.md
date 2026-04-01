---
title: "印刷品瑕疵检测系统"
title_en: "Printing Defect Detection"
description: "基于 YOLOv8 的实时工业检测系统，支持 WebSocket 实时推流，Windows WPF 桌面应用展示"
tech: ["YOLOv8", "PyTorch", "WPF", "WebSocket", "GigE Vision"]
github: "https://github.com/Garyko0730/printing-defect-detection"
lang: "Python"
image: "https://picsum.photos/seed/printing/800/600"
featured: true
---

## 项目概述

基于 YOLOv8 的实时工业检测系统，用于印刷品瑕疵检测。支持 GigE Vision 相机采集，实时推理，并通过 WebSocket 推流到 Windows WPF 桌面应用展示。

## 技术栈

- **模型**: YOLOv8 (Ultralytics)
- **推理**: ONNX Runtime
- **桌面**: WPF (.NET)
- **通信**: WebSocket
- **相机**: GigE Vision

## 性能指标

- FPS: 35 帧稳定运行
- 延迟: 50ms 以内
- 支持多种瑕疵类型检测
