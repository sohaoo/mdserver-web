### 常用命令说明


- 面板相关命令

```
mw default	| 显示登录信息
mw db 		| 快捷连接MySQL
mw redis 	| 快捷连接Redis
mw valkey 	| 快捷连接valkey
mw mongodb 	| 快捷连接MongoDB
mw pgdb 	| 快捷连接PostgreSQL
----------------------------------------
mw open				| 开启面板
mw close			| 关闭面板

mw debug			| 开发测试
mw venv				| 进入虚拟环境
mw mirror			| 切换镜像
mw install_app			| 快捷安装常用软件
mw update 			| 更新到正式
mw dev/update_dev		| 更新到开发

service mw [start|stop|reload|restart|status]
```

- OpenResty

```

systemctl [start|stop|reload|restart|status] openresty 

```

- MySQL

```

systemctl [start|stop|reload|restart|status] mysql 

```

- MariaDB

```

systemctl [start|stop|reload|restart|status] mariadb 

```

- PHP

```

systemctl [start|stop|reload|restart|status] php[54-81] 

systemctl start php71
```

- Redis

```

systemctl [start|stop|reload|restart|status] redis

```

- Memcached

```

systemctl [start|stop|reload|restart|status] memcached

```


- sphinx

```

systemctl [start|stop|reload|restart|status] sphinx

```
