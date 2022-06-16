---
title: 进程管理
sidebar_position: 1
---

## 管理应用程序状态

使用 PM2，您可以在后台很容易的启动/重启/重新加载/停止/列出应用程序。

### 启动

要启动应用程序：

```cmd
$ pm2 start api.js
```

![](/img/123512784-b0341900-d689-11eb-93d4-69510ee2be27.png)

您还可以启动任何类型的应用程序，如 `bash` 命令、脚本、二进制文件：

```
$ pm2 start "npm run start"
$ pm2 start "ls -la"
$ pm2 start app.py
```

### 启动并查看日志

要启动应用程序并查看日志，请使用以下`--attach`选项：

```
$ pm2 start api.js --attach
```

通过 `Ctrl-C` 退出时，应用程序仍将在后台运行。

### 传递参数

之后`--`传递的所有选项都将作为参数传递给应用程序：

```
$ pm2 start api.js -- arg1 arg2
```

:::caution
注意：通过`--`传递参数在 **powershell** 终端下无效，需要在 **cmd** 终端下才行。
:::

### 配置文件

当同时管理多个应用程序或必须指定多个选项时，您可以使用配置文件。此 `ecosystem.config.js` 文件的示例：

```js
module.exports = {
  apps : [{
    name   : "limit worker",
    script : "./worker.js",
    args   : "limit"
  },{
    name   : "rotate worker",
    script : "./worker.js",
    args   : "rotate"
  }]
}
```

然后启动这两个应用程序：

```
$ pm2 start ecosystem.config.js
```

[在此处](./general/configuration-file.md)阅读有关配置文件的更多信息。

### 重启

要重新启动应用程序：

```
$ pm2 restart api
```

要重新启动所有应用程序：

```
$ pm2 restart all
```

要一次重新启动多个应用程序：

```
$ pm2 restart app1 app3 app4
```

### 更新环境变量和选项

要更新环境变量或 PM2 选项，请指定`--update-envCLI` 选项：

```
$ NODE_ENV=production pm2 restart web-interface --update-env
```

### 停止

要停止指定的应用程序：

```
$ pm2 stop api
$ pm2 stop [process_id]
```

要阻止他们：

```
$ pm2 stop all
```

一次停止多个应用程序：

```
$ pm2 stop app1 app3 app4
```

:::caution
注意：这不会从 PM2 应用程序列表中删除该应用程序。请参阅下一节以删除应用程序。
:::

### 删除

要停止和删除应用程序：

```
$ pm2 delete api
```

要全部删除它们：

```
$ pm2 delete all
```

## 列出应用程序

列出所有正在运行的应用程序：

```
$ pm2 list
# Or
$ pm2 [list|ls|l|status]
```

![](/img/123511260-a3f78e00-d680-11eb-8907-3f1017ef7dc8.png)

要指定您希望应用程序列出的顺序：

```
$ pm2 list --sort name:desc
# Or
$ pm2 list --sort [name|id|pid|memory|cpu|status|uptime][:asc|desc]
```

### 终端仪表板

PM2 为您提供了一种监视应用程序资源使用情况的简单方法。您可以通过终端轻松直接地监控内存和 CPU：

```
$ pm2 monit
```

![](/img/pm2-monit.png)

### 显示应用程序元数据

要显示有关应用程序的元数据：

```
$ pm2 show api
```

![](/img/123510635-fafb6400-d67c-11eb-8534-0ce6106979b2.png)

### 重置重启次数

重置重启计数器：

```
$ pm2 reset all
```