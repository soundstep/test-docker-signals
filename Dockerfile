# Acceptance test image to serve Cassandra in docker
FROM node:12.15.0-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash g++ make libpng-dev python

RUN python --version
RUN node --version
RUN npm --version

# Copy package.json and cache node dependencies
RUN mkdir -p /opt/app
SHELL ["/bin/bash", "-c"]

RUN npm install -g pnpm
RUN pnpm install

COPY . /opt/app

WORKDIR /opt/app

RUN ls -la

EXPOSE 5000

CMD [ "node", "index.js" ]
