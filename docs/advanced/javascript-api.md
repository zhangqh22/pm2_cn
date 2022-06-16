---
title: JAVASCRIPT API
sidebar_position: 4
---

## PM2 API

PM2 可以以编程方式使用，允许直接从代码管理进程。

## 快速开始

:::caution
注意：要释放与 PM2 的连接并使您的应用程序自动退出，请确保与 pm2 断开连接`pm2.disconnect()`
:::

首先添加 PM2 作为依赖：

```
$ npm install pm2 --save
```

然后创建一个名为 `app.js` 和 `pm2-control.js` 的脚本，其中包含以下内容：

```js
const pm2 = require('pm2')

pm2.connect(function(err) {
  if (err) {
    console.error(err)
    process.exit(2)
  }

  pm2.start({
    script    : 'api.js',
    name      : 'api'
  }, function(err, apps) {
    if (err) {
      console.error(err)
      return pm2.disconnect()
    }

    pm2.list((err, list) => {
      console.log(err, list)

      pm2.restart('api', (err, proc) => {
        // Disconnects from PM2
        pm2.disconnect()
      })
    })
  })
})
```

- 这将产生或连接到本地 PM2
- 然后用名称api启动 app.js
- 显示所有使用 PM2 管理的应用程序
- 然后重新启动名称为api的应用程序
- 并断开与 PM2 的连接

### API 方法

#### pm2.connect([no_daemon_mode], fn)

连接到本地 PM2 或生成一个新的 PM2 实例。

| 参数 | 类型 | 默认值 | 描述 |
|: --- |: --- |: --- |: --- |
| [no_daemon_mode] | boolean |  | 如果为 true，它将运行一个独立的 PM2，该 PM2 将在结束时自动退出 |
| fn | function |  | 回调函数 |

#### pm2.disconnect()

断开与本地 PM2 的连接

#### pm2.start(process, fn)

启动一个进程

| 参数 | 类型 | 描述 |
|: --- |: --- |: --- |
| process | string/object | 脚本路径(相对的)或通过[选项](../general/configuration-file.md#可用的属性)的对象 |
| fn | function | 回调函数 |

#### pm2.stop(process, fn)

停止进程

| 参数 | 类型 | 描述 |
|: --- |: --- |: --- |
| process | string/number | 目标进程id或name |
| fn | function | 回调函数 |

#### pm2.restart(process, [options], fn)

重启一个进程

| 参数 | 类型 | 描述 |
|: --- |: --- |: --- |
| process | string/number | 目标进程id或name |
| [options] | object | [选项](../general/configuration-file.md#可用的属性)（也可以添加`updateEnv: true`强制更新） |
| fn | function | 回调函数 |

示例：

```js
const pm2 = require('pm2');

pm2.connect(function(err) {
    if (err) throw err;
    pm2.restart('test', {
        name: 'test2', // 进程名称由 test 改成 test2
        args: '-e development' // 添加参数
    }, function() {
        console.log('rmq conn is null pm2 restart');
    });
});
```

#### pm2.reload(process, fn)

重新加载进程

| 参数 | 类型 | 描述 |
|: --- |: --- |: --- |
| process | string/number | 目标进程id或name |
| fn | function | 回调函数 |

#### pm2.delete(process, fn)

删除进程

| 参数 | 类型 | 描述 |
|: --- |: --- |: --- |
| process | string/number | 目标进程id或name |
| fn | function | 回调函数 |

#### pm2.killDaemon(fn)

杀死 pm2 守护进程（与`pm2 kill`相同）。

:::caution
请注意，当守护进程被杀死时，它的所有进程也会被杀死。另请注意，即使在您杀死它之后，您仍然必须明确断开与守护程序的连接。
:::

#### pm2.describe(process, fn)

从目标进程获取所有元数据

| 参数 | 类型 | 描述 |
|: --- |: --- |: --- |
| process | string/number | 目标进程id或name |
| fn | function | 回调函数 |

#### pm2.list(fn)

检索所有用 PM2 管理的进程

### 高级方法

#### pm2.sendDataToProcessId(packet)

将数据发送到目标进程。

| 参数 | 类型 | 描述 |
|: --- |: --- |: --- |
| packet.id | number | 目标进程id |
| packet.type | string | 必须是一个**process:msg** |
| packet.topic | boolean | 必须为`true` |
| packet.data | object | 将被发送到目标进程的对象数据 |

目标进程将通过以下方式接收数据：

```js
process.on('message', function(packet) {})
```

#### pm2.launchBus(fn)

这允许从用 PM2 管理的进程接收消息。

```js
const pm2 = require('pm2')

pm2.launchBus(function(err, pm2_bus) {
  pm2_bus.on('process:msg', function(packet) {
    console.log(packet)
  })
})
```

然后从一个用 PM2 管理的进程：

```js
process.send({
  type : 'process:msg',
  data : {
    success : true
  }
})
```
#### pm2.sendSignalToProcessName(signal, process, fn)

将自定义系统信号发送到目标进程名称

| 参数 | 类型 | 描述 |
|: --- |: --- |: --- |
| signal | string | 系统信号名称 |
| process | string | 目标进程名称 |
| fn | function | Callback(err, process) |

#### pm2.sendSignalToProcessId(signal, process, fn)

将自定义系统信号发送到目标进程 ID

| 参数 | 类型 | 描述 |
|: --- |: --- |: --- |
| signal | string | 系统信号名称 |
| process | string | 目标进程名称 |
| fn | function | Callback(err, process) |

### 进程结构

调用上述任何方法时，都会返回一个突变的进程数组。该对象包含：

- processDescription - 包含进程信息的对象数组。每个对象都包含以下属性：
  - name - 原始启动命令中给出的名称。
  - pid - 进程的 pid。
  - pm_id -为的PID PM2神守护进程。
  - monit - 一个包含以下内容的对象：
      - 内存- 进程正在使用的字节数。
      - cpu - 当前进程使用的 CPU 百分比。
  - pm2_env - 进程环境中的路径变量列表。这些变量包括：
      - pm_cwd - 进程的工作目录。
      - pm_out_log_path - 标准输出日志文件路径。
      - pm_err_log_path - stderr 日志文件路径。
      - exec_interpreter - 使用的解释器。
      - pm_uptime - 进程的正常运行时间。
      - 不稳定的重启 - 进程已经经历的不稳定重启的次数。
      - 重启时间
      - 状态- “online”, “stopping”, “stopped”, “launching”, “errored”, or “one-launch-status”
      - 实例- 正在运行的实例数。
      - pm_exec_path - 在此进程中运行的脚本的路径。

### 示例

#### 发送消息处理

pm2-call.js：

```js
const pm2 = require('pm2')

pm2.connect(function() {
  pm2.sendDataToProcessId({
    // id of procces from "pm2 list" command or from pm2.list(errback) method
    id   : 1,
    // process:msg will be send as 'message' on target process
    type : 'process:msg',
    // Data to be sent
    data : {
      some : 'data'
    },
    topic: true
  }, function(err, res) {
  })
})

// Listen to messages from application
pm2.launchBus(function(err, pm2_bus) {
  pm2_bus.on('process:msg', function(packet) {
    console.log(packet)
  })
})
```

pm2-app.js：

```js
process.on('message', function(packet) {
  process.send({
    type : 'process:msg',
    data : {
     success : true
    }
 });
});
```