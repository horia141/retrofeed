#!/bin/sh

npx mocha --require ts-node/register test/**/*.{ts,tsx}
