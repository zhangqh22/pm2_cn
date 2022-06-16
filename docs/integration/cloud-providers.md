---
title: 在云服务中使用PM2
sidebar_position: 2
---

## 在云提供商上使用 PM2

您可能会发现自己无法访问 CLI 来启动 Node.js 应用程序。

在这种情况下，必须将 pm2 添加为依赖项，并且必须使用启动脚本调用。

## 准备您的应用

### 设置您的生态系统文件

使用以下命令生成`ecosystem.config.js`模板：

```
$ pm2 init
```

修改生态系统文件以满足您的需求：

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
  }]
}
```

[在此处](../general/configuration-file.md)了解有关生态系统文件的更多信息。

### 添加 PM2 模块

将 pm2 作为依赖项添加到您的项目中。

使用 npm：

```
$ npm install pm2
```

用 yarn：

```
$ yarn add pm2
```

### 在 package.json 中启动脚本

在您的 中`package.json`，修改您的`start`脚本，如下所示：

```json
{
  "scripts": {
    "start": "pm2-runtime start ecosystem.config.js --env production"
  }
}
```

## 部署您的应用

您现在可以在您的云提供商中部署您的应用程序，就像您在常规 node.js 应用程序中所做的那样。