#!/bin/bash

set -e

source scripts/setup-env.sh

GCP_CI_BUILDER_CREDENTIALS=$1
IMAGE_TAG=$2

cat ${GCP_CI_BUILDER_CREDENTIALS} | docker login --username _json_key --password-stdin https://eu.gcr.io;
docker build --tag eu.gcr.io/chm-sqrt2-retrofeed-common/core:$IMAGE_TAG .;
docker push eu.gcr.io/chm-sqrt2-retrofeed-common/core:$IMAGE_TAG;
docker build --tag eu.gcr.io/chm-sqrt2-retrofeed-common/core:latest .;
docker push eu.gcr.io/chm-sqrt2-retrofeed-common/core:latest
