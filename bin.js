#!/usr/bin/env node

import locateFirefox, {
  locateFirefoxOrExplain,
  getInstallGuidance,
} from './dist/index.js';

const argv = process.argv.slice(2);
const allowFallback = argv.includes('--fallback') || argv.includes('-f');

try {
  const result =
    typeof locateFirefoxOrExplain === 'function'
      ? locateFirefoxOrExplain({ allowFallback })
      : locateFirefox(allowFallback);

  if (!result)
    throw new Error(
      (typeof getInstallGuidance === 'function' && getInstallGuidance()) ||
        'No suitable Firefox binary found.',
    );
  console.log(String(result));
} catch (e) {
  console.error(String(e));
  process.exit(1);
}
