#!/bin/bash

set -e

source scripts/setup-env.sh

docker-compose rm --stop --force

docker-compose up -d
