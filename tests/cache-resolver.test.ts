import { describe, expect, test } from 'vitest';
import { resolveFromPuppeteerCache } from '../src/resolve-puppeteer-cache';

const makeFs = (entries: Record<string, 'file' | 'dir'>) => {
  return {
    existsSync: (p: string) => Boolean(entries[p]),
    readdirSync: (p: string) => {
      const prefix = p.endsWith('/') ? p : p + '/';
      const names = Object.keys(entries)
        .filter((k) => k.startsWith(prefix))
        .map((k) => k.slice(prefix.length).split('/')[0]);
      const unique = Array.from(new Set(names));
      return unique.map((name) => ({ name, isDirectory: true })) as any;
    },
  };
};

describe('resolveFromPuppeteerCache', () => {
  test('honors PUPPETEER_CACHE_DIR override (macOS)', () => {
    const base = '/tmp/managed/firefox/firefox';
    const platformDir = `${base}/mac_arm-123`;
    const bin = `${platformDir}/Firefox.app/Contents/MacOS/firefox`;
    const fs = makeFs({
      [base]: 'dir',
      [platformDir]: 'dir',
      [bin]: 'file',
    });

    const out = resolveFromPuppeteerCache({
      fs,
      env: { PUPPETEER_CACHE_DIR: base } as any,
      platform: 'darwin',
    });

    expect(out).toBe(bin);
  });
});

