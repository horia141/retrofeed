#!/bin/sh

source scripts/setup-env.sh

npx knex --knexfile knexfile.js migrate:latest
