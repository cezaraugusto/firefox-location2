#!/usr/bin/env node

const locateFirefox =
  require('./dist/index.cjs').default || require('./dist/index.cjs');

console.log(locateFirefox());
