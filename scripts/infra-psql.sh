#!/bin/bash

set -e

source scripts/setup-env.sh

export PGPASSWORD=${POSTGRES_PASSWORD}

psql --host=${POSTGRES_HOST} --port=${POSTGRES_PORT} --dbname=${POSTGRES_PASSWORD} --username=${POSTGRES_USERNAME}
