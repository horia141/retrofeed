#!/bin/bash

set -e

source scripts/setup-env.sh

npx mocha \
    --watch \
    --watch-extensions ts \
    --require ts-node/register \
    test/**/*.ts
