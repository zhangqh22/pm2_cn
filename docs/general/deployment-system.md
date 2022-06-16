---
title: 系统部署
sidebar_position: 8
---

## 部署系统

PM2 具有简单但功能强大的部署系统，允许在生产环境中配置和更新应用程序。当您想一次在一台或多台服务器上的裸机服务器上部署应用程序时，这非常有用。

```bash
$ pm2 deploy <configuration_file> <environment> <command>

  Commands:
    setup                run remote setup commands
    update               update deploy to the latest release
    revert [n]           revert to [n]th last deployment or 1
    curr[ent]            output current release commit
    prev[ious]           output previous release commit
    exec|run <cmd>       execute the given <cmd>
    list                 list previous deploy commits
    [ref]                deploy to [ref], the "ref" setting, or latest tag
```

### 部署配置

要配置部署系统，请`deploy`向应用程序配置文件添加一个属性：

```js
module.exports = {
  apps : [{
    script: 'api.js',
  }, {
    script: 'worker.js'
  }],
   
  // Deployment Configuration
  deploy : {
    production : {
       "user" : "ubuntu",
       "host" : ["192.168.0.13", "192.168.0.14", "192.168.0.15"],
       "ref"  : "origin/master",
       "repo" : "git@github.com:Username/repository.git",
       "path" : "/var/www/my-repository",
       "post-deploy" : "npm install"
    }
  }
};
```

:::caution
注意：确保本地文件夹中的应用程序配置文件名为生态系统.config.js 或 pm2.config.js，因此您不需要为每个命令键入配置文件名。
:::

### 配置远程服务器

在配置远程服务器之前，请确认：

- 远程服务器安装了 PM2
- 远程服务器已授予 GIT 克隆目标存储库的权限

配置远程服务器后，您可以开始配置它们：

```
$ pm2 deploy production setup
```

:::cautiion
注意：由于app配置文件在本地文件夹中命名为ecosystem.config.js或pm2.config.js，所以不需要每次都指定文件名
:::

### 部署应用

配置远程服务器后，您现在可以部署应用程序：

```
$ pm2 deploy production
```

:::caution
注意：如果 git 报错说有本地更改但仍想推送远程 GIT 上的内容，您可以使用该`--force`选项强制部署。
:::

### 回滚到之前的部署

如果您需要回滚到以前的部署，您可以使用以下revert选项：

```bash
# Revert to -1 deployment
$ pm2 deploy production revert 1
```

### 在每台服务器上执行一个命令

要执行一次性运行命令，您可以使用以下`exec`选项：

```
$ pm2 deploy production exec "pm2 reload all"
```

### 规格

### 部署生命周期

使用 PM2 进行部署时，您可以指定在安装之前/之后和更新之前/之后执行的操作：

```bash
"pre-setup" : "echo 'commands or local script path to be run on the host before the setup process starts'",
"post-setup": "echo 'commands or a script path to be run on the host after cloning the repo'",
"pre-deploy" : "pm2 startOrRestart ecosystem.json --env production",
"post-deploy" : "pm2 startOrRestart ecosystem.json --env production",
"pre-deploy-local" : "echo 'This is a local executed command'"
```

### 多主机部署

要同时部署到多个主机，您只需在属性下的数组中声明每个主机host。

```
"host" : ["212.83.163.1", "212.83.163.2", "212.83.163.3"],
```

### 指定 SSH 密钥

您只需要添加带有公钥路径的“key”属性，请参见下面的示例：

```json
"production" : {
  "key"  : "/path/to/some.pem", // path to the public key to authenticate
  "user" : "node",              // user used to authenticate
  "host" : "212.83.163.1",      // where to connect
  "ref"  : "origin/master",
  "repo" : "git@github.com:repo.git",
  "path" : "/var/www/production",
  "post-deploy" : "pm2 startOrRestart ecosystem.json --env production"
},
```

### 故障排除

#### SSH 克隆错误

在大多数情况下，这些错误是由于`pm2`没有正确的密钥来克隆您的存储库造成的。您需要在每一步验证密钥是否可用。

步骤 1 如果您确定您的密钥正常工作，请首先尝试`git clone your_repo.git`在目标服务器上运行。如果成功，请继续下一步。如果失败，请确保您的密钥同时存储在服务器和您的 git 帐户中。

步骤 2 默认情况下`ssh-copy-id`复制默认标识，通常命名为`id_rsa`。如果这不是合适的键：

```
ssh-copy-id -i path/to/my/key your_username@server.com
```

这会将您的公钥添加到`~/.ssh/authorized_keys`文件中。

步骤 3 如果出现以下错误：

```bash
--> Deploying to production environment
--> on host mysite.com
  ○ hook pre-setup
  ○ running setup
  ○ cloning git@github.com:user/repo.git
Cloning into '/var/www/app/source'...
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights and that the repository exists.

**Failed to clone**

Deploy failed
```

…您可能想要创建一个 ssh 配置文件。这是确保为您尝试克隆的任何给定存储库使用正确的 ssh 密钥的可靠方法。请参阅[此示例](https://gist.github.com/Protosac/c3fb459b1a942f161f23556f61a67d66)：

```bash
# ~/.ssh/config
Host alias
    HostName myserver.com
    User username
    IdentityFile ~/.ssh/mykey
# Usage: `ssh alias`
# Alternative: `ssh -i ~/.ssh/mykey username@myserver.com`

Host deployment
    HostName github.com
    User username
    IdentityFile ~/.ssh/github_rsa
# Usage:
# git@deployment:username/anyrepo.git
# This is for cloning any repo that uses that IdentityFile。This is a good way to make sure that your remote cloning commands use the appropriate key
```