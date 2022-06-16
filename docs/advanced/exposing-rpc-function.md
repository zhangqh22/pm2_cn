---
title: 暴露RPC函数
sidebar_position: 2
---

## 公开 RPC 方法：进程操作

公开 RPC 方法将允许您与正在运行的进程进行实时交互。

优点：

- 改变行为（例如将日志切换到调试）
- 检索数据结构
- 触发动作

### 快速开始

首先安装`tx2`模块：

```
$ npm install tx2
```

然后创建一个名为 `rpc.js` 的应用程序：

```js
const tx2 = require('tx2')

tx2.action('hello', (reply) => {
  reply({ answer : 'world' })
i})

setInterval(function() {
  // Keep application online
}, 100)
```

启动：

```
$ pm2 start rpc.js
```

要触发流程操作，请使用以下命令：

```bash
$ pm2 trigger <application-name> <action-name>
# pm2 trigger rpc hello
```

### 列出可用的 RPC 方法

列出所有可用的 RPC 方法：

```bash
pm2 show <application-name>
# pm2 show rpc
```

### 传递参数

要将参数传递给远程函数，只需将`param`属性添加到回调中：

```js
var tx2 = require('tx2')

tx2.action('world', function(param, reply) {
  console.log(param)
  reply({success : param})
})
```

重新启动您的应用程序并使用 PM2 调用此进程函数：

```bash
pm2 trigger <application-name> <action-name> [parameter]
# pm2 trigger rpc world somedata
```

### 从 Web 仪表板触发

从您的应用程序公开的所有 RPC 方法，一旦连接到[pm2.io](https://app.pm2.io/)将显示并可以从 Web 界面操作。

## TX2 API 文档

[https://github.com/pm2/tx2/blob/main/API.md](https://github.com/pm2/tx2/blob/main/API.md)