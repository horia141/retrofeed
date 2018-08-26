#!/bin/bash

set -e

source scripts/setup-env.sh

npx tsc --project tsconfig.test.e2e.json  --watch &

export CYPRESS_BASE_URL=http://localhost:${PORT}

npx cypress open --env $(cat .env | grep -v '#' | xargs | tr ' ' ,)
