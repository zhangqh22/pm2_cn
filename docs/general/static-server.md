---
title: PM2作为静态服务器
sidebar_position: 7
---

## 通过 http 提供静态文件

PM2 可以使用`pm2 serve`功能非常轻松地提供静态文件。它支持从指定文件夹提供原始文件，或者您可以使用它提供 SPA（单页应用程序）。

## 命令行界面

使用简单的命令通过 http 提供您的静态文件（如前端应用程序）：

```
$ pm2 serve <path> <port>
```

如果您没有指定`<path>`，将使用当前文件夹，端口默认为`8080`。您可以使用与普通应用程序相同的选项，例如`--name`或`--watch`。

## 在进程文件中配置

您可以在进程文件中声明您希望提供一个指定目录：

```js
module.exports = {
  script: "serve",
  env: {
    PM2_SERVE_PATH: '.',
    PM2_SERVE_PORT: 8080
  }
}
```

您只需要在env 变量中添加`PM2_SERVE_PATH`和`PM2_SERVE_PORT`以指定路径和端口，默认值与 CLI 相同。

## 单页应用SPA：全部重定向到index.html

要将所有查询自动重定向到 index.html，请使用以下`--spa`选项：

```
$ pm2 serve --spa
```

进程文件配置如下：

```js
module.exports = {
  script: "serve",
  env: {
    PM2_SERVE_PATH: '.',
    PM2_SERVE_PORT: 8080,
    PM2_SERVE_SPA: 'true',
    PM2_SERVE_HOMEPAGE: './index.html'
  }
}
```

## 使用密码进行访问控制

您可以使用`--basic-auth-username`和`--basic-auth-password`：

```
$ pm2 serve --basic-auth-username <username> --basic-auth-password <password>
```

进程文件配置如下：

```js
module.exports = {
  script: "serve",
  env: {
    PM2_SERVE_PATH: '.',
    PM2_SERVE_PORT: 8080,
    PM2_SERVE_BASIC_AUTH: 'true',
    PM2_SERVE_BASIC_AUTH_USERNAME: 'example-login',
    PM2_SERVE_BASIC_AUTH_PASSWORD: 'example-password'
  }
}
```