#!/bin/bash

set -e

export ENV=$1
source scripts/setup-env.sh

IMAGE_TAG=$2
# Overwrite version
VERSION=$(echo $IMAGE_TAG | sed 's/\./\-/g')

./scripts/compile.sh

cd compile/

gcloud --project=${GCP_PROJECT_NAME} app deploy --version ${VERSION} app.yaml

cd ..
