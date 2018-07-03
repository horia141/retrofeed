#!/bin/sh

rm -f config/env.current
rm -f .env
if [ -z ${ENV+x} ]
then
    cd config
    ln -s env.local env.current
    cd ..
    ln -s config/env.local .env
else
    cd config
    ln -s env.$(echo ${ENV} | awk '{print tolower($0)}') env.current
    cd ..
    ln -s config/env.$(echo ${ENV} | awk '{print tolower($0)}') .env
fi
set -a
source config/env.current
set +a
