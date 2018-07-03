#!/bin/sh

source scripts/setup-env.sh

npx nyc report \
    --nycrc-path tsnyc.json \
    --reporter text-lcov \
    --require ts-node/register \
    --require source-map-support/register \
    test/**/*.ts | npx coveralls
