---
title: 优雅的启动/关闭
sidebar_position: 1
---

## 优雅的关闭

为了允许正常重启/重新加载/关闭进程，请确保在让应用程序退出之前拦截SIGINT信号并清除所需的所有内容（例如数据库连接、处理业务……）。

```js
process.on('SIGINT', function() {
   db.stop(function(err) {
     process.exit(err ? 1 : 0)
   })
})
```

现在`pm2 reload`会变成一个优雅的Reload。

### 配置超时终止

通过 CLI，这会将超时延长至 3000 毫秒：

```
$ pm2 start app.js --kill-timeout 3000
```

可在配置文件中使用`kill_timeout`属性：

```js
module.exports = {
  apps : [{
    name: 'app',
    script: './app.js',
    kill_timeout : 3000
  }]
}
```

## 优雅的开始

有时您可能需要等待您的应用程序与您的 `DBs/caches/workers/whatever` 建立连接。PM2 需要等待，然后才能将您的申请视为`online`。为此，您需要提供`--wait-ready`给 CLI 或`wait_ready: true`在流程文件中提供。这将使 PM2 监听该事件。在您的应用程序中，当您希望应用程序被视为准备就绪，您需要添加`process.send('ready')`。

```js
var http = require('http')

var app = http.createServer(function(req, res) {
  res.writeHead(200)
  res.end('hey')
})

var listener = app.listen(0, function() {
  console.log('Listening on port ' + listener.address().port)
  // Here we send the ready signal to PM2
  process.send('ready')
})
```

然后启动应用程序：

```
$ pm2 start app.js --wait-ready
```

### 配置超时等待就绪

默认情况下，PM2 等待ready信号的时间为 3000 毫秒。

通过 CLI，这会将超时延长到 10000 毫秒：

```
$ pm2 start app.js --wait-ready --listen-timeout 10000
```

可在配置文件中使用`listen_timeout` 和 `wait_ready`属性：

```js
module.exports = {
  apps : [{
    name: 'app',
    script: './app.js',
    wait_ready: true,
    listen_timeout: 10000
  }]
}
```

### 使用 http.Server.listen 优雅开始

仍然存在挂载到`http.Server.listen`方法的默认系统。当您的 http 服务器接受连接时，它会自动将您的应用程序声明为就绪。您可以使用与`--wait-ready`优雅启动相同的变量来增加监听的 PM2 等待时间：在配置文件中添加`listen_timeout`属性或通过 CLI 指定`--listen-timeout=XXXX`。

## 说明：信号流

当 PM2 关闭/重新启动进程时，一些系统信号会按给定顺序发送到您的进程。

首先SIGINT a 信号发送到您的进程，您可以捕获该信号以了解您的进程将要关闭。如果您的应用程序在 1.6 秒（[可定制](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/#customize-exit-delay)）之前没有自行退出，它将收到SIGKILL信号以强制进程退出。

通过设置环境变量`PM2_KILL_SIGNAL`可以在任何其他信号（例如`SIGTERM`）上替换信号`SIGINT`。

## 在Windows上优雅的关闭

当信号不可用时，您的进程将被杀死。在这种情况下，您必须`--shutdown-with-message`通过 CLI 或`shutdown_with_message`在生态系统文件中使用并监听`shutdown`事件。

通过命令行：

```
$ pm2 start app.js --shutdown-with-message
```

可在[配置文件](https://pm2.keymetrics.io/docs/usage/application-declaration/)中使用`listen_timeout` 和 `wait_ready`属性：

```js
module.exports = {
  apps : [{
    name: 'app',
    script: './app.js',
    shutdown_with_message: true
  }]
}
```

监听`shutdown`事件

```js
process.on('message', function(msg) {
  if (msg == 'shutdown') {
    console.log('Closing all connections...')
    setTimeout(function() {
      console.log('Finished closing connections')
      process.exit(0)
    }, 1500)
  }
})
```