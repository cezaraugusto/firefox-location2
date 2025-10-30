import fs from 'fs';
import path from 'path';
import os from 'os';
import which from 'which';

export type FsLike = { existsSync: (p: string) => boolean };
export type WhichLike = { sync: (cmd: string) => string };
export type Deps = {
  fs?: FsLike;
  which?: WhichLike;
  os?: { homedir: () => string };
  path?: { join: (...parts: string[]) => string };
  env?: NodeJS.ProcessEnv;
  platform?: NodeJS.Platform;
};

export default function locateFirefox(
  allowFallbackOrDeps?: boolean | Deps,
  depsMaybe?: Deps,
): string | null {
  const isBoolean = typeof allowFallbackOrDeps === 'boolean';
  const allowFallback = isBoolean ? (allowFallbackOrDeps as boolean) : false;
  const deps: Deps | undefined = isBoolean
    ? depsMaybe
    : (allowFallbackOrDeps as Deps | undefined);

  const f: FsLike = deps?.fs ?? fs;
  const w: WhichLike = deps?.which ?? which;
  const o = deps?.os ?? os;
  const p = deps?.path ?? path;
  const env = deps?.env ?? process.env;
  const platform = deps?.platform ?? process.platform;

  const osx = platform === 'darwin';
  const win = platform === 'win32';
  const other = !osx && !win;

  if (other) {
    const stable = ['firefox'];
    const fallbacks = [
      'firefox-esr',
      'firefox-developer-edition',
      'firefox-devedition',
      'firefox-nightly',
    ];
    const candidates = allowFallback ? [...stable, ...fallbacks] : stable;

    for (const cmd of candidates) {
      try {
        const resolved = w.sync(cmd);
        if (resolved) return resolved;
      } catch (_) {}
    }

    if (allowFallback) {
      const linuxPaths = [
        '/usr/bin/firefox',
        '/usr/local/bin/firefox',
        '/usr/lib/firefox/firefox',
        '/snap/bin/firefox',
        '/opt/firefox/firefox',
        '/usr/local/firefox/firefox',
        p.join(o.homedir(), 'bin', 'firefox'),
        p.join(o.homedir(), 'Downloads', 'firefox', 'firefox'),
        // Flatpak exported app shims (if user/system exports are enabled)
        p.join(
          o.homedir(),
          '.local',
          'share',
          'flatpak',
          'exports',
          'bin',
          'org.mozilla.firefox',
        ),
        '/var/lib/flatpak/exports/bin/org.mozilla.firefox',
      ];

      for (const linuxPath of linuxPaths) {
        if (f.existsSync(linuxPath)) {
          return linuxPath;
        }
      }
    }

    return null;
  } else if (osx) {
    const appsAll = [
      { app: 'Firefox.app', exec: 'firefox' },
      { app: 'Firefox ESR.app', exec: 'firefox' },
      { app: 'Firefox Developer Edition.app', exec: 'firefox' },
      { app: 'Firefox Nightly.app', exec: 'firefox' },
    ];

    const apps = allowFallback ? appsAll : [appsAll[0]];

    const systemBase = '/Applications';
    const userBase = p.join(o.homedir(), 'Applications');

    for (const { app, exec } of apps) {
      const systemPath = `${systemBase}/${app}/Contents/MacOS/${exec}`;
      if (f.existsSync(systemPath)) return systemPath;

      const userPath = `${userBase}/${app}/Contents/MacOS/${exec}`;
      if (f.existsSync(userPath)) return userPath;
    }

    return null;
  } else {
    const prefixes = [
      env.LOCALAPPDATA,
      env.PROGRAMFILES,
      env['PROGRAMFILES(X86)'],
    ].filter(Boolean);

    const suffixesAll = [
      p.join('Mozilla Firefox', 'firefox.exe'),
      p.join('Mozilla Firefox ESR', 'firefox.exe'),
      p.join('Mozilla Firefox Developer Edition', 'firefox.exe'),
      p.join('Firefox Nightly', 'firefox.exe'),
    ];

    const suffixes = allowFallback ? suffixesAll : [suffixesAll[0]];

    for (const prefix of prefixes) {
      for (const suffix of suffixes) {
        const exePath = p.join(prefix as string, suffix);
        if (f.existsSync(exePath)) return exePath;
      }
    }

    const defaultPathsAll = [
      'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
      'C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe',
      'C:\\Program Files\\Mozilla Firefox ESR\\firefox.exe',
      'C:\\Program Files (x86)\\Mozilla Firefox ESR\\firefox.exe',
      'C:\\Program Files\\Mozilla Firefox Developer Edition\\firefox.exe',
      'C:\\Program Files (x86)\\Mozilla Firefox Developer Edition\\firefox.exe',
      'C:\\Program Files\\Firefox Nightly\\firefox.exe',
      'C:\\Program Files (x86)\\Firefox Nightly\\firefox.exe',
    ];

    const defaultPaths = allowFallback
      ? defaultPathsAll
      : defaultPathsAll.slice(0, 2);

    for (const defaultPath of defaultPaths) {
      if (f.existsSync(defaultPath)) {
        return defaultPath;
      }
    }

    return null;
  }
}
