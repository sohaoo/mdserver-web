#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

curPath=`pwd`
rootPath=$(dirname "$curPath")
rootPath=$(dirname "$rootPath")
serverPath=$(dirname "$rootPath")

VERSION=$2

# pip3 install ccxt
if [ -f ${rootPath}/bin/activate ];then
	source ${rootPath}/bin/activate	
fi

pip3 install telethon

Install_App()
{
	echo '正在安装脚本文件...'
	mkdir -p $serverPath/source
	mkdir -p $serverPath/tgclient
	echo "${VERSION}" > $serverPath/tgclient/version.pl

	cp -rf ${rootPath}/plugins/tgclient/startup/* $serverPath/tgclient

	cd ${rootPath} && python3 ${rootPath}/plugins/tgclient/index.py start
	cd ${rootPath} && python3 ${rootPath}/plugins/tgclient/index.py initd_install
	echo '安装完成'
}

Uninstall_App()
{
	if [ -f /usr/lib/systemd/system/tgclient.service ];then
		systemctl stop tgclient
		systemctl disable tgclient
		rm -rf /usr/lib/systemd/system/tgclient.service
		systemctl daemon-reload
	fi

	if [ -f $serverPath/tgclient/initd/tgclient ];then
		$serverPath/tgclient/initd/tgclient stop
	fi

	rm -rf $serverPath/tgclient
	echo "Uninstall_redis"
}

action=$1
if [ "${1}" == 'install' ];then
	Install_App
else
	Uninstall_App
fi
