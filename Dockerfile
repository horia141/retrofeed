FROM node:9

MAINTAINER Horia Coman <horia141@gmail.com>

# Copy source code.

RUN mkdir /retrofeed
COPY . /retrofeed

# Setup the runtime environment for the application.

WORKDIR /retrofeed
ENTRYPOINT ["yarn", "serve"]
