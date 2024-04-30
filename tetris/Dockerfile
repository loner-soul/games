FROM nginx:stable-perl as production-stage

COPY  index.html /usr/share/nginx/html/
COPY  static  /usr/share/nginx/html/static
COPY  deploy/nginx/ /etc/nginx/conf.d/

LABEL tetris=1


RUN mkdir -p /usr/share/nginx/logs  && find /usr/share/nginx/logs -type d -exec chmod 777 {} \;

CMD ["nginx", "-g", "daemon off;"]