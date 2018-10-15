#!/bin/bash

set -e

# TODO: also see about the PRELIVE one
export ENV=LIVE # Forces the LIVE environment

node server/index.js
