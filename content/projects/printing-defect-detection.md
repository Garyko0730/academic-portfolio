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

## 项目背景

印刷品生产线上，传统人工目检效率低且易疲劳，难以满足高速产线的实时检测需求。本项目旨在构建一套端到端的视觉检测系统，对印刷品表面的划痕、污点、色差等常见缺陷进行自动识别与分类。

## 我的角色

主要负责算法开发与系统集成，包括模型选型与训练、推理链路搭建、以及与桌面端团队协作完成端到端联调。

## 技术方案

**模型**：采用 YOLOv8 作为检测 backbone，利用其 Anchor-free 特性简化训练流程，并通过解耦检测头提升收敛速度。

**端到端链路**：
- **相机采集**：GigE Vision 工业相机，实时获取产线图像流
- **模型推理**：PyTorch 训练 → ONNX 导出 → ONNX Runtime 部署，支持 35fps 稳定推理
- **实时推流**：WebSocket 将检测结果推送至 Windows 桌面端
- **桌面展示**：WPF 应用接收推流数据，叠加检测框可视化

**性能指标**：
- 帧率：35fps 稳定运行
- 推理延迟：<50ms
- 支持多种瑕疵类型（划痕、污点、色差等）

## 项目成果与局限

成果：实现了产线环境下的实时检测验证，模型可直接部署至实际工业场景。

局限：当前为单相机方案，多相机并行场景下的负载均衡尚未实现；缺陷类别有限，对复合缺陷的识别能力有待提升。
