#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

curPath=`pwd`
rootPath=$(dirname "$curPath")
rootPath=$(dirname "$rootPath")
serverPath=$(dirname "$rootPath")
sourcePath=${serverPath}/source
sysName=`uname`


#获取信息和版本
# bash /www/server/mdsever-web/scripts/getos.sh
bash ${rootPath}/scripts/getos.sh
OSNAME=`cat ${rootPath}/data/osname.pl`
VERSION_ID=`cat /etc/*-release | grep VERSION_ID | awk -F = '{print $2}' | awk -F "\"" '{print $2}'`

version=7.2
PHP_VER=72


# apt -y install php7.2 php7.2-fpm php7.2-dev
Install_php()
{
#------------------------ install start ------------------------------------#
apt -y install php${version} php${version}-fpm php${version}-dev
if [ "$?" == "0" ];then
	mkdir -p $serverPath/php-apt/${PHP_VER}
fi

#------------------------ install end ------------------------------------#
}

# systemctl status php7.2-fpm
# apt -y remove php7.2 php7.2-fpm php7.2-dev
Uninstall_php()
{
#------------------------ uninstall start ------------------------------------#
apt -y remove php${version} php${version}-*
rm -rf $serverPath/php-apt/${PHP_VER}
echo "卸载php-${version}..."
#------------------------ uninstall start ------------------------------------#
}

action=${1}
if [ "${1}" == 'install' ];then
	Install_php
else
	Uninstall_php
fi
