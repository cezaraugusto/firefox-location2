import fs from 'node:fs';
import path from 'node:path';

type FsLike = Pick<typeof fs, 'existsSync' | 'readdirSync'>;
type EnvLike = NodeJS.ProcessEnv;

export function resolveFromPuppeteerCache(deps?: {
  fs?: FsLike;
  env?: EnvLike;
  platform?: NodeJS.Platform;
  homeDir?: string;
  localAppData?: string;
}): string | null {
  const f: FsLike = deps?.fs ?? fs;
  const env: EnvLike = deps?.env ?? process.env;
  const platform: NodeJS.Platform = deps?.platform ?? process.platform;

  try {
    const override = String(env.PUPPETEER_CACHE_DIR || '').trim();
    const overrideBase = override ? path.resolve(override) : '';

    if (platform === 'darwin') {
      const home = deps?.homeDir ?? env.HOME ?? '';
      const bases: string[] = [];
      if (overrideBase) bases.push(overrideBase);
      if (home) bases.push(path.join(home, 'Library', 'Caches', 'puppeteer', 'firefox'));
      if (bases.length === 0) return null;

      for (const base of bases) {
        const dirs = listDirs(f, base).filter(
          (d) => d.startsWith('mac-') || d.startsWith('mac_arm-'),
        );
        const candidates: string[] = [];
        for (const d of dirs) {
          candidates.push(
            path.join(base, d, 'Firefox.app', 'Contents', 'MacOS', 'firefox'),
          );

          candidates.push(
            path.join(
              base,
              d,
              'Firefox Nightly.app',
              'Contents',
              'MacOS',
              'firefox',
            ),
          );
        }

        const found = firstExisting(f, candidates);
        if (found) return found;
      }

      return null;
    }

    if (platform === 'win32') {
      const lad = deps?.localAppData ?? env.LOCALAPPDATA;
      const bases: string[] = [];
      if (overrideBase) bases.push(overrideBase);
      if (lad) bases.push(path.join(lad, 'puppeteer', 'firefox'));
      if (bases.length === 0) return null;

      for (const base of bases) {
        const dirs = listDirs(f, base);
        const preferred = [
          ...dirs.filter((d) => d.startsWith('win64-')),
          ...dirs.filter((d) => d.startsWith('win32-')),
        ];
        const candidates: string[] = [];

        for (const d of preferred) {
          candidates.push(path.join(base, d, 'firefox.exe'));
          candidates.push(path.join(base, d, 'firefox', 'firefox.exe'));
        }

        const found = firstExisting(f, candidates);
        if (found) return found;
      }

      return null;
    }

    // linux and others
    const xdg = env.XDG_CACHE_HOME;
    const home = deps?.homeDir ?? env.HOME ?? '';
    const cacheBase = xdg || (home ? path.join(home, '.cache') : undefined);
    const bases: string[] = [];
    if (overrideBase) bases.push(overrideBase);
    if (cacheBase) bases.push(path.join(cacheBase, 'puppeteer', 'firefox'));
    if (bases.length === 0) return null;

    for (const base of bases) {
      const dirs = listDirs(f, base).filter((d) => d.startsWith('linux-'));
      const candidates: string[] = [];

      for (const d of dirs) {
        candidates.push(path.join(base, d, 'firefox'));
        candidates.push(path.join(base, d, 'firefox', 'firefox'));
      }

      const found = firstExisting(f, candidates);
      if (found) return found;
    }

    return null;
  } catch {
    return null;
  }
}

function listDirs(f: FsLike, dir: string): string[] {
  try {
    return f
      .readdirSync(dir, { withFileTypes: true } as any)
      .filter((e: any) => {
        if (!e) return false;
        const v = (e as any).isDirectory;
        return typeof v === 'function' ? v.call(e) : Boolean(v);
      })
      .map((e: any) => e.name || String(e));
  } catch {
    return [];
  }
}

function firstExisting(f: FsLike, candidates: string[]): string | null {
  for (const c of candidates) {
    try {
      if (c && f.existsSync(c)) return c;
    } catch {
      // Ignore errors
    }
  }

  return null;
}
