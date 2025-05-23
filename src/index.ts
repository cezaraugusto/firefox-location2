import fs from 'fs';
import path from 'path';
import os from 'os';
import which from 'which';

const osx = process.platform === 'darwin';
const win = process.platform === 'win32';
const other = !osx && !win;

export default function locateFirefox(): string | null {
  if (other) {
    try {
      return which.sync('firefox');
    } catch (_) {
      // Try alternative names on Linux
      try {
        return which.sync('firefox-esr');
      } catch (_) {
        try {
          return which.sync('firefox-nightly');
        } catch (_) {
          // Check common Linux installation paths
          const linuxPaths = [
            '/usr/bin/firefox',
            '/usr/local/bin/firefox',
            '/snap/bin/firefox',
            '/opt/firefox/firefox',
          ];

          for (const linuxPath of linuxPaths) {
            if (fs.existsSync(linuxPath)) {
              return linuxPath;
            }
          }

          return null;
        }
      }
    }
  } else if (osx) {
    const regPath = '/Applications/Firefox.app/Contents/MacOS/firefox';
    const altPath = path.join(os.homedir(), regPath.slice(1));

    return fs.existsSync(regPath)
      ? regPath
      : fs.existsSync(altPath)
        ? altPath
        : null;
  } else {
    const suffix = path.join('Mozilla Firefox', 'firefox.exe');
    const possiblePaths = [
      process.env.LOCALAPPDATA,
      process.env.PROGRAMFILES,
      process.env['PROGRAMFILES(X86)'],
    ];

    for (const prefix of possiblePaths) {
      if (prefix) {
        const exePath = path.join(prefix, suffix);
        if (fs.existsSync(exePath)) {
          return exePath;
        }
      }
    }

    // Check default installation paths
    const defaultPaths = [
      'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
      'C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe',
    ];

    for (const defaultPath of defaultPaths) {
      if (fs.existsSync(defaultPath)) {
        return defaultPath;
      }
    }

    return null;
  }
}
