---
title: 日志
sidebar_position: 3
---

## 应用程序日志

使用 PM2 启动应用程序后，您可以轻松查看和管理日志。

日志文件位于文件夹中`$`HOME/.pm2/logs`。

### 日志视图

要显示应用程序的日志，您可以使用命令 `pm2 logs`

```bash
$ pm2 logs -h

  Usage: logs [options] [id|name|namespace]

  stream logs file。Default stream all logs

  Options:

    --json                json log output
    --format              formated log output
    --raw                 raw output
    --err                 only shows error output
    --out                 only shows standard output
    --lines <n>           output the last N lines, instead of the last 15 by default
    --timestamp [format]  add timestamps (default format YYYY-MM-DD-HH:mm:ss)
    --nostream            print logs without lauching the log stream
    --highlight [value]   highlights the given value
    -h, --help            output usage information
```

一些重要的命令：

```bash
# Display all apps logs in realtime
pm2 logs

# Display only `api` application logs
pm2 logs api

# Display new logs in json
pm2 logs --json

# Display 1000 lines of api log file
pm2 logs big-api --lines 1000
```

您还可以使用 CLI 仪表板检查日志：

```
$ pm2 monit
```

## 日志大小限制

模块[pm2-logrotate](https://github.com/keymetrics/pm2-logrotate)使用有限的磁盘空间自动回滚并保留所有日志文件。

安装：

```
$ pm2 install pm2-logrotate
```

[在此处](https://github.com/pm2-hive/pm2-logrotate#configure)阅读有关 pm2-logrotate 的更多信息

## 清空日志

这将清空 PM2 管理的当前应用程序日志：

```
pm2 flush

pm2 flush <api> # Clear the logs for the app with name/id matching <api>
```

## 应用程序日志选项

启动应用程序时，您可以指定许多选项

### 命令行界面

运行时，`pm2 start app.js [OPTIONS]`您可以将这些选项中的任何一个传递给 CLI：

```bash
-l --log [path]              specify filepath to output both out and error logs
-o --output <path>           specify out log file
-e --error <path>            specify error log file
--time                       prefix logs with standard formated timestamp
--log-date-format <format>   prefix logs with custom formated timestamp
--merge-logs                 when running mutiple process with same app name, do not split file by id
```

### 使用日期自动为日志添加前缀

要轻松地为应用程序日志添加前缀，您可以传递选项`--time`：

```bash
$ pm2 start app.js --time
# Or a running app
$ pm2 restart app --time
```

### 配置文件

通过配置文件，您可以传递选项：

| 字段 | 类型 | 示例 | 描述 |
|: --- |: --- |: --- |: --- |
| error_file | (string) |  | 错误文件路径（默认为 `$HOME/.pm2/logs/XXXerr.log`） |
| out_file | (string) |  | 输出文件路径（默认为 `$HOME/.pm2/logs/XXXout.log`） |
| pid_file | (string) |  | pid 文件路径（默认为 `$HOME/.pm2/pid/app-pm_id.pid`） |
| merge_logs | boolean | true | 如果设置为 true，则避免使用进程 id 后缀日志文件 |
| log_date_format | (string) | “YYYY-MM-DD HH:mm Z” | 日志日期格式（见日志部分） |

### 禁用日志后缀

仅适用于集群模式 (node.js) 中的应用程序；如果您希望集群进程的所有实例都登录到同一个文件中，您可以使用该选项`--merge-logs`或`merge_logs: true`

### 禁用日志记录

要禁用所有日志写入磁盘，您可以设置选项`out_file`和`error_file`为`/dev/null`

```js
module.exports = {
  apps : [{
    name: 'Business News Watcher',
    script: 'app.js',
    instances: 1,
    out_file: "/dev/null",
    error_file: "/dev/null"
    cron_restart: '0 0 * * *'
    [...]
  }]
}
```

您可以提供`/dev/null`或`NULL`作为日志的输出（不取决于平台，它们是硬编码的字符串）。

### 设置原生 logrotate

```
$ sudo pm2 logrotate -u user
```

这将编写一个基本的 logrotate 配置`/etc/logrotate.d/pm2-user`，如下所示：

```
/home/user/.pm2/pm2.log /home/user/.pm2/logs/*.log {
  rotate 12
  weekly
  missingok
  notifempty
  compress
  delaycompress
  create 0640 user user
}
```