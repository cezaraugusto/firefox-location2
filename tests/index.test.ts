import {describe, expect, test} from 'vitest'

import firefoxLocation from '../src/index'

describe('firefox-location2 module', () => {
  it('returns a string path or null', () => {
    const res = firefoxLocation()

    expect(typeof res === 'string' || res === null).toBe(true)
  })
})
