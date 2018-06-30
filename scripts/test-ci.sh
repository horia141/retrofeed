#!/bin/sh

istanbul cover --config ./.istanbul.yml ./node_modules/mocha/bin/_mocha --require ts-node/register -- test/**/*.{ts,tsx}
remap-istanbul -i ./build/coverage/coverage-final.json -o ./build/coverage/coverage-remapped.json
coverage-filter -i ./build/coverage/coverage-remapped.json -o ./build/coverage/coverage-filtered.json
