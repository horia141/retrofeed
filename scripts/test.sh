#!/bin/sh

npx nyc \
    --nycrc-path tsnyc.json \
    --require ts-node/register \
    --require source-map-support/register \
    mocha test/**/*.ts
