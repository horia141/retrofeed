#!/bin/bash

set -e

export ENV=LIVE # Forces the LIVE environment
source scripts/setup-env.sh

IMAGE_TAG=$1
# Overwrite version
VERSION=$(echo $IMAGE_TAG | sed 's/\./\-/g')

./scripts/compile-server.sh
./scripts/compile-client.sh

gcloud --project=${GCP_PROJECT_NAME} app deploy --version ${VERSION} app.yaml
