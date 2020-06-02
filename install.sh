#!/bin/sh
echo "安装中"
curl -s https://codeload.github.com/nasetech/standard-setup/zip/master --output /tmp/standard-setup.zip
tar -zxvf /tmp/standard-setup.zip  -C .
mv -f standard-setup-master standard-setup
echo "安装完毕"