#!/bin/sh
yarn build
docker build -t nginx-web .
