FROM node:9

MAINTAINER Horia Coman <horia141@gmail.com>

# Setup users and groups.

RUN groupadd retrofeed && \
    useradd -ms /bin/bash -g retrofeed retrofeed

# Copy source code.

RUN mkdir /retrofeed
COPY . /retrofeed
RUN chown -R retrofeed:retrofeed /retrofeed

# Setup the runtime environment for the application.

WORKDIR /retrofeed
EXPOSE 10001
USER retrofeed
ENTRYPOINT ["yarn", "serve:watch"]
