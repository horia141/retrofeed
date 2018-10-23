#!/bin/bash

set -e

source scripts/setup-env.sh

npx webpack --config=webpack.config.js
npx tsc --project tsconfig.server.json

# Copying the files necessary for a build

rm -rf compile
mkdir -p compile

cp -r .build/client compile/client
cp -r .build/server compile/server
cp -r src/assets compile/assets
cp -r migrations compile/migrations
cp .env compile/.env
cp app.yaml compile/app.yaml
cp scripts/serve-appengine.sh compile/serve-appengine.sh
cp package.json compile/package.json
cp yarn.lock compile/yarn.lock
cp .gcloudignore compile/.gcloudignore
cp knexfile.js compile/knexfile.js

for templatePath in $(tree -fi src/controllers/ | grep hbs | sed 's|src/0*||')
do
    cp src/$templatePath compile/server/$templatePath
done
