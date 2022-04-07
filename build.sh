#!/bin/sh
source ./version.sh
yarn build
docker build -t web:$version .
docker save -o web.tar web:$version
#docker rmi web:$version
