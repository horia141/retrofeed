#!/bin/sh

set -e

source scripts/setup-env.sh

npx ts-node src/index.ts
