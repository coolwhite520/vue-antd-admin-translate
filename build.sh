#!/bin/sh
yarn build
docker build -t nginx-web .
docker save -o nginx-web.tar nginx-web
docker rmi nginx-web
