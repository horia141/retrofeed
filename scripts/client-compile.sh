#!/bin/bash

set -e

source scripts/setup-env.sh

npx webpack --config=webpack.config.js
