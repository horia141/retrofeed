#!/bin/bash

set -e

export ENV=$1
source scripts/setup-env.sh

GCP_CI_BUILDER_CREDENTIALS=$2

IMAGE_TAG=$3
# Overwrite version
VERSION=$(echo $IMAGE_TAG | sed 's/\./\-/g')

./scripts/compile.sh

cd compile/

gcloud --project=${GCP_PROJECT_NAME} auth activate-service-account ci-builder@chm-sqrt2-retrofeed-common.iam.gserviceaccount.com --key-file=../${GCP_CI_BUILDER_CREDENTIALS}
gcloud --project=${GCP_PROJECT_NAME} app deploy --version=${VERSION} app.yaml

cd ..
