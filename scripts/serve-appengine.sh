#!/bin/bash

set -e

set -a
source .env
set +a

npx knex --knexfile knexfile.js migrate:latest

node server/index.js
