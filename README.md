[npm-version-image]: https://img.shields.io/npm/v/firefox-location2.svg?color=FF7139
[npm-version-url]: https://www.npmjs.com/package/firefox-location2
[npm-downloads-image]: https://img.shields.io/npm/dm/firefox-location2.svg?color=2ecc40
[npm-downloads-url]: https://www.npmjs.com/package/firefox-location2
[action-image]: https://github.com/cezaraugusto/firefox-location2/actions/workflows/ci.yml/badge.svg?branch=main
[action-url]: https://github.com/cezaraugusto/firefox-location2/actions

> Approximates the current location of the Firefox browser across platforms.

# firefox-location2 [![Version][npm-version-image]][npm-version-url] [![Downloads][npm-downloads-image]][npm-downloads-url] [![workflow][action-image]][action-url]

<img alt="Firefox" align="right" src="https://cdn.jsdelivr.net/gh/extension-js/media@db5deb23fbfa85530f8146718812972998e13a4d/browser_logos/svg/firefox.svg" width="10.5%" />

- By default checks only `stable`. Optionally can cascade to `esr` / `developer edition` / `nightly`.
- Supports macOS / Windows / Linux
- Works both as an ES module or CommonJS

New in this version:

- Optional helper to throw with a friendly install guide when nothing is found
- CLI output is colorized (green on success, red on error)
- After you run `npx @puppeteer/browsers install firefox@stable` once, we auto-detect Firefox from Puppeteer's cache on all platforms (no env vars needed)

## Support table

This table lists the default locations where Firefox is typically installed for each supported platform and channel. By default, only the Stable channel is checked. When fallback is enabled, the package checks these paths (in order) and returns the first one found.

<table>
  <thead>
    <tr>
      <th>Platform</th>
      <th>Channel</th>
      <th>Paths checked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="4" align="center"><img alt="" width="64" height="64" src="https://cdn.jsdelivr.net/gh/extension-js/media@db5deb23fbfa85530f8146718812972998e13a4d/platform_logos/macos.png" /><br><strong>macOS</strong></td>
      <td align="center">Firefox (Stable)</td>
      <td>
        <ul>
          <li><code>/Applications/Firefox.app/Contents/MacOS/firefox</code></li>
          <li><code>~/Applications/Firefox.app/Contents/MacOS/firefox</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Firefox ESR</td>
      <td>
        <ul>
          <li><code>/Applications/Firefox ESR.app/Contents/MacOS/firefox</code></li>
          <li><code>~/Applications/Firefox ESR.app/Contents/MacOS/firefox</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Firefox Developer Edition</td>
      <td>
        <ul>
          <li><code>/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox</code></li>
          <li><code>~/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Firefox Nightly</td>
      <td>
        <ul>
          <li><code>/Applications/Firefox Nightly.app/Contents/MacOS/firefox</code></li>
          <li><code>~/Applications/Firefox Nightly.app/Contents/MacOS/firefox</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td rowspan="4" align="center"><img alt="" width="64" height="64" src="https://cdn.jsdelivr.net/gh/extension-js/media@db5deb23fbfa85530f8146718812972998e13a4d/platform_logos/windows.png" /><br><strong>Windows</strong></td>
      <td align="center">Firefox (Stable)</td>
      <td>
        <ul>
          <li><code>%LOCALAPPDATA%\\Mozilla Firefox\\firefox.exe</code></li>
          <li><code>%PROGRAMFILES%\\Mozilla Firefox\\firefox.exe</code></li>
          <li><code>%PROGRAMFILES(X86)%\\Mozilla Firefox\\firefox.exe</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Firefox ESR</td>
      <td>
        <ul>
          <li><code>%LOCALAPPDATA%\\Mozilla Firefox ESR\\firefox.exe</code></li>
          <li><code>%PROGRAMFILES%\\Mozilla Firefox ESR\\firefox.exe</code></li>
          <li><code>%PROGRAMFILES(X86)%\\Mozilla Firefox ESR\\firefox.exe</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Firefox Developer Edition</td>
      <td>
        <ul>
          <li><code>%LOCALAPPDATA%\\Mozilla Firefox Developer Edition\\firefox.exe</code></li>
          <li><code>%PROGRAMFILES%\\Mozilla Firefox Developer Edition\\firefox.exe</code></li>
          <li><code>%PROGRAMFILES(X86)%\\Mozilla Firefox Developer Edition\\firefox.exe</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Firefox Nightly</td>
      <td>
        <ul>
          <li><code>%LOCALAPPDATA%\\Firefox Nightly\\firefox.exe</code></li>
          <li><code>%PROGRAMFILES%\\Firefox Nightly\\firefox.exe</code></li>
          <li><code>%PROGRAMFILES(X86)%\\Firefox Nightly\\firefox.exe</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td rowspan="5" align="center"><img alt="" width="64" height="64" src="https://cdn.jsdelivr.net/gh/extension-js/media@db5deb23fbfa85530f8146718812972998e13a4d/platform_logos/linux.png" /><br><strong>Linux/other</strong></td>
      <td align="center">Firefox (Stable)</td>
      <td>
        <ul>
          <li><code>firefox</code> (on <code>$PATH</code>)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Firefox ESR</td>
      <td>
        <ul>
          <li><code>firefox-esr</code> (on <code>$PATH</code>)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Firefox Developer Edition</td>
      <td>
        <ul>
          <li><code>firefox-developer-edition</code> / <code>firefox-devedition</code> (on <code>$PATH</code>)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Firefox Nightly</td>
      <td>
        <ul>
          <li><code>firefox-nightly</code> (on <code>$PATH</code>)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Common locations</td>
      <td>
        <ul>
          <li><code>/usr/bin/firefox</code></li>
          <li><code>/usr/local/bin/firefox</code></li>
          <li><code>/snap/bin/firefox</code> (Snap)</li>
          <li><code>/opt/firefox/firefox</code></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

