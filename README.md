# Docker/Node.js/MySQL/Nginx Web Application Starter Kit

Containerized Node.js web application starter kit with user accounts and authentication.

- Nginx reverse proxy for Node.js
- MySQL database for storage
- includes self signed ssl certificates for local computer development and inter-container TLS resolution

## Setup

[install Docker](https://docs.docker.com/get-docker/)

then add your user to the docker group (so you dont have to run docker as root)

```
sudo apt install docker.io; sudo groupadd docker; sudo usermod -aG docker $USER; newgrp docker;
```

create the env file with default values set

```
mv ./.env-sample ./.env
```

### Start App

```
chmod +x ./start
```

```
./start
```

Then in a browser go to https://app.localhost, and you should see the login page. From there you need to register to create a user account.

### Stop App

```
chmod +x ./stop
```

```
./stop
```

## Deploy to production

- set NODE_ENV=production in /.env and update other variables as needed
- remove DEBUG_PORT from /.env
- remove "ports:" setting from app/docker-compose.yml
- replace the contents of cron/generate-ssl-certificate with the command you need for production ssl certificates
- update the cron tab in cron/app-cron to run the generate-ssl-certificates script every 12 hours
- update nginx/conf.d/app.conf with a new server block for production
