---
title: "YOLOv8 训练全攻略：从数据准备到模型部署"
date: "2026-03-15"
tags: ["YOLOv8", "训练", "部署"]
excerpt: "详细记录了使用 YOLOv8 构建印刷品瑕疵检测项目的完整流程，包括数据标注、训练调参、ONNX 导出与 WPF 集成。"
---

## 完整流程

### 1. 数据准备

使用 LabelImg 进行标注，YOLO 格式要求每个图像对应一个同名 .txt 文件，格式为：

```
<class_id> <x_center> <y_center> <width> <height>
```

其中坐标都是归一化值（0-1）。

### 2. 训练

```bash
yolo detect train data=defect.yaml model=yolov8n.pt epochs=100 imgsz=640
```

关键调参：
- `imgsz`: 输入分辨率，印刷瑕疵检测用 1280 效果更好
- `augment`: 开启 Mosaic 和 HSV 增强
- `patience`: 早停，设为 20 epoch

### 3. ONNX 导出

```bash
yolo export model=best.pt format=onnx opset=11
```

### 4. WPF 集成

通过 ONNX Runtime 加载模型，WebSocket 推流到 WPF 界面。
