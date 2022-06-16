---
title: 持久化应用
sidebar_position: 4
---

## 持久性应用程序：启动脚本生成器

PM2 可以生成启动脚本并对其进行配置，以便在预期或意外的机器重新启动时保持您的进程列表完整。

### 生成启动脚本

要自动生成和配置启动脚本，只需键入命令（不带 sudo）`pm2 startup`：

```bash
$ pm2 startup
[PM2] You have to run this command as root。Execute the following command:
      sudo su -c "env PATH=$PATH:/home/unitech/.nvm/versions/node/v14.3/bin pm2 startup <distribution> -u <user> --hp <home-path>
```

然后将显示的命令复制/粘贴到终端上：

```bash
sudo su -c "env PATH=$PATH:/home/unitech/.nvm/versions/node/v14.3/bin pm2 startup <distribution> -u <user> --hp <home-path>
```

现在 PM2 将在启动时自动重启。

:::caution
注意：您可以通过`--service-name <name>`选项（[#3213](https://github.com/Unitech/pm2/pull/3213)）自定义服务名称
:::

### 保存要在重启时恢复的应用程序列表

启动所有所需的应用程序后，保存应用程序列表，以便在重新启动后重新生成：

```
$ pm2 save
```

### 手动恢复进程

要手动恢复以前保存的进程（借助于 `pm2 save`）：

```
$ pm2 resurrect
```

### 禁用启动系统

要禁用和删除当前的启动配置：

```
$ pm2 unstartup
```

### 具体了解

#### Node.js 版本升级后更新启动脚本

当您升级本地 Node.js 版本时，请务必更新 PM2 启动脚本，以便它运行您安装的最新 Node.js 二进制文件。

首先禁用并删除当前的启动配置（复制/粘贴该命令的输出）：

```
$ pm2 unstartup
```

然后恢复一个全新的启动脚本：

```
$ pm2 startup
```

#### 用户权限

假设您希望在另一个用户下执行启动脚本。

只需更改`-u <username>`选项和`--hp <user_home>`：

```
$ pm2 startup ubuntu -u www --hp /home/ubuntu
```

#### 指定初始化系统

如果您愿意，您可以指定您自己使用的平台（其中平台可以是上述任一平台）：

```
$ pm2 startup [ubuntu | ubuntu14 | ubuntu12 | centos | centos6 | arch | oracle | amazon | macos | darwin | freebsd | systemd | systemv | upstart | launchd | rcd | openrc]
```

#### SystemD安装检查

```bash
# Check if pm2-<USER> service has been added
$ systemctl list-units
# Check logs
$ journalctl -u pm2-<USER>
# Cat systemd configuration file
$ systemctl cat pm2-<USER>
# Analyze startup
$ systemd-analyze plot > output.svg
```

为了有效地等待PM2运行，该机器处于在线状态:

```bash
[Unit]
Wants=network-online.target
After=network.target network-online.target

[....]

[Install]
WantedBy=multi-user.target network-online.target
```

#### Windows 启动脚本

要生成 Windows 兼容的启动脚本，请查看优秀的[pm2-installer](https://github.com/jessety/pm2-installer)

#### 支持初始化系统

- **systemd**：Ubuntu >= 16，CentOS >= 7，Arch，Debian >= 7
- **新贵**：Ubuntu <= 14
- **启动**：达尔文，MacOSx
- **openrc**: Gentoo Linux, Arch Linux
- **rcd**: FreeBSD
- **vsystemv**: Centos 6, Amazon Linux

PM2 使用`pm2 startup`命令自动检测这些初始化系统。