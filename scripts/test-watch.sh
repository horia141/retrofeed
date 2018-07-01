#!/bin/sh

npx mocha --require ts-node/register --watch test/**/*.{ts,tsx}
