#!/bin/sh
# Serve the chest.so site locally on port 8080
# Requires Python 3
set -e
cd "$(dirname "$0")"
echo "Serving chest.so at http://localhost:8080"
python3 -m http.server 8080
