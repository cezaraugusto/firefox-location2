import fs from 'fs';
import path from 'path';
import os from 'os';
import which from 'which';
import { execFileSync } from 'child_process';
import { resolveFromPuppeteerCache } from './resolve-puppeteer-cache';

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

  // Environment override
  const override = env.FIREFOX_BINARY;
  if (override && f.existsSync(override)) return override;

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
      } catch (_) {
        // Ignore errors
      }
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

    // Try Puppeteer cache (only when not under injected deps/tests)
    if (!deps) {
      const viaCache = resolveFromPuppeteerCache();
      if (viaCache) return viaCache;
    }
    // As a last resort, probe Puppeteer's browsers cache via CLI
    // (only when fallback is allowed and not under injected deps/tests)
    // Align behavior with chrome-location2: skip CLI probe on macOS during
    // tests to avoid timeouts
    const isTestEnv =
      process.env.NODE_ENV === 'test' ||
      typeof (process as any).env?.VITEST !== 'undefined' ||
      typeof (process as any).env?.JEST_WORKER_ID !== 'undefined';
    const skipCliProbe = isTestEnv && process.platform === 'darwin';

    if (allowFallback && !deps && !skipCliProbe) {
      const viaCLI = resolveFromPuppeteerBrowsersCLI();

      if (viaCLI) return viaCLI;
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

    // Try Puppeteer cache (only when not under injected deps/tests)
    if (!deps) {
      const viaCache = resolveFromPuppeteerCache();
      if (viaCache) return viaCache;
    }

    // As a last resort, probe Puppeteer's browsers cache via CLI
    // (only when fallback is allowed and not under injected deps/tests)
    const isTestEnv =
      process.env.NODE_ENV === 'test' ||
      typeof (process as any).env?.VITEST !== 'undefined' ||
      typeof (process as any).env?.JEST_WORKER_ID !== 'undefined';

    const skipCliProbe = isTestEnv && process.platform === 'darwin';

    if (allowFallback && !deps && !skipCliProbe) {
      const viaCLI = resolveFromPuppeteerBrowsersCLI();
      if (viaCLI) return viaCLI;
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

    // Try Puppeteer cache (only when not under injected deps/tests)
    if (!deps) {
      const viaCache = resolveFromPuppeteerCache();
      if (viaCache) return viaCache;
    }

    // As a last resort, probe Puppeteer's browsers cache via CLI
    // (only when fallback is allowed and not under injected deps/tests)
    const isTestEnv =
      process.env.NODE_ENV === 'test' ||
      typeof (process as any).env?.VITEST !== 'undefined' ||
      typeof (process as any).env?.JEST_WORKER_ID !== 'undefined';

    const skipCliProbe = isTestEnv && process.platform === 'darwin';

    if (allowFallback && !deps && !skipCliProbe) {
      const viaCLI = resolveFromPuppeteerBrowsersCLI();

      if (viaCLI) return viaCLI;
    }
    return null;
  }
}

export function getInstallGuidance(): string {
  return [
    "We couldn't find a Firefox browser on this machine.",
    '',
    "Here's the fastest way to get set up:",
    '',
    '1) Install Firefox via Puppeteer Browsers (recommended for CI/dev)',
    '   npx @puppeteer/browsers install firefox@stable',
    '',
    'Then re-run your command — we will detect it automatically.',
    '',
    'Alternatively, install Firefox using your OS package manager and re-run.',
  ].join('\n');
}

export function locateFirefoxOrExplain(
  options?: boolean | { allowFallback?: boolean },
): string {
  const allowFallback =
    typeof options === 'boolean' ? options : Boolean(options?.allowFallback);
  const found = locateFirefox(allowFallback) || locateFirefox(true);

  if (typeof found === 'string' && found) return found;

  throw new Error(getInstallGuidance());
}

/**
 * Cross-platform Firefox version resolver.
 * - Never executes the browser by default.
 * - On Windows: reads PE metadata via PowerShell.
 * - On macOS: reads Info.plist next to the binary.
 * - On Linux/others: returns null unless opts.allowExec is true, then tries --version.
 */
export function getFirefoxVersion(
  bin: string,
  opts?: { allowExec?: boolean },
): string | null {
  if (process.platform === 'win32') {
    try {
      const psPath = bin.replace(/'/g, "''");
      const pv = execFileSync(
        'powershell.exe',
        [
          '-NoProfile',
          '-Command',
          `(Get-Item -LiteralPath '${psPath}').VersionInfo.ProductVersion`,
        ],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      ).trim();
      return normalizeVersion(pv);
    } catch {}
    if (opts?.allowExec) {
      const v = tryExec(bin, ['--version']);
      return normalizeVersion(v);
    }
    return null;
  }

  if (process.platform === 'darwin') {
    try {
      const contentsDir = path.dirname(path.dirname(bin));
      const infoPlist = path.join(contentsDir, 'Info.plist');
      if (fs.existsSync(infoPlist)) {
        const xml = fs.readFileSync(infoPlist, 'utf8');
        const v =
          parsePlistString(xml, 'CFBundleShortVersionString') ||
          parsePlistString(xml, 'CFBundleVersion') ||
          '';
        return normalizeVersion(v);
      }
    } catch {}
    if (opts?.allowExec) {
      const v = tryExec(bin, ['--version']);
      return normalizeVersion(v);
    }
    return null;
  }

  if (opts?.allowExec) {
    const v = tryExec(bin, ['--version']);
    return normalizeVersion(v);
  }

  return null;
}

function normalizeVersion(s: string | null | undefined): string | null {
  if (!s) return null;

  const m = String(s).match(/(\d+(?:\.\d+){1,3})/);

  return m ? m[1] : null;
}

function parsePlistString(xml: string, key: string): string | null {
  const re = new RegExp(`<key>${key}<\\/key>\\s*<string>([^<]+)<\\/string>`);

  const m = xml.match(re);

  return m ? m[1].trim() : null;
}

function tryExec(bin: string, args: string[]): string | null {
  try {
    return execFileSync(bin, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}
function resolveFromPuppeteerBrowsersCLI(): string | null {
  try {
    const attempts: Array<{ cmd: string; args: string[] }> = [
      {
        cmd: 'npx',
        args: ['-y', '@puppeteer/browsers', 'path', 'firefox@stable'],
      },
      {
        cmd: 'pnpm',
        args: ['dlx', '@puppeteer/browsers', 'path', 'firefox@stable'],
      },
      {
        cmd: 'yarn',
        args: ['dlx', '@puppeteer/browsers', 'path', 'firefox@stable'],
      },
      { cmd: 'bunx', args: ['@puppeteer/browsers', 'path', 'firefox@stable'] },
    ];

    for (const { cmd, args } of attempts) {
      try {
        const out = execFileSync(cmd, args, {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
          timeout: 2000,
        }).trim();

        if (out && fs.existsSync(out)) return out;
      } catch {
        // Ignore errors
      }
    }

    return null;
  } catch {
    // Ignore errors
  }

  return null;
}
