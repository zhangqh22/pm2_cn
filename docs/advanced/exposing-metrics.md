---
title: 暴露指标
sidebar_position: 3
---

## 公开指标

通过将自定义指标插入您的代码，您将能够实时监控代码中的值。

### 快速开始

首先安装[tx2](https://github.com/pm2/tx2)模块：

```
$ npm install tx2
```

然后创建一个名为 monit.js 的应用程序：

```js
const tx2 = require('tx2')
const http = require('http')

let meter = tx2.meter({
  name      : 'req/sec',
  samples   : 1,
  timeframe : 60
})

http.createServer((req, res) => {
  meter.mark()
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write('Hello World!')
  res.end()
}).listen(6001)
```

并从 PM2 开始：

```
$ pm2 start monit.js
```

现在使用以下命令显示指标：

```bash
$ pm2 show [app]
# pm2 show monit
```

:::caution
注意：指标位于“自定义指标”部分。
:::

![](/img/processmetrics.png)

或者您可以使用基于终端的界面：

```
$ pm2 monit
```

![](/img/WHDEvHg.png)

## 可用的指标助手

然后，您可以编写自己的指标来跟踪重要信息。有 4 种不同的方式可供选择：

- **简单指标**：可以立即读取的值
  - 例如。监控变量值
- **计数器**：增加或减少的东西
  - 例如。正在处理下载，用户已连接
- **Meter**：作为事件/间隔测量的事物
  - 例如。每分钟请求一个 http 服务器
- **直方图**：保留偏向最后 5 分钟的统计相关值的库，以探索它们的分布
  - 例如。监视对数据库的查询执行的平均值

### API 文档

注意：请参阅[TX2 API 文档](https://github.com/pm2/tx2/blob/main/API.md)

### 示例

#### 简单指标：简单的价值报告

这允许公开可以立即读取的值。

```js
const tx2 = require('tx2')

// Here the value function will be called each second to get the value
var metric = tx2.metric({
  name    : 'Realtime user',
  value   : function() {
    return Object.keys(users).length
  }
})

// Here we are going to call valvar.set() to set the new value
var valvar = tx2.metric({
  name    : 'Realtime Value'
})

valvar.set(23)
```

#### 计数器：顺序值变化

递增或递减的值。

计算活动 Http 请求的示例：

```
const tx2 = require('tx2')
var http = require('http')

var counter = tx2.counter({
  name : 'Active requests'
})

http.createServer(function (req, res) {
  counter.inc()

  req.on('end', function() {
    // Decrement the counter, counter will eq 0
    counter.dec()
  })
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write('Hello World!')
  res.end()
}).listen(6001)
```

#### 仪表：平均计算值

作为事件/间隔测量的值。

计算每秒查询数的示例：

```js
const tx2 = require('tx2')
var http = require('http')

var meter = tx2.meter({
  name      : 'req/sec',
  samples   : 1,
  timeframe : 60
})

http.createServer(function (req, res) {
  meter.mark()
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write('Hello World!')
  res.end()
}).listen(6001)
```

`samples`选项是速率单位。默认为1秒。 时间范围选项是分析事件的时间范围。默认为60秒。

#### 直方图

保留一组偏向于最后 5 分钟的统计相关值，以探索它们的分布。

```js
const tx2 = require('tx2')

var histogram = tx2.histogram({
  name        : 'latency',
  measurement : 'mean'
})

var latency = 0

setInterval(function() {
  latency = Math.round(Math.random() * 100)
  histogram.update(latency)
}, 100)
```
