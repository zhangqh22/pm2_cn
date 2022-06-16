---
title: 重启策略
sidebar_position: 2
---

使用 PM2 启动应用程序时，应用程序会在自动退出、事件循环为空 (node.js) 或应用程序崩溃时自动重启。但您也可以配置额外的重启策略，例如：

- 在指定的 CRON 时间重启应用程序
- 文件更改后重启应用程序
- 当应用程序达到内存阈值时重启
- 延迟启动和自动重启
- 默认情况下，在崩溃或退出时禁用自动重启（应用程序始终使用 PM2 重启）
- 在特定的指数增长时间自动重启应用程序

## 定时重启

通过命令行：

```bash
$ pm2 start app.js --cron-restart="0 0 * * *"
# Or when restarting an app
$ pm2 restart app --cron-restart="0 0 * * *"
```

时间格式：

```
*    *    *    *    *
-    -    -    -    -
|    |    |    |    |
|    |    |    |    +----- 星期中星期几 (0 - 6) (星期天 为0)
|    |    |    +---------- 月份 (1 - 12) 
|    |    +--------------- 一个月中的第几天 (1 - 31)
|    +-------------------- 小时 (0 - 23)
+------------------------- 分钟 (0 - 59)
```

```
0 */2 * * * /sbin/service httpd restart  意思是每两个小时重启一次apache 

50 7 * * * /sbin/service sshd start  意思是每天7：50开启ssh服务 

50 22 * * * /sbin/service sshd stop  意思是每天22：50关闭ssh服务 

0 0 1,15 * * fsck /home  每月1号和15号检查/home 磁盘 

1 * * * * /home/bruce/backup  每小时的第一分执行 /home/bruce/backup这个文件 

00 03 * * 1-5 find /home "*.xxx" -mtime +4 -exec rm {} \;  每周一至周五3点钟，在目录/home中，查找文件名为*.xxx的文件，并删除4天前的文件。

30 6 */10 * * ls  意思是每月的1、11、21、31日是的6：30执行一次ls命令
```

[更多Linux crontab命令](https://www.runoob.com/linux/linux-comm-crontab.html)

可在配置文件中`cron_restart`属性：

```js
module.exports = {
  apps : [{
    name: 'Business News Watcher',
    script: 'app.js',
    instances: 1,
    cron_restart: '0 0 * * *',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
```

## 文件更改时重启

当当前目录或其子目录中的文件被修改时，PM2 可以自动重启您的应用程序：

通过命令行：

```
$ pm2 start app.js --watch
```

:::caution
注意：如果使用该`--watch`选项启动应用程序，停止应用程序不会阻止它在文件更改时重启。要完全禁用监听功能，请执行：`pm2 stop app --watch`或通过切换应用程序重启时的监听选项`pm2 restart app --watch`。
:::

可在配置文件中使用`watch: true`属性：

```
module.exports = {
  script: "app.js",
  watch: true
}
```

您可以使用以下选项指定要监听更改的文件夹、忽略文件夹和监听文件间隔：

```js
module.exports = {
  script: "app.js",
  // Specify which folder to watch
  watch: ["server", "client"],
  // Specify delay between watch interval
  watch_delay: 1000,
  // Specify which folder to ignore 
  ignore_watch : ["node_modules", "client/img"],
}
```

## 基于内存的重启策略

PM2 允许基于内存限制重新加载（如果不在集群中自动回退重启）应用程序，请注意 PM2 内部工作过程（检查内存）每 `30` 秒启动一次，因此您可能需要稍等片刻达到内存阈值后，进程会自动重启。

命令行界面：

```
$ pm2 start api.js --max-memory-restart 300M
```

可在配置文件中使用`max_memory_restart`属性：

```js
module.exports = {
  script: 'api.js',
  max_memory_restart: '300M'
}
```

:::caution
注意：单位可以是 K(ilobyte) (eg 512K)、M(egabyte) (eg 128M)、G(igabyte) (eg 1G)。
:::

## 延迟重启

使用 Restart Delay 策略设置自动重启之间的延迟：

命令行界面：

```
$ pm2 start app.js --restart-delay=3000
```

可在配置文件中使用`restart_delay`属性：

```js
module.exports = {
  script: 'app.js',
  restart_delay: 3000
}
```

## 不自动重启

如果我们希望只运行 1 次脚本并且不希望进程管理器在脚本完成运行时重启我们的脚本。

命令行界面：

```
$ pm2 start app.js --no-autorestart
```

可在配置文件中使用`autorestart`属性：

```js
module.exports = {
  script: 'app.js',
  autorestart: false
}
```

## 跳过特定退出代码的自动重启

有时您可能希望应用程序在出现故障时自动重启（即非零退出代码），而不希望进程管理器在其正常关闭时重启它（即退出代码等于 0）。

在这种情况下，您仍然可以很好地使用 PM2，并将`stop_exit_codes`选项设置为退出应跳过自动重启的代码：

命令行界面：

```
$ pm2 start app.js --stop-exit-codes 0
```

或者在配置文件中使用`stop_exit_codes`属性：

```js
module.exports = [{
  script: 'app.js',
  stop_exit_codes: [0]
}]
```

## 指数退避延迟重启

在 PM2 Runtime 上实施了新的重启模式，使您的应用程序以更智能的方式重启。当异常发生（例如数据库关闭）时，指数退避重启将增加重启之间的时间，减少您的数据库或外部供应商的压力，不是疯狂地重新启动应用程序：

命令行界面：

```
$ pm2 start app.js --exp-backoff-restart-delay=100
```

可在配置文件中使用`exp_backoff_restart_delay`属性：

```js
module.exports = {
  script: 'app.js',
  exp_backoff_restart_delay: 100
}
```

当应用程序意外崩溃并`--exp-backoff-restart-delay`激活该选项时，您将能够看到一个新的应用程序状态等待重启。

通过运行，`pm2 logs`您还将看到重启延迟增加：

```bash
PM2      | App [throw:0] will restart in 100ms
PM2      | App [throw:0] exited with code [1] via signal [SIGINT]
PM2      | App [throw:0] will restart in 150ms
PM2      | App [throw:0] exited with code [1] via signal [SIGINT]
PM2      | App [throw:0] will restart in 225ms
```

如您所见，重启之间的重启延迟将以指数移动平均线增加，直到达到重启之间的最大值 15000 毫秒。

当应用程序返回到稳定模式（正常运行时间不超过 30 秒）时，重启延迟将自动重置为 0 毫秒。