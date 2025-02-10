#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin:/opt/homebrew/bin
export PATH

curPath=`pwd`
rootPath=$(dirname "$curPath")
rootPath=$(dirname "$rootPath")
rootPath=$(dirname "$rootPath")
serverPath=$(dirname "$rootPath")
SYS_ARCH=`arch`

VERSION=7.0.15

MG_DIR=$serverPath/source/mongodb
mkdir -p $MG_DIR

if [ ! -f $MG_DIR/mongodb-macos-x86_64-${VERSION}.tgz ]; then
	wget --no-check-certificate -O $MG_DIR/mongodb-macos-x86_64-${VERSION}.tgz https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-${VERSION}.tgz
	echo "wget --no-check-certificate -O $MG_DIR/mongodb-macos-x86_64-${VERSION}.tgz https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-${VERSION}.tgz"
fi

if [ ! -d $MG_DIR/mongodb-macos-x86_64-${VERSION} ];then 
	cd $MG_DIR && tar -zxvf mongodb-macos-x86_64-${VERSION}.tgz
fi

if [ ! -d $serverPath/mongodb/bin ];then
	mkdir -p $serverPath/mongodb
	cd $MG_DIR/mongodb-macos-x86_64-${VERSION} && cp -rf ./bin $serverPath/mongodb
fi

# https://downloads.mongodb.com/compass/mongosh-2.2.5-darwin-x64.zip
# https://downloads.mongodb.com/compass/mongosh-2.2.5-darwin-arm64.zip
#--------------- mongosh tool install ------------------ #
TOOL_VERSION=2.2.5
TOOL_FILE_NAME=mongosh-${TOOL_VERSION}-darwin-x64
if [ "aarch64" == ${SYS_ARCH} ];then
	TOOL_FILE_NAME=mongosh-${TOOL_VERSION}-darwin-arm64
fi

if [ "arm64" == ${SYS_ARCH} ];then
	TOOL_FILE_NAME=mongosh-${TOOL_VERSION}-darwin-arm64
fi
TOOL_FILE_NAME_TGZ=${TOOL_FILE_NAME}.zip
if [ ! -f $MG_DIR/${TOOL_FILE_NAME_TGZ} ]; then
	wget --no-check-certificate -O $MG_DIR/${TOOL_FILE_NAME_TGZ} https://downloads.mongodb.com/compass/${TOOL_FILE_NAME_TGZ}
	echo "wget --no-check-certificate -O $MG_DIR/${TOOL_FILE_NAME_TGZ} https://downloads.mongodb.com/compass/${TOOL_FILE_NAME_TGZ}"
fi

if [ ! -d $MG_DIR/${TOOL_FILE_NAME_TGZ} ];then 
	cd $MG_DIR && unzip ${TOOL_FILE_NAME_TGZ}
fi

cd ${MG_DIR}/${TOOL_FILE_NAME} && cp -rf ./bin $serverPath/mongodb
cd ${MG_DIR} && rm -rf ${MG_DIR}/${TOOL_FILE_NAME}



# https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.9.4.zip
TOOL_VERSION=100.9.4
TOOL_FILE_NAME=mongodb-database-tools-macos-x86_64-${TOOL_VERSION}
if [ "aarch64" == ${SYS_ARCH} ];then
	TOOL_FILE_NAME=mongodb-database-tools-macos-arm64-${TOOL_VERSION}
fi

if [ "arm64" == ${SYS_ARCH} ];then
	TOOL_FILE_NAME=mongodb-database-tools-macos-arm64-${TOOL_VERSION}
fi

TOOL_FILE_NAME_TGZ=${TOOL_FILE_NAME}.zip
if [ ! -f $MG_DIR/${TOOL_FILE_NAME_TGZ} ]; then
	wget --no-check-certificate -O $MG_DIR/${TOOL_FILE_NAME_TGZ} https://fastdl.mongodb.org/tools/db/${TOOL_FILE_NAME_TGZ}
	echo "wget --no-check-certificate -O $MG_DIR/${TOOL_FILE_NAME_TGZ} https://fastdl.mongodb.org/tools/db/${TOOL_FILE_NAME_TGZ}"
fi

if [ ! -d $MG_DIR/${TOOL_FILE_NAME_TGZ} ];then 
	cd $MG_DIR && unzip ${TOOL_FILE_NAME_TGZ}
fi

cd ${MG_DIR}/${TOOL_FILE_NAME} && cp -rf ./bin $serverPath/mongodb
cd ${MG_DIR} && rm -rf ${MG_DIR}/${TOOL_FILE_NAME}