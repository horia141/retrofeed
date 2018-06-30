#!/bin/sh

mocha --require ts-node/register test/**/*.{ts,tsx}
