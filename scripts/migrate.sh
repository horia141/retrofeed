#!/bin/sh

set -e

source scripts/setup-env.sh

npx knex --knexfile knexfile.js migrate:latest
