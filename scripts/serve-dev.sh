#!/bin/sh

tsc-watch --onSuccess "ts-node --inspect=0.0.0.0:9229 src/index.ts"
