#!/bin/sh

pwd

source scripts/setup-env.sh

npx tslint --project tsconfig.json
