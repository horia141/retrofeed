#!/bin/sh

npx mocha --watch --watch-extensions ts --require ts-node/register test/**/*.ts
