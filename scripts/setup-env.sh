#!/bin/bash

set -e

rm -f .env
if [ -z ${ENV+x} ]
then
    cat config/env.local > .env
    cat config/env.local.secrets >> .env
else
    cat config/env.$(echo ${ENV} | awk '{print tolower($0)}') > .env
    cat config/env.$(echo ${ENV} | awk '{print tolower($0)}').secrets >> .env
fi
set -a
source .env
set +a
