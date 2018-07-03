#!/bin/sh

source scripts/setup-env.sh

npx ts-node-dev --inspect=${INSPECT_PORT} -- src/index.ts
