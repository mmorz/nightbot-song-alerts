#!/usr/bin/env bash

set -euvo pipefail

pushd dist
python3 -m http.server 8080 &
popd
wait-for-it localhost:8080
npm run cypress:ci
