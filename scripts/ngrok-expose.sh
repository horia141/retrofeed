#!/bin/bash

source scripts/setup-env.sh

npx ngrok http $PORT
