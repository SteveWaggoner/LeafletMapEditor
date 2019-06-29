#!/bin/bash -x

set -o nounset
set -o pipefail

(cd rest_server; npm run dev) &

sleep 15

(cd browser_app; ng serve) &

