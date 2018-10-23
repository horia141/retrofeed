#!/bin/bash

set -e

export ENV=$1
source scripts/setup-env.sh

set -a
export PGPASSWORD=${POSTGRES_PASSWORD}

gcloud beta sql connect ${POSTGRES_GCP_NAME} --project=${GCP_PROJECT_NAME} --database=${POSTGRES_DATABASE} --user=${POSTGRES_USERNAME} --quiet
set +a
