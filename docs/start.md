---
title: 快速开始
sidebar_position: 1
---

## 快速入门

PM2 是一个守护进程管理器，它将帮助您管理和保持您的应用程序在线。PM2 入门很简单，它以简单直观的 C​​LI 形式提供，可通过 NPM 安装。

### 安装

最新的 PM2 版本可以使用 NPM 或 Yarn 安装：

```
$ npm install pm2@latest -g
# or
$ yarn global add pm2
```

要安装 Node.js 和 NPM，您可以使用[NVM](https://yoember.com/nodejs/the-best-way-to-install-node-js/)

### 启动应用

启动、守护和监控应用程序的最简单方法是使用以下命令行：

```
$ pm2 start app.js
```

或很容易启动任何其他应用程序：

```
$ pm2 start bashscript.sh
$ pm2 start python-app.py --watch
$ pm2 start binary-file -- --port 1520
```

您可以传递给 CLI 的一些选项：

```bash
# Specify an app name
--name <app_name>

# Watch and Restart app when files change
--watch

# Set memory threshold for app reload
--max-memory-restart <200MB>

# Specify log file
--log <log_path>

# Pass extra arguments to the script
-- arg1 arg2 arg3

# Delay between automatic restarts
--restart-delay <delay in ms>

# Prefix logs with time
--time

# Do not auto restart app
--no-autorestart

# Specify cron for forced restart
--cron <cron_pattern>

# Attach to application log
--no-daemon
```

如您所见，有许多选项可用于使用 PM2 管理您的应用程序。您将根据您的用例发现它们。

## 管理进程

管理应用程序状态很简单，命令如下：

```
$ pm2 restart app_name
$ pm2 reload app_name
$ pm2 stop app_name
$ pm2 delete app_name
```

而不是`app_name`你可以通过：

- `all` 对所有进程采取行动
- `id` 对特定进程 ID 采取行动

## 检查状态、日志、指标

现在你已经启动了这个应用程序，你可以检查它的状态、日志、指标，甚至可以使用[pm2.io](https://pm2.io/)获取在线仪表板。

### 列出托管应用程序

列出 PM2 管理的所有应用程序的状态：

```
$ pm2 [list|ls|status]
```

![](/img/LmRD3FN.png)

### 查看日志

实时查看日志：

```
$ pm2 logs
```

指定日志行数：

```
$ pm2 logs --lines 200
```

### 基于终端的仪表板

这是一个直接适合您的终端的实时仪表板：

```
$ pm2 monit
```

![](/img/xo0LDb7.png)

### pm2.io：监控和诊断 Web 界面

基于 Web 的仪表板，带有诊断系统的跨服务器：

```
$ pm2 plus
```

![](/img/sigMHli.png)

## 集群模式

对于 Node.js 应用程序，PM2 包括一个自动负载均衡器，它将在每个衍生进程之间共享所有 HTTP[s]/Websocket/TCP/UDP 连接。

在集群模式下启动应用程序：

```
$ pm2 start app.js -i max
```

[在此处](./general/cluster-mode.md)阅读有关集群模式的更多信息。

## 生态系统文件

您还可以创建一个名为 Ecosystem File 的配置文件来管理多个应用程序。生成生态系统文件：

```
$ pm2 ecosystem
```
:::note
ecosystem：生态系统
:::

这将生成一个 `ecosystem.config.js` 文件：

```js
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }, {
     name: 'worker',
     script: 'worker.js'
  }]
}
```

并很容易启动：

```
$ pm2 start process.yml
```

[在此处](./general/configuration-file.md)阅读有关应用程序声明的更多信息。

## 设置启动脚本

使用您在服务器`boot/reboot`时管理的进程重新启动 PM2 至关重要。要解决此问题，只需运行此命令即可生成一个活动的启动脚本：

```
$ pm2 startup
```

并冻结进程列表以自动启动：

```
$ pm2 save
```

[在此处](./general/persistent-application.md)阅读有关启动脚本生成器的更多信息。

## 重启监听

`--watch`选项很简单：

```
$ cd /path/to/my/app
$ pm2 start env.js --watch --ignore-watch="node_modules"
```

这将在当前目录 + 所有子文件夹中的任何文件更改时监视并重新启动应用程序，并且它将忽略 `node_modules` 文件夹中的任何更改`--ignore-watch="node_modules"`。

然后，您可以使用`pm2 logs`来检查重新启动的应用程序日志。

## 更新 PM2

全局安装新最版本的PM2：

```
$ npm install pm2@latest -g
```

然后更新内存中的 PM2 ：

```
$ pm2 update
```

## 备忘单

这里有一些值得了解的命令。只需在您的开发机器上使用示例应用程序或您当前的 Web 应用程序尝试它们：

```bash
# Fork mode
pm2 start app.js --name my-api # Name process

# Cluster mode
pm2 start app.js -i 0        # Will start maximum processes with LB depending on available CPUs
pm2 start app.js -i max      # Same as above, but deprecated.
pm2 scale app +3             # Scales `app` up by 3 workers
pm2 scale app 2              # Scales `app` up or down to 2 workers total

# Listing

pm2 list               # Display all processes status
pm2 jlist              # Print process list in raw JSON
pm2 prettylist         # Print process list in beautified JSON

pm2 describe 0         # Display all informations about a specific process

pm2 monit              # Monitor all processes

# Logs

pm2 logs [--raw]       # Display all processes logs in streaming
pm2 flush              # Empty all log files
pm2 reloadLogs         # Reload all logs

# Actions

pm2 stop all           # Stop all processes
pm2 restart all        # Restart all processes

pm2 reload all         # Will 0s downtime reload (for NETWORKED apps)

pm2 stop 0             # Stop specific process id
pm2 restart 0          # Restart specific process id

pm2 delete 0           # Will remove process from pm2 list
pm2 delete all         # Will remove all processes from pm2 list

# Misc

pm2 reset <process>    # Reset meta data (restarted time...)
pm2 updatePM2          # Update in memory pm2
pm2 ping               # Ensure pm2 daemon has been launched
pm2 sendSignal SIGUSR2 my-app # Send system signal to script
pm2 start app.js --no-daemon
pm2 start app.js --no-vizion
pm2 start app.js --no-autorestart
```

## 下一步是什么？

了解如何将应用程序的所有行为选项声明到[JSON 配置文件](./general/configuration-file.md)中。

了解如何进行[优雅的停止和重新启动](./advanced/graceful-start-shutdown.md)以提高可靠性。

了解如何轻松[部署](./general/deployment-system.md)和更新生产应用程序。

使用[PM2.io](https://app.pm2.io/)监控您的生产应用程序。
