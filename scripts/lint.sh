#!/bin/bash

set -e

source scripts/setup-env.sh

npx tslint --project tsconfig.json
