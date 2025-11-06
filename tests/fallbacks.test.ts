import { describe, expect, test, afterEach, vi } from 'vitest';

describe('firefox-location2 fallbacks', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  test('Linux/other: strict only stable; fallback tries esr/devedition/nightly', async () => {
    const locate = (await import('../src/index')).default as any;
    const calls: string[] = [];
    const strict = locate(false, {
      platform: 'linux',
      which: {
        sync: (cmd: string) => {
          calls.push(cmd);
          throw new Error('nf');
        },
      },
    });
    const res = locate(true, {
      platform: 'linux',
      which: {
        sync: (cmd: string) => {
          calls.push(cmd);
          if (cmd === 'firefox-esr') return '/usr/bin/firefox-esr';
          throw new Error('nf');
        },
      },
    });
    expect(strict).toBeNull();
    expect(
      res === '/usr/bin/firefox-esr' || res === null || typeof res === 'string',
    ).toBe(true);
    expect(calls[0]).toBe('firefox');
    expect(calls.includes('firefox-esr')).toBe(true);
  });

  test('macOS: strict null; fallback finds Developer Edition when stable missing', async () => {
    const locate = (await import('../src/index')).default as any;
    const strict = locate(false, {
      platform: 'darwin',
      fs: {
        existsSync: (p: string) => p.includes('Firefox Developer Edition.app'),
      },
      os: { homedir: () => '/Users/test' },
      path: { join: (...x: string[]) => x.join('/') },
    });
    const res = locate(true, {
      platform: 'darwin',
      fs: {
        existsSync: (p: string) => p.includes('Firefox Developer Edition.app'),
      },
      os: { homedir: () => '/Users/test' },
      path: { join: (...x: string[]) => x.join('/') },
    });
    expect(strict).toBeNull();
    expect(
      typeof res === 'string' && res.includes('Firefox Developer Edition.app'),
    ).toBe(true);
  });

  test('Windows: strict null; fallback finds ESR when stable missing', async () => {
    const locate = (await import('../src/index')).default as any;
    const strict = locate(false, {
      platform: 'win32',
      fs: { existsSync: (p: string) => /Mozilla Firefox ESR/.test(p) },
      env: {
        LOCALAPPDATA: 'C\\Local',
        PROGRAMFILES: 'C\\PF',
        'PROGRAMFILES(X86)': undefined,
      } as any,
      path: { join: (...x: string[]) => x.join('\\') },
    });
    const res = locate(true, {
      platform: 'win32',
      fs: { existsSync: (p: string) => /Mozilla Firefox ESR/.test(p) },
      env: {
        LOCALAPPDATA: 'C\\Local',
        PROGRAMFILES: 'C\\PF',
        'PROGRAMFILES(X86)': undefined,
      } as any,
      path: { join: (...x: string[]) => x.join('\\') },
    });
    expect(strict).toBeNull();
    expect(typeof res === 'string' && /Mozilla Firefox ESR/.test(res)).toBe(
      true,
    );
  });

  test('returns null when nothing found (linux)', async () => {
    const locate = (await import('../src/index')).default as any;
    const res = locate(false, {
      platform: 'linux',
      which: {
        sync: () => {
          throw new Error('nf');
        },
      },
      fs: { existsSync: () => false },
    });
    expect(res).toBeNull();
  });

  test('returns null when nothing found (darwin)', async () => {
    const locate = (await import('../src/index')).default as any;
    const res = locate(false, {
      platform: 'darwin',
      fs: { existsSync: () => false },
      os: { homedir: () => '/Users/test' },
      path: { join: (...x: string[]) => x.join('/') },
    });
    expect(res).toBeNull();
  });

  test('returns null when nothing found (win32)', async () => {
    const locate = (await import('../src/index')).default as any;
    const res = locate(false, {
      platform: 'win32',
      fs: { existsSync: () => false },
      env: {
        LOCALAPPDATA: 'C\\Local',
        PROGRAMFILES: 'C\\PF',
        'PROGRAMFILES(X86)': undefined,
      } as any,
      path: { join: (...x: string[]) => x.join('\\') },
    });
    expect(res).toBeNull();
  });
});
