#!/bin/sh

source scripts/setup-env.sh

npx nyc \
    --nycrc-path tsnyc.json \
    --require ts-node/register \
    --require source-map-support/register \
    mocha test/**/*.ts
