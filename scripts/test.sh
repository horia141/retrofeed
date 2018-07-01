#!/bin/sh

npx nyc mocha \
    --nyrc-path tsnyc.json \
    --require ts-node/register \
    --require source-map-support/register \
    --recursive \
    test/**/*.ts
