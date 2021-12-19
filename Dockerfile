FROM nginx
COPY dist /usr/share/nginx/html
WORKDIR /etc/nginx/conf.d
COPY ./nginx_docker_conf/default.conf .
