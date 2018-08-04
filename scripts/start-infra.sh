#!/bin/bash

set -e

source scripts/setup-env.sh

docker-compose up postgres
