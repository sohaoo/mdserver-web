#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin:/opt/homebrew/bin
export PATH=$PATH:/opt/homebrew/bin

curPath=`pwd`
rootPath=$(dirname "$curPath")
rootPath=$(dirname "$rootPath")
serverPath=$(dirname "$rootPath")
sourcePath=${serverPath}/source
sysName=`uname`
SYS_ARCH=`arch`

version=7.0.33
PHP_VER=70
Install_php()
{
#------------------------ install start ------------------------------------#
echo "安装php-${version} ..."
mkdir -p $sourcePath/php
mkdir -p $serverPath/php

cd ${rootPath}/plugins/php/lib && /bin/bash freetype_old.sh
cd ${rootPath}/plugins/php/lib && /bin/bash zlib.sh

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
	md5_file_ok=a6d7c355d023301a1a9ec8b4f32a4856
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

OPTIONS='--without-iconv'
if [ $sysName == 'Darwin' ]; then
	OPTIONS="${OPTIONS} --with-freetype-dir=${serverPath}/lib/freetype"
	# OPTIONS="${OPTIONS} --with-external-pcre=$(brew --prefix pcre2)"
else
	OPTIONS="${OPTIONS} --with-readline"
fi

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

if [ "${SYS_ARCH}" == "arm64" ] && [ "$sysName" == "Darwin" ] ;then
	# 修复mac arm64架构下php安装
	# 修复不能识别到sys_icache_invalidate
	cat ${curPath}/versions/${PHP_VER}/src/ext/pcre/sljitConfigInternal.h > $sourcePath/php/php${PHP_VER}/ext/pcre/pcrelib/sljit/sljitConfigInternal.h
	cat ${curPath}/versions/${PHP_VER}/src/reentrancy.c > $sourcePath/php/php${PHP_VER}/main/reentrancy.c
	cat ${curPath}/versions/${PHP_VER}/src/mkstemp.c > $sourcePath/php/php${PHP_VER}/ext/zip/lib/mkstemp.c
fi

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
	cd $sourcePath/php/php${PHP_VER} && ./configure \
	--prefix=$serverPath/php/${PHP_VER} \
	--exec-prefix=$serverPath/php/${PHP_VER} \
	--with-config-file-path=$serverPath/php/${PHP_VER}/etc \
	--enable-mysqlnd \
	--with-mysql=mysqlnd \
	--with-mysqli=mysqlnd \
	--with-pdo-mysql=mysqlnd \
	--enable-mbstring \
	--enable-simplexml \
	--enable-ftp \
	--enable-sockets \
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
fi

#------------------------ install end ------------------------------------#
}



Uninstall_php()
{
	$serverPath/php/init.d/php70 stop
	rm -rf $serverPath/php/70
	echo "卸载php-7.0.30 ..."
}

action=${1}
if [ "${1}" == 'install' ];then
	Install_php
else
	Uninstall_php
fi
