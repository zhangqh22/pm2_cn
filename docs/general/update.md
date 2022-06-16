---
title: 更新PM2
sidebar_position: 10
---

## 更新 PM2

更新 PM2 非常快（不到几秒钟）且无缝升级。

### 更新 PM2 的过程

安装最新的 PM2 版本：

```
$ npm install pm2 -g
```

您现在可以通过以下命令更新内存中的 PM2 守护进程：

```
$ pm2 update
```

### Node.js 版本升级

升级 Node.js 安装时，请确保同时更新从 PM2 开始的 Node.js 版本。

要更新 PM2 启动脚本，请运行：

```
$ pm2 unstartup
$ pm2 startup
```
