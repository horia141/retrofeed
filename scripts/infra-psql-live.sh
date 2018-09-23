#!/bin/bash

set -e

export ENV=LIVE # Forces the LIVE environment
source scripts/setup-env.sh

export PGPASSWORD=${POSTGRES_PASSWORD}

gcloud beta sql connect ${POSTGRES_GCP_NAME} --project=chm-sqrt2-retrofeed-live --database=${POSTGRES_DATABASE} --user=${POSTGRES_USERNAME} --quiet
