---
title: 在PM2中使用转译器
sidebar_position: 4
---

## 在 PM2 中使用转译器

## 生产方式

如果您想共享、捆绑、打包或部署您的代码库，通常最好使用普通的旧 Javascript (VanillaJS)。这意味着您将拥有代码的预处理版本，然后您将执行 Javascript 入口点。

例如，通常的目录结构如下所示：

```
├── src
├── dist
└── package.json
```

其中`src`包含 `es6` 、 `coffescript` 或其他任何内容，并且`dist`是转译的 Javascript。这现在很容易用 PM2 设置，因为它会在没有任何配置的情况下启动 Javascript。

但是，在编写代码时，可能会使配置变得更加困难。说你想查看并重新开始。您将不得不查看、转译并重新启动。PM2 既不是构建系统也不是任务运行器，因此我们建议您选择第二种方式。

## 开发方式

即使我们不推荐它，这在生产工作流程中可能也能正常工作。捆绑代码更安全，这会使脚本启动过程变慢，并且可能无法使用集群模式。

### 执行解释器

将转译器与 PM2 一起使用的最简单方法是覆盖执行解释器 ( `exec_interpreter`)。请注意，如果更改此设置，您的代码将仅适用于`fork_mode`（[检查这里 fork 模式之间的差异](http://stackoverflow.com/a/36177256/1145578)）。

为此，请`--interpreter`通过 CLI 或`exec_interpreter`通过 json 配置指定选项。

#### 咖啡脚本Coffee-script

```
$ npm install -g coffee-script
$ pm2 start --interpreter coffee index.coffee
```

只需添加`--watch`一个守护程序咖啡脚本，该脚本将在文件更改时重新启动。

#### Babel

```
$ npm install -g babel-cli
$ pm2 start --interpreter babel-node index.es6
```

:::tip
请记住，这些命令仅适用于`fork_mode`。如果你想运行一个 PM2 集群，请参考下面的替代方案。
:::

### Require hook

这是我最喜欢的选择。通过在代码中注册转译器，它将作为标准 Javascript 运行。其中大多数实际上会更改节点内部的`require`，或调整 ，`module`以便在解释所需的脚本之前对其进行转译（例如[babel](https://github.com/babel/babel/blob/93e5c0e64b1a14f3b138a01c55082225084f47b4/packages/babel-register/src/node.js#L104)或[coffee](https://github.com/jashkenas/coffeescript/blob/master/lib/coffee-script/register.js#L16)）。

与实际解决方案相比，这种解决方法更像是一种黑客攻击。请记住，它会减慢脚本启动速度。

要使其工作，请在纯 Javascript 中准备一个入口点，该入口点将在包含非转译源之前调用 require 钩子。

#### Coffee-script

```js
// server.js
require('coffee/register');
require('./server.coffee');
```

#### Babel

```js
require('babel-register');
require('./server.es6');
```

查看[babeljs 文档](https://babeljs.io/docs/usage/require/)以获取更多选项。

然后，您所要做的就是启动脚本`pm2 start server.js`。由于这将使用`node`解释器，因此集群模式将按预期工作。
