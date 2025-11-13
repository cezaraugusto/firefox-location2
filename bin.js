#!/usr/bin/env node

import locateFirefox, {
  locateFirefoxOrExplain,
  getInstallGuidance,
  getFirefoxVersion,
} from './dist/index.js';

const argv = process.argv.slice(2);
const allowFallback = argv.includes('--fallback') || argv.includes('-f');
const printBrowserVersion =
  argv.includes('--firefox-version') || argv.includes('--browser-version');
const allowExec = argv.includes('--allow-exec');

try {
  const location =
    (typeof locateFirefoxOrExplain === 'function' &&
      locateFirefoxOrExplain({ allowFallback })) ||
    (typeof locateFirefox === 'function' && locateFirefox(allowFallback)) ||
    null;

  if (!location)
    throw new Error(
      (typeof getInstallGuidance === 'function' && getInstallGuidance()) ||
        'No suitable Firefox binary found.',
    );

  if (printBrowserVersion && typeof getFirefoxVersion === 'function') {
    const v = getFirefoxVersion(location, { allowExec });
    if (!v) {
      console.log('');
      process.exit(2);
    }
    console.log(String(v));
    process.exit(0);
  }

  console.log(String(location));
} catch (e) {
  console.error(String(e));
  process.exit(1);
}
