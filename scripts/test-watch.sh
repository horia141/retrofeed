#!/bin/sh

mocha --require ts-node/register --watch test/**/*.{ts,tsx}