Returns the first existing path found (given selected channels), or <code>null</code> if none are found.

Note: On Linux, the module first tries to resolve binaries on <code>$PATH</code> (using <code>which</code>) for the common channels listed above, then falls back to checking common filesystem locations like <code>/usr/bin/firefox</code>, <code>/usr/local/bin/firefox</code>, <code>/snap/bin/firefox</code>, and <code>/opt/firefox/firefox</code>.

## Usage

**Via Node.js (strict by default):**

```js
import firefoxLocation from 'firefox-location2'

// Strict (Stable only)
console.log(firefoxLocation())
// => "/Applications/Firefox.app/Contents/MacOS/firefox" or null

// Enable fallback (Stable / ESR / Developer Edition / Nightly)
console.log(firefoxLocation(true))
// => first found among Stable/ESR/Developer/Nightly or null

// Throw with a friendly, copy-pasteable guide when not found
import {locateFirefoxOrExplain, getInstallGuidance} from 'firefox-location2'
try {
  const path = locateFirefoxOrExplain({allowFallback: true})
  console.log(path)
} catch (e) {
  console.error(String(e))
  // Or print getInstallGuidance() explicitly
}
```

**CommonJS:**

```js
const api = require('firefox-location2')
const locateFirefox = api.default || api

// Strict (Stable only)
console.log(locateFirefox())

// With fallback enabled
console.log(locateFirefox(true))

// Helper that throws with guidance
try {
  const p = (
    api.locateFirefoxOrExplain || ((o) => locateFirefox(o?.allowFallback))
  )({allowFallback: true})
  console.log(p)
} catch (e) {
  console.error(String(e))
}
```

**Via CLI:**

```bash
npx firefox-location2
# Strict (Stable only)

npx firefox-location2 --fallback
# Enable cascade (Stable / ESR / Developer / Nightly)

# Output is colorized when printed to a TTY

# Respect Puppeteer cache (after you install once):
npx @puppeteer/browsers install firefox@stable
npx firefox-location2
```

### Environment overrides

If this environment variable is set and points to an existing binary, it takes precedence:

- `FIREFOX_BINARY`

Exit behavior:

- Prints the resolved path on success
- Exits with code 1 and prints a guidance message if nothing suitable is found

Notes:

- Output is colorized when printed to a TTY (green success, red error)
- After you run `npx @puppeteer/browsers install firefox@stable` once, we auto-detect Firefox from Puppeteer's cache on all platforms. No env vars needed.

## Planned enhancements

- Flatpak detection on Linux: detect installed Flatpak app <code>org.mozilla.firefox</code> and expose the appropriate invocation.
- Custom build locations: probe common custom paths such as <code>~/bin/firefox</code>, <code>~/Downloads/firefox/firefox</code>, <code>/usr/local/firefox/firefox</code>, <code>/opt/firefox-dev/firefox</code>.
- Optional binary validation: helper to return <code>firefox --version</code> (or Flatpak equivalent) for diagnostics.
- Optional launch helpers: generate safe args (e.g., <code>--no-remote</code>, <code>--new-instance</code>, <code>-profile</code>, optional <code>-start-debugger-server</code>), with Flatpak-specific sandbox flags when applicable.

## Related projects

- [brave-location](https://github.com/cezaraugusto/brave-location)
- [chrome-location2](https://github.com/cezaraugusto/chrome-location2)
- [edge-location](https://github.com/cezaraugusto/edge-location)
- [opera-location2](https://github.com/cezaraugusto/opera-location2)
- [vivaldi-location2](https://github.com/cezaraugusto/vivaldi-location2)
- [yandex-location2](https://github.com/cezaraugusto/yandex-location2)

## License

MIT (c) Cezar Augusto.
