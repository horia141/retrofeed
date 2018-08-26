#!/bin/bash

set -e

source scripts/setup-env.sh

# ts-node config
export TS_NODE_PROJECT=tsconfig.test.unit.json
export TS_NODE_FILES=true

npx nyc \
    --nycrc-path tsnyc.json \
    --require ts-node/register \
    --require source-map-support/register \
    mocha 'test/unit/**/*.ts'
