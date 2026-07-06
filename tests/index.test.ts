import {describe, expect, test} from 'vitest'

import firefoxLocation, {getInstallGuidance} from '../src/index'

describe('firefox-location2 module', () => {
  it('returns a string path or null', () => {
    const res = firefoxLocation()

    expect(typeof res === 'string' || res === null).toBe(true)
  })

  it('getInstallGuidance renders caller-provided install steps in order', () => {
    const msg = getInstallGuidance({
      steps: [
        {
          summary: 'Install Firefox (recommended)',
          command: 'npx extension install firefox'
        },
        {
          summary: 'Install Firefox Nightly',
          command: 'npx extension install firefox-nightly'
        }
      ]
    })

    expect(msg).toMatch(
      /1\) Install Firefox \(recommended\)\n {3}npx extension install firefox/
    )
    expect(msg).toMatch(
      /2\) Install Firefox Nightly\n {3}npx extension install firefox-nightly/
    )
    expect(msg).not.toMatch(/@puppeteer\/browsers install firefox@stable/)
    expect(msg).toMatch(/We couldn't find a Firefox browser/)
  })

  it('getInstallGuidance with empty steps keeps the default hint', () => {
    expect(getInstallGuidance({steps: []})).toBe(getInstallGuidance())
  })
})
