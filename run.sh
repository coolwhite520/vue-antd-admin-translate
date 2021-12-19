#!/bin/sh
docker run  -p 80:80 --add-host=host.docker.internal:host-gateway -d nginx-web
