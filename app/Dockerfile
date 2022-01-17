ARG NODE_ENV
ARG PORT
ARG DEBUG_PORT

FROM node AS base
WORKDIR /usr/app
COPY wait-for-it ./
RUN ["chmod", "+x", "./wait-for-it"]
COPY package.json ./
RUN npm install

FROM base AS base-development
EXPOSE $PORT
EXPOSE $DEBUG_PORT

FROM base AS base-production
EXPOSE $PORT

FROM base-${NODE_ENV} AS final
