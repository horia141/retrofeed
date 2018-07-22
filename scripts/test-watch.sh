#!/bin/bash

set -e

source scripts/setup-env.sh

# ts-node config
export TS_NODE_PROJECT=tsconfig.json
export TS_NODE_FILES=true

npx mocha \
    --watch \
    --watch-extensions ts \
    --require ts-node/register \
    test/**/*.ts
