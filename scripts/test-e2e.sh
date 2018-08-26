#!/bin/bash

set -e

source scripts/setup-env.sh

npx tsc --project tsconfig.test.e2e.json

export CYPRESS_BASE_URL=http://${HOST}:${PORT}

if [ ${ENV} = "TEST" ]
then
    export RECORD="--record --key ${CYPRESS_RECORD_KEY}"
else
    export RECORD=""
fi

npx cypress run --env $(cat .env | grep -v '#' | xargs | tr ' ' ,) ${RECORD}
