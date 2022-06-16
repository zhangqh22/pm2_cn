---
title: 无守护进程，多个PM2
sidebar_position: 6
---

## 在没有 root 的情况下监听 80 端口

一般规则是您不应以 root 身份运行 node。然而，只有 root 可以绑定到小于 1024 的端口。这就是 authbind 的用武之地。Authbind 允许非 root 用户绑定到小于 1024 的端口。替换`%user%`为将运行的用户`pm2`。

```bash
sudo apt-get install authbind
sudo touch /etc/authbind/byport/80
sudo chown %user% /etc/authbind/byport/80
sudo chmod 755 /etc/authbind/byport/80
```

您还应该为运行`pm2`配置文件的用户添加一个别名，例如`~/.bashrc`或`~/.zshrc`（注意您将需要运行`source ~/.bashrc`或`source ~/.zshrc`）：

```
+alias pm2='authbind --deep pm2'
```

最后确保`pm2`更新为`authbind`：

```
authbind --deep pm2 update
```

或者只是`pm2 update`将别名添加到用户的个人资料中。

现在您可以使用 PM2 启动应用程序，无需 root 即可绑定到端口 80！

## 同一台服务器上有多个 PM2

客户端和守护进程通过 `$HOME/.pm2/pub.sock` 和 `$HOME/.pm2/rpc.sock` 中可用的socket进行通信。

您可以通过更改PM2_HOME环境变量来启动多个 PM2 实例。

```
PM2_HOME='.pm2' pm2 start echo.js --name="echo-node-1"
PM2_HOME='.pm3' pm2 start echo.js --name="echo-node-2"
```

这将启动两个不同的 PM2 实例。要列出每个不同实例管理的进程，请执行以下操作：

```
PM2_HOME='.pm2' pm2 list
PM2_HOME='.pm3' pm2 list
```

## 在 no deamon 中启动 PM2

确保在以非守护进程模式 ( `pm2 kill`)启动 PM2 之前杀死任何 PM2 实例。

启动 PM2 而不进行守护进程：

```
$ pm2 start app.js --no-daemon
```

`pm2-runtime`在 PM2 安装时还默认安装了 CLI ，它是 Node.js 二进制文件的直接替代品。

## 无状态应用

您的生产应用程序应该是无状态的，这是一条通用规则。每个数据、状态、websocket 会话、会话数据都必须通过任何类型的数据库或 PUB/SUB 系统共享。

否则，您的应用程序将很难在同一台服务器上扩展并跨越多个服务器。

例如，您可以使用[connect-redis](https://github.com/visionmedia/connect-redis)来共享会话。

我们还建议您遵循 12 因子约定：[http://12factor.net/](http://12factor.net/)

## 在服务器上设置 pm2

[如何使用 pm2 在 Ubuntu VPS 上设置 Node.js 生产环境](https://www.digitalocean.com/community/articles/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps)。

## 日志和PID文件

默认情况下，日志（错误和输出）、pid 文件、转储和 PM2 日志位于`~/.pm2/`：

```
.pm2/
├── dump.pm2
├── custom_options.sh
├── pm2.log
├── pm2.pid
├── logs
└── pids
```

## 启用 Harmony ES6

该`--node-args`选项允许向节点解释器添加参数，请键入以下命令：

```
$ pm2 start my_app.js --node-args="--harmony"
```

在 JSON 声明中：

```json
[{
  "name" : "ES6",
  "script" : "es6.js",
  "node_args" : "--harmony"
}]
```

## CoffeeScript

### CoffeeScript v1

```
pm2 install coffee-script 
pm2 start app.coffee
```

### CoffeeScript v2

```
pm2 install coffeescript
pm2 start app.coffee
```

## JSON管道

拉取请求：

- [第273章](https://github.com/Unitech/pm2/pull/273)
- [第279章](https://github.com/Unitech/pm2/pull/279)

```bash
#!/bin/bash

read -d '' my_json <<_EOF_
[{
    "name"       : "app1",
    "script"     : "/home/projects/pm2_nodetest/app.js",
    "instances"  : "4",
    "error_file" : "./logz/child-err.log",
    "out_file"   : "./logz/child-out.log",
    "pid_file"   : "./logz/child.pid",
    "exec_mode"  : "cluster_mode",
    "port"       : 4200
}]
_EOF_

echo $my_json | pm2 start -
```

## 进程标题

您可以在`PROCESS_FILE`使用 PM2 启动应用程序时指定 `env` 变量，它将设置一个进程标题。在尝试从流程中获取特定数据时，它非常有用，例如您可以使用`ps -fC name`.

## 转译器

请参阅在[在PM2中如何使用转译器](../integration/using-transpilers.md)教程。
