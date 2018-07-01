#!/bin/sh

npx istanbul cover --config ./.istanbul.yml ./node_modules/mocha/bin/_mocha -- --require ts-node/register test/**/*.{ts,tsx}
npx remap-istanbul -i ./build/coverage/coverage-final.json -o ./build/coverage/coverage-remapped.json
npx coverage-filter -i ./build/coverage/coverage-remapped.json -o ./build/coverage/coverage-filtered.json
