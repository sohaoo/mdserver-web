#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin:/opt/homebrew/bin
export PATH=$PATH:/opt/homebrew/bin

curPath=`pwd`
rootPath=$(dirname "$curPath")
rootPath=$(dirname "$rootPath")
rootPath=$(dirname "$rootPath")
rootPath=$(dirname "$rootPath")
serverPath=$(dirname "$rootPath")
sourcePath=${serverPath}/source/php
SYS_ARCH=`arch`
actionType=$1
version=$2

LIBNAME=mcrypt
LIBV=1.0.7

if [ "$version" -lt "72" ];then
	echo "not need"
	exit 1
fi 

if [ "$version" == "84" ];then
	LIBV=1.0.7
	echo "not need"
	exit 1
fi 


LIB_PATH_NAME=lib/php
if [ -d $serverPath/php/${version}/lib64 ];then
	LIB_PATH_NAME=lib64
fi

NON_ZTS_FILENAME=`ls $serverPath/php/${version}/${LIB_PATH_NAME}/extensions | grep no-debug-non-zts`
extFile=$serverPath/php/${version}/${LIB_PATH_NAME}/extensions/${NON_ZTS_FILENAME}/${LIBNAME}.so

sysName=`uname`
if [ "$sysName" == "Darwin" ];then
	BAK='_bak'
else
	BAK=''
fi

Install_lib()
{
	
	isInstall=`cat $serverPath/php/$version/etc/php.ini|grep "${LIBNAME}.so"`
	if [ "${isInstall}" != "" ];then
		echo "php-$version 已安装${LIBNAME},请选择其它版本!"
		return
	fi

	cd ${rootPath}/plugins/php/lib && bash libmcrypt.sh
	
	if [ ! -f "$extFile" ];then

		php_lib=$sourcePath/php_lib
		mkdir -p $php_lib
		if [ ! -d $php_lib/${LIBNAME}-${LIBV} ];then
			if [ ! -f $php_lib/${LIBNAME}-${LIBV}.tgz ];then
				wget --no-check-certificate -O $php_lib/${LIBNAME}-${LIBV}.tgz http://pecl.php.net/get/${LIBNAME}-${LIBV}.tgz
			fi
			cd $php_lib && tar xvf ${LIBNAME}-${LIBV}.tgz
		fi
		cd $php_lib/${LIBNAME}-${LIBV}

		OPTIONS=""
		if [ "${SYS_ARCH}" == "aarch64" ] && [ "$version" -lt "56" ];then
			OPTIONS="$OPTIONS --build=aarch64-unknown-linux-gnu --host=aarch64-unknown-linux-gnu"
		fi

		if [ "$sysName" == "Darwin" ];then

			BREW_DIR=`which brew`
			BREW_DIR=${BREW_DIR/\/bin\/brew/}
			LIB_DEPEND_DIR=`brew info mcrypt | grep ${BREW_DIR}/Cellar/mcrypt | cut -d \  -f 1 | awk 'END {print}'`
			OPTIONS="$OPTIONS --with-mcrypt=$(brew --prefix mcrypt)"
			export PKG_CONFIG_PATH=$PKG_CONFIG_PATH:$LIB_DEPEND_DIR/lib/pkgconfig
		fi

		$serverPath/php/$version/bin/phpize
		./configure --with-php-config=$serverPath/php/$version/bin/php-config $OPTIONS
		make clean && make && make install && make clean
		
		# cd $php_lib && rm -rf $php_lib/${LIBNAME}-${LIBV}
	fi
	
	if [ ! -f "$extFile" ];then
		echo "ERROR!"
		return;
	fi
	
	echo  "" >> $serverPath/php/$version/etc/php.ini
	echo  "[${LIBNAME}]" >> $serverPath/php/$version/etc/php.ini
	echo  "extension=${LIBNAME}.so" >> $serverPath/php/$version/etc/php.ini
	
	cd  ${curPath} && bash ${rootPath}/plugins/php/versions/lib.sh $version restart
	echo '==========================================================='
	echo 'successful!'
}


Uninstall_lib()
{
	if [ ! -f "$serverPath/php/$version/bin/php-config" ];then
		echo "php-$version 未安装,请选择其它版本!"
		return
	fi

	if [ ! -f "$extFile" ];then
		echo "php-$version 未安装${LIBNAME},请选择其它版本!"
		return
	fi
	
	echo $serverPath/php/$version/etc/php.ini
	sed -i $BAK "/${LIBNAME}.so/d" $serverPath/php/$version/etc/php.ini
	sed -i $BAK "/${LIBNAME}.use_namespace/d" $serverPath/php/$version/etc/php.ini
	sed -i $BAK "/\[${LIBNAME}\]/d"  $serverPath/php/$version/etc/php.ini
		
	rm -f $extFile
	cd  ${curPath} && bash ${rootPath}/plugins/php/versions/lib.sh $version restart
	echo '==============================================='
	echo 'successful!'
}


if [ "$actionType" == 'install' ];then
	Install_lib
elif [ "$actionType" == 'uninstall' ];then
	Uninstall_lib
fi