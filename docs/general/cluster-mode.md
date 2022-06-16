---
title: 集群模式
sidebar_position: 6
---

## 集群模式

集群模式允许联网的Node.js应用程序(http(s)/tcp/udp服务器)在所有可用的cpu上扩展，无需任何代码修改。根据可用cpu的数量，这将极大地提高应用程序的性能和可靠性。在底层，它使用[Node.js集群模块](https://nodejs.org/api/cluster.html)，这样伸缩后的应用程序的子进程就可以自动共享服务器端口。要了解更多信息，请参阅cluster模块是[如何工作的](https://nodejs.org/api/cluster.html#cluster_how_it_works)。

![](/img/kTAowsL.png)

## 用法

要启用**集群模式**，只需传递 `-i` 选项：

```
$ pm2 start app.js -i max
```

`max` 意味着 PM2 将自动检测可用 CPU 的数量并运行尽可能多的进程

或者通过[js/yaml/json 文件](./configuration-file.md)：

```js
module.exports = {
  apps : [{
    script    : "api.js",
    instances : "max",
    exec_mode : "cluster"
  }]
}
```

:::caution
注意：您需要将 `exec_mode` 设置为`cluster`让 PM2 知道您想要在每个实例之间进行负载平衡
:::

然后启动进程文件：

```
$ pm2 start processes.json
```

该`-i`或实例选项可以是：

- **0/max**将应用程序分布到所有 CPU
- **-1**将应用程序分布到所有 CPU - 1
- **number**将应用程序分布在多个CPU 上

## 重新加载

与`restart`杀死并重新启动进程相反，`reload`实现了**0 秒停机时间**重新加载。

要重新加载应用程序：

```
$ pm2 reload <app_name>
```

或者：

```
$ pm2 reload process.json
$ pm2 reload process.json --only api
```

如果重新加载系统未能重新加载您的应用程序，超时将回退到经典重启。

## 优雅的关闭

在生产环境中，在退出应用程序之前，您可能需要等待剩余的查询被处理或关闭所有连接。在PM2 重新加载上下文中，它可以转换为非常长的重新加载或不起作用的重新加载（回退到重新启动），这意味着您的应用程序在退出时仍有打开的连接。您可能还需要关闭所有数据库连接、清除数据队列或其他任何内容。

要优雅的关闭应用程序，您可以捕获SIGINT信号（PM2 退出时发送的第一个信号）并执行操作以等待/清除所有这些状态：

```js
process.on('SIGINT', function() {
   db.stop(function(err) {
     process.exit(err ? 1 : 0);
   });
});
```

[阅读有关优雅的关闭](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/)功能的[更多信息](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/)。

## 应用程序无状态化

确保您的[应用程序是无状态的](http://pm2.keymetrics.io/docs/usage/specifics/#stateless-apps)，这意味着进程中没有存储本地数据，例如`sessions/websocket connections`、`session-memory`和`related`。使用 `Redis`、`Mongo` 或其他数据库在进程之间共享状态。

关于如何编写高效、生产就绪的无状态应用程序的另一个资源是[十二因素应用程序宣言](https://12factor.net/)。