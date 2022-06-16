---
title: 在docker中集成
sidebar_position: 1
---

![](/img/docker_logo.png)

## Docker 集成

在Docker容器中需要使用**pm2-runtime**。

pm2-runtime 的目标是将您的应用程序包装到合适的 Node.js 生产环境中。它解决了在容器内运行 Node.js 应用程序时的主要问题，例如：

- 高应用程序可靠性的第二个进程回退
- 流程控制
- 自动应用程序监控，使其始终保持理智和高性能
- 自动源映射发现和解析支持

此外，使用 PM2 作为容器和应用程序之间的层带来了 PM2 强大的功能，如[应用程序声明文件](../general/configuration-file.md)、可定制的[日志系统](../general/logs.md)和其他强大的功能，可以在生产环境中管理您的 Node.js 应用程序。

## 在容器内使用 PM2

在你的 Dockerfile 中添加这一行来安装 PM2：

```
$ RUN npm install pm2 -g
```

然后将`node`命令替换为`pm2-runtime`

```
CMD ["node", "app.js"]
```

到：

```
CMD ["pm2-runtime", "app.js"]
```

你现在一切都准备好了！您的 Node.js 应用程序现在已封装到适当的 Node.js 生产环境中。

### 启动配置文件

您可以将原始 Node.js 应用程序声明为配置文件（或进程文件）并设置一些配置变量，例如启用集群模式，而不是使用 PM2 运行原始 Node.js 应用程序。

让我们使用以下内容创建一个`ecosystem.config.js`文件：

```js
module.exports = [{
  script: 'app.js',
  name: 'app',
  exec_mode: 'cluster',
  instances: 2
}, {
  script: 'worker.js',
  name: 'worker'
}]
```

[此处](../general/configuration-file.md)列出了所有可用选项。

然后，您可以通过以下方式替换CMD指令：

```
CMD ["pm2-runtime", "process.yml"]
```

要在其自己的 Docker 中拆分每个进程，您可以使用 `–only [app-name]` 选项：

```
CMD ["pm2-runtime", "process.yml", "--only", "APP"]
```

### 将 exec_mode 集群与 nuxtjs 一起使用

在集群模式下运行`ecosystem.config.js` pm2 时，由于 `nuxtjs` 解析其 `rootDir` 的方式，将附加到您的 `cwd` 路径，以解决您必须在 `args` 部分指定配置路径的问题：

```js
module.exports = {
  apps: [
    {
      name: 'my-nuxtjs-app',
      exec_mode: 'cluster',
      instances: 2,
      cwd: '/var/www',
      script: './node_modules/nuxt-start/bin/nuxt-start.js',
      args: '-c /var/www/nuxt.config.js'
    }
  ]
}
```

### 查看格式

如果要更改日志输出格式，可以选择以下选项之一：

- **–json** : 将以 JSON 格式输出日志 (logstash)
- **–format** : 将以 = 样式格式输出日志
- **–raw** : 将按原样输出日志

要使用此标志之一，您只需将它们传递给 pm2-runtime：

```
CMD ["pm2-runtime", "--json", "process.yml"]
```

### 启用正常关闭

当容器收到关闭信号时，PM2 将此信号转发给您的应用程序，允许关闭所有数据库连接，等待所有查询都已处理或任何其他最终处理已完成，然后才能成功正常关闭。

捕捉关闭信号很简单。您需要在 Node.js 应用程序中添加一个侦听器并在停止应用程序之前执行所需的任何操作：

```js
process.on('SIGINT', function() {
   db.stop(function(err) {
     process.exit(err ? 1 : 0);
   });
});
```

默认情况下，PM2 在发送最终 `SIGKILL` 信号之前将等待 1600 毫秒。您可以通过设置`kill_timeout`应用程序配置文件中的选项来修改此延迟。

[在此处](../advanced/graceful-start-shutdown.md)阅读有关应用程序状态管理的更多信息

### 开发环境

您可能希望告诉开发人员在容器内进行编程，以在开发、测试和生产之间保持一致的环境。

用**pm2-dev**替换**pm2-runtime**将启用监视和重启功能。当主机文件作为 `VOLUME` 公开给容器时，这在开发容器中非常有趣。

### 使用 PM2.io

[Keymetrics.io](https://keymetrics.io/)是一个建立在 PM2 之上的监控服务，它允许轻松监控和管理应用程序（日志、重启、异常监控……）。在 Keymetrics 上创建 Bucket 后，您将获得一个公钥和一个私钥。

要使用 `pm2 -runtime`启用 Keymetrics 监控，您可以使用 CLI 选项`–public XXX`和`–secret YYY`或传递环境变量`KEYMETRICS_PUBLIC`和`KEYMETRICS_SECRET`。

通过 Dockerfile 使用 CLI 选项的示例：

```
CMD ["pm2-runtime", "--public", "XXX", "--secret", "YYY", "process.yml"]
```

或者通过环境变量：

```
ENV PM2_PUBLIC_KEY=XXX
ENV PM2_SECRET_KEY=YYY
```

或者通过 Docker 运行命令：

```
docker run --net host -e "PM2_PUBLIC_KEY=XXX" -e "PM2_SECRET_KEY=XXX" <...>
```

## pm2-运行时助手

这是 pm2-runtime 助手：

```bash
$ pm2-runtime -h

  Usage: pm2-runtime app.js

  pm2-runtime is a drop-in replacement node.js binary with some interesting production features

  Options:

    -V, --version              output the version number
    -i --instances <number>    launch [number] of processes automatically load-balanced。Increase overall performances and performance stability.
    --secret [key]             [MONITORING] keymetrics secret key
    --public [key]             [MONITORING] keymetrics public key
    --machine-name [name]      [MONITORING] keymetrics machine name
    --raw                      raw log output
    --json                     output logs in json format
    --format                   output logs formated like key=val
    --delay <seconds>          delay start of configuration file by <seconds>
    --web [port]               launch process web api on [port] (default to 9615)
    --only <application-name>  only act on one application of configuration
    --no-auto-exit             do not exit if all processes are errored/stopped or 0 apps launched
    --env [name]               inject env_[name] env variables in process config file
    --watch                    watch and restart application on file change
    --error <path>             error log file destination (default disabled)
    --output <path>            output log file destination (default disabled)
    -h, --help                 output usage information


  Commands:

    *
    start <app.js|json_file>  start an application or json ecosystem file
```
