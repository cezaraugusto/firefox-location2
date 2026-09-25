import fs from 'fs'
import os from 'os'
import path from 'path'

import {afterEach, describe, expect, it} from 'vitest'

import {getFirefoxVersion} from '../src/index'

const dirs: string[] = []

afterEach(() => {
  for (const dir of dirs.splice(0)) {
    fs.rmSync(dir, {recursive: true, force: true})
  }
})

function temp (): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'firefox-location2-version-'))

  dirs.push(dir)

  return dir
}

// A macOS bundle whose Info.plist names the version, the way the managed
// Nightly and the forks ship it.
function bundle (version: string): string {
  const app = path.join(temp(), 'Firefox Nightly.app')
  const bin = path.join(app, 'Contents', 'MacOS', 'firefox')

  fs.mkdirSync(path.dirname(bin), {recursive: true})
  fs.writeFileSync(bin, '')
  fs.writeFileSync(
    path.join(app, 'Contents', 'Info.plist'),
    `<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0"><dict>
  <key>CFBundleShortVersionString</key>
  <string>${version}</string>
</dict></plist>
`
  )

  return bin
}

// A binary that answers --version the way firefox does.
function script (line: string): string {
  const bin = path.join(temp(), 'firefox')

  fs.writeFileSync(bin, `#!/bin/sh\necho "${line}"\n`)
  fs.chmodSync(bin, 0o755)

  return bin
}

describe('getFirefoxVersion keeps the pre-release marker', () => {
  it.skipIf(process.platform !== 'darwin')(
    'reads a Nightly, a beta, an ESR and a release off the bundle plist',
    () => {
      expect(getFirefoxVersion(bundle('158.0a1'))).toBe('158.0a1')
      expect(getFirefoxVersion(bundle('141.0b3'))).toBe('141.0b3')
      expect(getFirefoxVersion(bundle('128.5.0esr'))).toBe('128.5.0esr')
      expect(getFirefoxVersion(bundle('158.0'))).toBe('158.0')
      expect(getFirefoxVersion(bundle('1.22.3b'))).toBe('1.22.3b')
    }
  )

  it.skipIf(process.platform === 'win32')(
    'reads the same off a --version line',
    () => {
      expect(
        getFirefoxVersion(script('Mozilla Firefox 158.0a1'), {allowExec: true})
      ).toBe('158.0a1')
      expect(
        getFirefoxVersion(script('Mozilla Firefox 158.0'), {allowExec: true})
      ).toBe('158.0')
      expect(
        getFirefoxVersion(script('Mozilla Zen 1.22.3b'), {allowExec: true})
      ).toBe('1.22.3b')
    }
  )
})
