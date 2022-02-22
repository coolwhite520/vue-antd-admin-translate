#!/bin/sh
yarn build
#read -p "Enter Version:" version
docker build -t web:3.3.5 .
docker save -o web.tar web:3.3.5
docker rmi web:3.3.5
