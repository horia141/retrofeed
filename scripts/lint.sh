#!/bin/bash

set -e

source scripts/setup-env.sh

npx stylelint --config lint.style.json 'src/client/**/*.less'
npx tslint --config lint.ts.json --project tsconfig.json
