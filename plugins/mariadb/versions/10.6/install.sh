#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin:/opt/homebrew/bin
export PATH

# https://mariadb.org/download/?t=mariadb

curPath=`pwd`
rootPath=$(dirname "$curPath")
rootPath=$(dirname "$rootPath")
serverPath=$(dirname "$rootPath")
sysName=`uname`

mariadbDir=${serverPath}/source/mariadb

MY_VER=10.6.20

Install_app()
{
	mkdir -p ${mariadbDir}
	echo '正在安装脚本文件...'

	if [ "$sysName" != "Darwin" ];then
		mkdir -p /var/log/mariadb
		touch /var/log/mariadb/mariadb.log
	fi

	# ----- cpu start ------
	if [ -z "${cpuCore}" ]; then
    	cpuCore="1"
	fi

	if [ -f /proc/cpuinfo ];then
		cpuCore=`cat /proc/cpuinfo | grep "processor" | wc -l`
	fi

	MEM_INFO=$(free -m|grep Mem|awk '{printf("%.f",($2)/1024)}')
	if [ "${cpuCore}" != "1" ] && [ "${MEM_INFO}" != "0" ];then
	    if [ "${cpuCore}" -gt "${MEM_INFO}" ];then
	        cpuCore="${MEM_INFO}"
	    fi
	else
	    cpuCore="1"
	fi

	if [ "$cpuCore" -gt "2" ];then
		cpuCore=`echo "$cpuCore" | awk '{printf("%.f",($1)*0.8)}'`
	else
		cpuCore="1"
	fi
	# ----- cpu end ------

	# https://mirrors.aliyun.com/mariadb/mariadb-10.8.3/source/mariadb-10.8.3.tar.gz
	# if [ ! -f ${mariadbDir}/mariadb-${MY_VER}.tar.gz ];then
	# 	wget --no-check-certificate -O ${mariadbDir}/mariadb-${MY_VER}.tar.gz --tries=3 https://mirrors.aliyun.com/mariadb/mariadb-${MY_VER}/source/mariadb-${MY_VER}.tar.gz
		
	# fi

	# https://downloads.mariadb.org/interstitial/mariadb-10.6.8/source/mariadb-10.6.8.tar.gz
	if [ ! -f ${mariadbDir}/mariadb-${MY_VER}.tar.gz ];then
		wget --no-check-certificate -O ${mariadbDir}/mariadb-${MY_VER}.tar.gz --tries=3 https://archive.mariadb.org/mariadb-${MY_VER}/source/mariadb-${MY_VER}.tar.gz
	fi

	if [ ! -d ${mariadbDir}/mariadb-${MY_VER} ];then
		 cd ${mariadbDir} && tar -zxvf  ${mariadbDir}/mariadb-${MY_VER}.tar.gz
	fi
	
	OPTIONS=''
	if [ "$sysName" == "Darwin" ];then
		OPTIONS='-DPLUGIN_TOKUDB=NO'
	fi

	INSTALL_CMD=cmake
	CMAKE3=`which cmake3`
	if [ "$?" == "0" ];then
		INSTALL_CMD=cmake3
	fi

	if [ ! -d $serverPath/mariadb ];then
		cd ${mariadbDir}/mariadb-${MY_VER} && $INSTALL_CMD \
		-DCMAKE_INSTALL_PREFIX=$serverPath/mariadb \
		-DMYSQL_DATADIR=$serverPath/mariadb/data/ \
		-DMYSQL_USER=mysql \
		-DMYSQL_UNIX_ADDR=$serverPath/mariadb/mysql.sock \
		-DWITH_MYISAM_STORAGE_ENGINE=1 \
		-DWITH_INNOBASE_STORAGE_ENGINE=1 \
		-DWITH_MEMORY_STORAGE_ENGINE=1 \
		-DENABLED_LOCAL_INFILE=1 \
		-DWITH_PARTITION_STORAGE_ENGINE=1 \
		$OPTIONS \
		-DEXTRA_CHARSETS=all \
		-DDEFAULT_CHARSET=utf8mb4 \
		-DDEFAULT_COLLATION=utf8mb4_general_ci \
		-DCMAKE_C_COMPILER=/usr/bin/gcc \
		-DCMAKE_CXX_COMPILER=/usr/bin/g++
		make -j${cpuCore} && make install && make clean

		if [ -d $serverPath/mariadb ];then
			echo '10.6' > $serverPath/mariadb/version.pl
			echo '安装完成'
		else
			echo '安装失败'
			echo 'install fail'>&2
			exit 1
		fi
	fi

	if [ -d ${mariadbDir}/mariadb-${MY_VER} ];then
		rm -rf ${mariadbDir}/mariadb-${MY_VER}
	fi
}

Uninstall_app()
{
	rm -rf $serverPath/mariadb
	echo '卸载完成'
}

action=$1
if [ "${1}" == 'install' ];then
	Install_app
else
	Uninstall_app
fi
