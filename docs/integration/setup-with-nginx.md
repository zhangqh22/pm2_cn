---
title: 使用NGINX进行生产设置
sidebar_position: 3
---

## Nginx 作为 HTTP 代理

这是使用NGINX作为PM2的HTTP代理前端的常用方法。NGINX 将允许快速提供静态文件、管理 SSL 协议并将通信重定向到您的 Node.js 应用程序。

下面是一个 Node.js 应用程序监听端口 3001 的示例，NGINX 将流量从端口 443 (HTTPS) 转发到 3001。该示例还将处理 Websocket 连接。

nginx.conf：

```nginx
upstream my_nodejs_upstream {
    server 127.0.0.1:3001;
    keepalive 64;
}

server {
    listen 443 ssl;
    
    server_name www.my-website.com;
    ssl_certificate_key /etc/ssl/main.key;
    ssl_certificate     /etc/ssl/main.crt;
   
    location / {
    	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    	proxy_set_header Host $http_host;
        
    	proxy_http_version 1.1;
    	proxy_set_header Upgrade $http_upgrade;
    	proxy_set_header Connection "upgrade";
        
    	proxy_pass http://my_nodejs_upstream/;
    	proxy_redirect off;
    	proxy_read_timeout 240s;
    }
}
```

在[Nginx 文档](http://nginx.org/en/docs/http/websocket.html)中了解有关这些选项的更多信息！一旦你有了这个，你只需要一个在`3001`端口上运行 PM2 启动的 Node.js 项目，你就会有一个生产就绪的 HTTP 服务！
