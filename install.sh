#!/bin/sh
set -o pipefail
set -o errexit
echo "安装中"
curl -s https://codeload.github.com/nasetech/standard-setup/zip/master --output /tmp/standard-setup.zip
unzip -a /tmp/standard-setup.zip  -d .
mv standard-setup-master ${1:-standard-setup}
echo "安装完毕"