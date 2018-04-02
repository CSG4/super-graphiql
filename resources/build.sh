#!/bin/bash

set -e
set -o pipefail

if [ ! -d "node_modules/.bin" ]; then
  echo "Be sure to run \`npm install\` before building GraphiQL."
  exit 1
fi

rm -rf dist/ && mkdir -p dist/
babel src --ignore __tests__ --out-dir dist/
echo "Bundling super-graphiql.js..."
browserify -g browserify-shim -s GraphiQL dist/index.js > super-graphiql.js
echo "Bundling super-graphiql.min.js..."
browserify -g browserify-shim -t uglifyify -s GraphiQL dist/index.js 2> /dev/null | uglifyjs -c > super-graphiql.min.js 2> /dev/null
echo "Bundling super-graphiql.css..."
cssnano example/dist/app.bundle.css super-graphiql.min.css
echo "Done"
