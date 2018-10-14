#!/bin/bash

set -e

source scripts/setup-env.sh

npx webpack --config=webpack.config.js
npx tsc --project tsconfig.server.json

# Copying the files necessary for a build which tsc won't

cp webpack.config.js build/
rm -r build/server/assets
cp -r src/assets build/server/assets

for templatePath in $(tree -fi src/controllers/ | grep hbs | sed 's|src/0*||')
do
    cp src/$templatePath build/server/$templatePath
done
