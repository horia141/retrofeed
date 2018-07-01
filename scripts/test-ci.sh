#!/bin/sh

yarn build
npx istanbul cover --config ./.istanbul.yml ./node_modules/mocha/bin/_mocha --  --require ts-node/register --require source-map-support/register --recursive test
# npx remap-istanbul -i ./build/coverage/coverage-final.json -o ./build/coverage/coverage-remapped.json
npx coverage-filter -i ./build/coverage/coverage-final.json -o ./build/coverage/coverage-filtered.json
