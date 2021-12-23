#!/bin/sh
yarn build
docker build -t web:3.2.8 .
docker save -o web.tar web:3.2.8
docker rmi web:3.2.8
