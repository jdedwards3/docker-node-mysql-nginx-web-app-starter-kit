FROM alpine 

RUN apk update && apk add nginx curl openssl certbot-nginx

COPY generate-self-signed-ssl-certificate /root/generate-self-signed-ssl-certificate
RUN ["chmod", "+x", "/root/generate-self-signed-ssl-certificate"]
RUN ["/root/generate-self-signed-ssl-certificate"]

# see /cron/app-cron
COPY generate-ssl-certificate /root/generate-ssl-certificate
RUN ["chmod", "+x", "/root/generate-ssl-certificate"]

COPY app-cron /etc/cron.d/app-cron
RUN chmod 644 /etc/cron.d/app-cron
RUN crontab /etc/cron.d/app-cron

ENTRYPOINT ["crond", "-f"]
