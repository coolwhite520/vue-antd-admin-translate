#!/bin/sh
yarn build
docker build -t nginx-web:1.0.1 .
docker save -o nginx-web.tar nginx-web
docker rmi nginx-web
