ARG NODE_ENV
ARG DEBUG_PORT

FROM node AS base
WORKDIR /usr/app
COPY wait-for-it ./
RUN ["chmod", "+x", "./wait-for-it"]
COPY package.json ./
RUN npm install

FROM base AS base-development
EXPOSE 3000
EXPOSE $DEBUG_PORT

FROM base AS base-production
EXPOSE 3000

FROM base-${NODE_ENV} AS final
