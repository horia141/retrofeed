#!/bin/bash

set -e

source scripts/setup-env.sh

rm -rf .build

npx tsc --project tsconfig.e2e.json --outDir .build  --watch &

export CYPRESS_BASE_URL=http://localhost:${PORT}

npx cypress open --env $(cat .env | grep -v '#' | xargs | tr ' ' ,)

rm -rf .build
