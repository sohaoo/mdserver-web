#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin:/opt/homebrew/bin
export PATH=$PATH:/opt/homebrew/bin

curPath=`pwd`
rootPath=$(dirname "$curPath")
rootPath=$(dirname "$rootPath")
serverPath=$(dirname "$rootPath")
sourcePath=${serverPath}/source
sysName=`uname`

version=7.4.26
PHP_VER=74
Install_php()
{
#------------------------ install start ------------------------------------#
echo "安装php-${version} ..."
mkdir -p $sourcePath/php
mkdir -p $serverPath/php

# cd /Users/midoks/Desktop/mwdev/server/mdserver-web/plugins/php/lib && /bin/bash libzip.sh
# cd /www/server/mdserver-web/plugins/php/lib && /bin/bash libzip.sh
cd ${rootPath}/plugins/php/lib && /bin/bash freetype_new.sh
cd ${rootPath}/plugins/php/lib && /bin/bash zlib.sh
cd ${rootPath}/plugins/php/lib && /bin/bash libzip.sh

# redat ge 8
which yum
if [ "$?" == "0" ];then
	cd ${rootPath}/plugins/php/lib && /bin/bash oniguruma.sh
fi

if [ ! -d $sourcePath/php/php${PHP_VER} ];then

	# ----------------------------------------------------------------------- #
	# 中国优化安装
	cn=$(curl -fsSL -m 10 -s http://ipinfo.io/json | grep "\"country\": \"CN\"")
	LOCAL_ADDR=common
	if [ ! -z "$cn" ] || [ "$?" == "0" ] ;then
		LOCAL_ADDR=cn
	fi

	if [ "$LOCAL_ADDR" == "cn" ];then
		if [ ! -f $sourcePath/php/php-${version}.tar.xz ];then
			wget --no-check-certificate -O $sourcePath/php/php-${version}.tar.xz https://mirrors.nju.edu.cn/php/php-${version}.tar.xz
		fi
	fi
	# ----------------------------------------------------------------------- #
	
	if [ ! -f $sourcePath/php/php-${version}.tar.xz ];then
		wget --no-check-certificate -O $sourcePath/php/php-${version}.tar.xz https://museum.php.net/php7/php-${version}.tar.xz
	fi

	#检测文件是否损坏.
	md5_file_ok=0cbaae3de6c02cf8d7b82843fdfdf53d
	if [ -f $sourcePath/php/php-${version}.tar.xz ];then
		md5_file=`md5sum $sourcePath/php/php-${version}.tar.xz  | awk '{print $1}'`
		if [ "${md5_file}" != "${md5_file_ok}" ]; then
			echo "PHP${version} 下载文件不完整,重新安装"
			rm -rf $sourcePath/php/php-${version}.tar.xz
		fi
	fi
	
	cd $sourcePath/php && tar -Jxf $sourcePath/php/php-${version}.tar.xz
	mv $sourcePath/php/php-${version} $sourcePath/php/php${PHP_VER}
fi

if [ ! -d $sourcePath/php/php${PHP_VER} ];then
	rm -rf $sourcePath/php/php-${version}.tar.xz
	echo "reinstall php${version}"
	exit 1
fi

cd $sourcePath/php/php${PHP_VER}

OPTIONS='--without-iconv'
# if [ $sysName == 'Darwin' ]; then
# 	OPTIONS="${OPTIONS} --with-external-pcre=$(brew --prefix pcre2)"
# fi

IS_64BIT=`getconf LONG_BIT`
if [ "$IS_64BIT" == "64" ];then
	OPTIONS="${OPTIONS} --with-libdir=lib64"
fi

# ----- cpu start ------
if [ -z "${cpuCore}" ]; then
	cpuCore="1"
fi

if [ -f /proc/cpuinfo ];then
	cpuCore=`cat /proc/cpuinfo | grep "processor" | wc -l`
fi

MEM_INFO=$(which free > /dev/null && free -m|grep Mem|awk '{printf("%.f",($2)/1024)}')
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

if [ "$sysName" == "Darwin" ];then
	BREW_DIR=`which brew`
	BREW_DIR=${BREW_DIR/\/bin\/brew/}

	LIB_DEPEND_DIR=`brew info openssl@1.0 | grep ${BREW_DIR}/Cellar/openssl@1.0 | cut -d \  -f 1 | awk 'END {print}'`
	OPTIONS="$OPTIONS --with-openssl=$(brew --prefix openssl@1.0)"
	export PKG_CONFIG_PATH=$LIB_DEPEND_DIR/lib/pkgconfig
	export OPENSSL_CFLAGS="-I${LIB_DEPEND_DIR}/include"
	export OPENSSL_LIBS="-L/${LIB_DEPEND_DIR}/lib -lssl -lcrypto -lz"
else
	cd ${rootPath}/plugins/php/lib && /bin/bash openssl_10.sh
	export PKG_CONFIG_PATH=$PKG_CONFIG_PATH:$serverPath/lib/openssl10/lib/pkgconfig
	OPTIONS="$OPTIONS --with-openssl"
fi

if [ ! -d $serverPath/php/${PHP_VER} ];then
	cd $sourcePath/php/php${PHP_VER} && make clean
	./configure \
	--prefix=$serverPath/php/${PHP_VER} \
	--exec-prefix=$serverPath/php/${PHP_VER} \
	--with-config-file-path=$serverPath/php/${PHP_VER}/etc \
	--enable-mysqlnd \
	--with-mysql=mysqlnd \
	--with-mysqli=mysqlnd \
	--with-pdo-mysql=mysqlnd \
	--enable-ftp \
	--enable-mbstring \
	--enable-sockets \
	--enable-simplexml \
	--enable-soap \
	--enable-posix \
	--enable-sysvmsg \
	--enable-sysvsem \
	--enable-sysvshm \
	--disable-intl \
	--disable-fileinfo \
	$OPTIONS \
	--enable-fpm
	make clean && make -j${cpuCore} && make install && make clean

	# rm -rf $sourcePath/php/php${PHP_VER}

	echo "安装php-${version}成功"
fi 
#------------------------ install end ------------------------------------#
}

Uninstall_php()
{
	$serverPath/php/init.d/php${PHP_VER} stop
	rm -rf $serverPath/php/${PHP_VER}
	echo "卸载php-${version}..."
}

action=${1}
if [ "${1}" == 'install' ];then
	Install_php
else
	Uninstall_php
fi
