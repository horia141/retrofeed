#!/bin/sh

npx nyc --reporter=text mocha --require ts-node/register --require source-map-support/register --recursive test/**/*.{ts,tsx}
