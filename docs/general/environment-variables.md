---
title: 环境变量
sidebar_position: 9
---

## 当启动新进程时

PM2 将在启动新进程时按以下顺序注入环境：

- 通过命令行注入
- 通过配置文件注入

```js
module.exports = {
  apps : [
    {
      name: "myapp",
      script: "./app.js",
      watch: true,
      env: {
        "NODE_ENV": "development",
      }
    }
  ]
}
```

在这里可以看到 PM2 会覆盖当前环境来添加`NODE_ENV=development`。但是你也可以像这样定义不同的环境：

```js
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        watch: true,
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 80,
            "NODE_ENV": "production",
        }
      }
  ]
}
```

默认使用`env`环境，但您可以指定`env_production`使用`pm2 start ecosystem.config.js --env production`.

您可以定义任意您想要的环境变量，但请记住，配置项需要以`env_`开头加环境变量名称，然后在`--env`参数项目后指定。

## 具体环境变量

### NODE_APP_INSTANCE（PM2 2.5最低版本）

`NODE_APP_INSTANCE`环境变量用于区分进程，例如您可能只想在一个进程上运行 cronjob，您可以检查是否`process.env.NODE_APP_INSTANCE === '0'`。两个进程永远不可能有相同的编号，在`pm2 restart`和`pm2 scale`命令之后仍然如此。

你可能会在`NODE_APP_INSTANCE`名称的[ node-config](https://github.com/Unitech/pm2/issues/2045)中遇到问题，所以你可以用`instance_var`选项重命名它:

```js
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        watch: true,
        instance_var: 'INSTANCE_ID',
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        }
      }
  ]
}
```

在这种情况下，变量将具有相同的行为，但将位于`process.env.INSTANCE_ID`中。

#### increment_var（PM2 2.5最低版本）

有一个选项可以让 PM2 为每个启动的实例增加一个环境变量，例如：

```js
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        instances: 2,
        exec_mode: "cluster",
        watch: true,
        increment_var : 'PORT',
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        }
      }
  ]
}
```

在这个示例中，如果我运行`pm2 start ecosystem.config.js`：

- PM2将会为每个实例增加的`PORT`变量
- 默认值 `3000`端嗯
- 第一个实例将具有`process.env.PORT = 3000`，第二个`process.env.PORT = 3001`

:::caution
注意：在使用`pm2 scale myapp 4`，它也会增加，两个新实例都将具有`3002`和`3003`作为`PORT`变量。
:::
