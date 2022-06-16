---
title: 配置文件
sidebar_position: 5
---

## 配置文件

使用 PM2 管理多个应用程序时，使用一个 JS 配置文件来组织它们。

### 生成配置

要生成示例配置文件，您可以键入以下命令：

```
$ pm2 init simple
```

这将生成一个示例`ecosystem.config.js`：

```js
module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js"
  }]
}
```

如果您正在创建自己的配置文件，请确保它以`.config.js`结尾，以便 PM2 能够将其识别为配置文件。

### 使用配置文件

与操作应用程序相比，您可以无缝启动/停止/重启/删除配置文件中包含的所有应用程序：

```bash
# Start all applications
pm2 start ecosystem.config.js

# Stop all
pm2 stop ecosystem.config.js

# Restart all
pm2 restart ecosystem.config.js

# Reload all
pm2 reload ecosystem.config.js

# Delete all
pm2 delete ecosystem.config.js
```

#### 特定进程操作

您还可以使用其名称和选项对特定应用程序进行操作`--only <app_name>`：

```
$ pm2 start ecosystem.config.js --only api-app
```

:::caution
注意：该`--only`选项也适用于启动/重启/停止/删除
:::

您甚至可以通过指定用逗号分隔每个应用程序名称，来指定要对其执行操作的多个应用程序：

```
$ pm2 start ecosystem.config.js --only "api-app,worker-app"
```

### 切换环境

您可以通过该`env_*`选项指定不同的环境变量集。

示例：

```js
module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js",
    env_production: {
       NODE_ENV: "production"
    },
    env_development: {
       NODE_ENV: "development"
    }
  }]
}
```

现在要在不同环境中的变量之间切换，请指定`--env [env name]`选项：

```
$ pm2 start process.json --env production
$ pm2 restart process.json --env development
```

### 可用的属性

可以使用以下属性微调应用程序行为和配置：

### 常用

| 字段 | 类型 | 示例 | 描述 |
|: --- |: --- |: --- |: --- |
| name | (string) | “my-api” | 应用程序名称（默认为不带扩展名的脚本文件名） |
| script | (string) | “./api/app.js”	 | 相对于 `pm2 start` 的脚本路径 |
| cwd | (string) | “/var/www/” | 将启动您的应用程序的目录 |
| args | (string) | “-a 13 -b 12” | 包含通过 CLI 传递给脚本的所有参数的字符串 |
| interpreter | (string) | “/usr/bin/python” | 解释器绝对路径（默认为`node`） |
| interpreter_args | (string) | “–harmony” | 传递给解释器的选项 |
| node_args | (string) |  | `interpreter_args` 的别名 |

### 高级特性

| 字段 | 类型 | 示例 | 描述 |
|: --- |: --- |: --- |: --- |
| instances | number | -1 | 要启动的应用实例数量 |
| exec_mode | string | “cluster” | 启动应用程序的模式，可以是“cluster”或“fork”，默认fork |
| watch | boolean 或 [] | true | 启用监视和重启功能，如果文件夹或子文件夹中的文件发生更改，您的应用程序将重新加载 |
| ignore_watch | list | \[“[\/\\]\./”, “node_modules”] | 通过监视功能忽略某些文件或文件夹名称的正则表达式列表 |
| max_memory_restart | string | “150M” | 如果超过指定的内存量，您的应用程序将重新启动。可以是“10M”、“100K”、“2G”等等…… |
| env | object | {“NODE_ENV”: “development”, “ID”: “42”} | 将出现在您的应用程序中的 `env` 变量 |
| env_ | object | {“NODE_ENV”: “production”, “ID”: “89”} | 在执行pm2时注入，`pm2 restart app.yml --env` |
| source_map_support | boolean | true | 默认为 true，[enable/disable源映射文件] |
| instance_var | string | “NODE_APP_INSTANCE” | [查看文档](./environment-variables.md) |
| filter_env | array 或 string | [ “REACT_” ] | 排除以“REACT_”开头的全局变量，并且不允许它们渗透到集群中。 |

### 日志文件

| 字段 | 类型 | 示例 | 描述 |
|: --- |: --- |: --- |: --- |
| log_date_format | (string) | “YYYY-MM-DD HH:mm Z” | 日志日期格式 |
| error_file | (string) |  | 错误文件路径 (默认为：`$HOME/.pm2/logs/XXXerr.log`) |
| out_file | (string) |  | 输出文件路径 (默认为：`$HOME/.pm2/logs/XXXout.log`) |
| combine_logs | boolean | true | 如果设置为true，则避免在日志文件后面添加进程id |
| merge_logs | boolean | true | combine_logs的别名 |
| pid_file | (string) |  | 进程id文件路径 (默认为：`$HOME/.pm2/pid/app-pm_id.pid`) |


### 控制流

| 字段 | 类型 | 示例 | 描述 |
|: --- |: --- |: --- |: --- |
| min_uptime | (string) |  | 最小正常运行时间 |
| listen_timeout | number | 8000 | 超时重新加载（单位：毫秒） |
| kill_timeout | number | 1600 | 超时发出SIGKILL信号，以供杀死进程 |
| shutdown_with_message | boolean | false | 使用`process.send(‘shutdown’)`关闭应用程序，而不是`process.kill(pid, SIGINT)` |
| wait_ready | boolean | false | 等待`process.send(‘ready’)`，而不是重新加载等待监听事件 |
| max_restarts | number | 10 | 最大重启次数 |
| restart_delay | number | 4000 | 重启延迟时间 |
| autorestart | boolean | false | 自动重启 |
| cron_restart | string | “1 0 * * *” | 定时重启 |
| vizion | boolean | false | 如果为false, PM2启动时将不带viszion特性(版本控制元数据) |
| post_update | list | [“npm install”, “echo launching the app”] | 从Keymetrics仪表板执行Pull/Upgrade操作后将执行的命令列表 |
| force | boolean | true | 默认为false。如果为true，则可以多次启动相同的脚本 |

### 部署

| 字段 | 类型 | 示例 | 描述 |
|: --- |: --- |: --- |: --- |
| key | String | $HOME/.ssh | SSH key 路径 |
| user | String |  | SSH 用户 |
| host | [String] |  | 	SSH 主机 |
| ssh_options | String 或 [String] |  | 没有命令行标志的SSH选项 |
| ref | String |  | GIT remote/branch |
| repo | String |  | GIT remote |
| path | String |  | 服务器路径 |
| pre-setup | String |  | 在本地机器上预先设置的命令或脚本路径 |
| post-setup | String |  | 在本地机器上安装后设置的命令或脚本路径 |
| pre-deploy-local | String |  | 本地预部署 |
| post-deploy | String |  | 后部署 |

### 注意事项

使用JSON应用声明时传递的所有命令行选项将被删除。

### CWD

**cwd：**您的 JSON 声明不需要与您的脚本一起存在。如果您希望在脚本以外的位置维护 JSON(s)（例如，`/etc/pm2/conf.d/node-app.json`），您将需要使用该`cwd`功能（注意，这对于使用符号链接的 capistrano 样式目录结构非常有用）。文件可以是相对于`cwd`目录的，也可以是绝对的。