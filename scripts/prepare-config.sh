#!/bin/bash

set -e

rm -f secrets.tar secrets.tar.enc
tar -cvf secrets.tar config/*
travis encrypt-file --force secrets.tar
rm secrets.tar
