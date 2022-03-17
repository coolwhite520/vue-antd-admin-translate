FROM nginx
COPY dist /usr/share/nginx/html
WORKDIR /etc/nginx/conf.d
COPY nginx_docker_conf/default.conf .
WORKDIR /usr/share/nginx/pems
COPY ./nginx_docker_conf/cert.pem .
COPY ./nginx_docker_conf/key.pem .
EXPOSE 8080
