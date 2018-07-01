#!/bin/sh

npx nyc report \
    --reporter text-lcov \
    --nyrc-path tsnyc.json \
    --require ts-node/register \
    --require source-map-support/register \
    --recursive \
    test/**/*.ts | npx coveralls
