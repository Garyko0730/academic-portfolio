---
title: "PyTorch 分布式训练实战：多卡并行那些坑"
date: "2026-02-28"
tags: ["PyTorch", "分布式", "训练"]
excerpt: "总结了在多卡分布式训练中遇到的通信瓶颈、梯度同步与学习率调度问题及解决方案。"
---

## 常见问题

### NCCL 连接失败

多机训练时 NCCL 初始化失败，检查：
1. NCCL 版本与 PyTorch 匹配
2. 节点间网络互通（`nccl-test`）
3. 防火墙开放 29500 端口

### 梯度同步

`DistributedDataParallel` 默认全局同步，使用 `no_sync()` 可以临时禁止同步以节省通信。

### 学习率调度

分布式训练时学习率需要线性缩放：
```python
lr = base_lr * world_size * max(1.0, epoch/10)
```
