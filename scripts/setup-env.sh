#!/bin/bash

set -e

rm -f .env
if [ -z ${ENV+x} ]
then
    ln -s config/env.local .env
else
    ln -s config/env.$(echo ${ENV} | awk '{print tolower($0)}') .env
fi
set -a
source .env
set +a
