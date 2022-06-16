---
title: 模块系统
sidebar_position: 7
---

## PM2 模块

PM2 模块是由 PM2 安装和管理的独立软件。这些软件是从 NPM 存储库中提取的，并作为 NPM 上的通用 Javascript 库发布。

[任何人都可以创建和发布模块](#创建模块)。模块可以是[日志回滚模块](https://github.com/pm2-hive/pm2-logrotate)、[独立的 http 代理](https://github.com/gridcontrol/proxy-only)、负载均衡器、基于 Node.js 的维基百科、DNS 服务器或任何类型的实用程序。

## 管理模块

管理模块很简单：

```bash
# Install
pm2 install <module-name>

# Update a module
pm2 install <module-name>

# Install a module from GitHub (username/repository)
pm2 install pm2-hive/pm2-docker

# Force module restart
pm2 restart <module-name>

# Get more informations
pm2 describe <module-name>

# Install a module in dev mode from local folder
pm2 install .

# Generate a module boilerplate
pm2 module:generate <module-name>

# Uninstall module
pm2 uninstall <module-name>

# Publish new module (Inc Semver + Git push + NPM publish)
pm2 publish
```

## 创建模块

要生成模块示例：

```
$ pm2 module:generate <module-name>
```

现在让我们用 PM2 运行这个模块：

```
cd <module-name>
pm2 install .
```

您现在可以编辑源文件，当您更改某些内容时，PM2 将自动重新启动模块（监听选项已激活）。

显示模块日志：

```
$ pm2 logs <module-name>
```

要移除模块：

```
$ pm2 uninstall <module-name>
```

## 在Package.json配置

可以将补充信息添加到`package.json`文件中。

您可以在`config`属性和模块行为下定义配置项目，就像常见的[pm2 托管进程一样](../general/configuration-file.md)。

示例：

```json
{
  "name": "pm2-logrotate",  // Used as the module name
  "version": "1.0.0",       // Used as the module version
  "description": "my desc", // Used as the module comment
  "dependencies": {
    "pmx": "latest"
  },
  "config": {              // Default configuration values
                           // These values can be overriden with `pm2 set <module-name>:<attr> <val>`
     "days_interval" : 7,  // These value is returned once you call pmx.initModule()
     "max_size" : 5242880
  },
  "apps" : [{              // Module behavior options
    "script"             : "index.js",
    "merge_logs"         : true,
    "max_memory_restart" : "200M"
  }],
  "author": "Gataca Sanders",
  "license": "MIT"
}
```

## 模块入口

在您的主模块入口，调用`pmx.initModule(opts, fn(){});`来初始化您的模块：

```js
var pmx = require('pmx');

var conf = pmx.initModule({
  // Override PID to be monitored
  pid: pmx.resolvePidPaths(['/var/run/redis.pid']),
}, function(err, conf) {
  // Now the module is initialized
  require('./business_logic.js')(conf);
});
```

## 额外显示

安装模块后，无需 PM2 列出您的进程，您可以更改其行为以显示包含所需内容的表格。

要启用此行为，请编辑 `package.json` 并添加 `env` 部分，并将 `PM2_EXTRA_DISPLAY`设置为 `true`

```json
{
  [...]
  "apps" : [{
    "script": "index.js",
    "env": {
      "PM2_EXTRA_DISPLAY" : "true"
    }
  }],
  [...]
}
```

然后在你的代码中：

```js
var pmx = require('pmx');

pmx.configureModule({
  human_info : [
    ['Status' , 'Module ready'],
    ['Comment', 'This is a superb comment the user should see'],
    ['IP'     , 'my machine ip!']
  ]
});
```

安装模块后，您将能够看到这种表格！

![](/img/module-extra-display.png)

## 模块配置

在 `package.json` 中添加默认配置值：

```json
{
 [...]
 "config": {             // Default configuration value
    "days_interval" : 7,  // -> returned from var ret = pmx.initModule()
    "max_size" : 5242880  // -> e.g。ret.max_size
 }
 [...]
}
```

然后可以通过 `pmx.initModule()` 返回的数据访问这些值。

示例：

```js
var conf = pmx.initModule({[...]}, function(err, conf) {
  // Now we can read these values
  console.log(conf.days_interval);
});
```

### 更改值

更改模块的默认值很简单，只需执行以下操作：

```
$ pm2 set module_name:option_name <new_value>
```

示例：

```
$ pm2 set server-monitoring:days_interval 2
```

- **NOTE1**：这些变量是写入的`~/.pm2/module_conf.json`，您也可以手动编辑
- **注意2**：您可以通过显示配置变量`pm2 conf [module-name]`
- **NOTE3**：当您设置新值时，目标模块会自动重新启动
- **NOTE4**：类型转换是自动的（布尔、数字、字符串）

## 发布模块

更新或发布模块很简单。该`pm2 publish`命令将增加模块的次要版本，`git add 。`; `git commit -m "VERSION"`; `git push origin master`然后它将`npm publish`.

```
cd my-module
pm2 publish
```

## 模块 <3 关键指标

使用[Keymetrics](https://keymetrics.io/)，您可以创建带有指标监控和远程操作的自定义界面。

![](/img/mongodb-rack.png)

[pm2-mongodb 模块](https://github.com/pm2-hive/pm2-mongodb)

![](/img/server-monit.png)

[pm2-server-monit-module](https://github.com/pm2-hive/pm2-server-monit)

### pmx.initModule选项

```js
var pmx     = require('pmx');

var conf    = pmx.initModule({

    [...]

    // Customize look and feel of this module
    widget : {
      // Logo to be displayed on the top left block (must be https)
      logo  : 'https://image.url',
      theme : ['#9F1414', '#591313', 'white', 'white'],

      // Toggle horizontal blocks above main widget
      el : {
        probes : false,
        actions: false
      },

      block : {
        // Display remote action block
        actions : true,

        // Display CPU / Memory
        cpu     : true,
        mem     : true,

        // Issues count display
        issues  : true,

        // Display meta block
        meta    : true,

        // Display metadata about the probe (restart nb, interpreter...)
        meta_block : true,

        // Name of custom metrics to be displayed as a "major metrics"
        main_probes : ['Processes']
      },
    },
}, function(err, conf) {
  /**
   * Main module entry
   */
  console.log(conf);
  // Do whatever you need
  require('./business_logic.js')(conf);
});
```

### 更改配置值

在 Keymetrics 主仪表板中，模块将有一个名为“Configure”的按钮。单击它后，您将能够访问或修改 `package.json` 上公开的所有配置变量！