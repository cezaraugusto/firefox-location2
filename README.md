[npm-version-image]: https://img.shields.io/npm/v/firefox-location2.svg?color=FF7139
[npm-version-url]: https://www.npmjs.com/package/firefox-location2
[npm-downloads-image]: https://img.shields.io/npm/dm/firefox-location2.svg?color=2ecc40
[npm-downloads-url]: https://www.npmjs.com/package/firefox-location2
[action-image]: https://github.com/cezaraugusto/firefox-location2/actions/workflows/ci.yml/badge.svg?branch=main
[action-url]: https://github.com/cezaraugusto/firefox-location2/actions

> Approximates the current location of the Firefox browser across platforms.

# firefox-location2 [![Version][npm-version-image]][npm-version-url] [![Downloads][npm-downloads-image]][npm-downloads-url] [![workflow][action-image]][action-url]

<img alt="Firefox" align="right" src="https://cdn.jsdelivr.net/gh/extension-js/media@db5deb23fbfa85530f8146718812972998e13a4d/browser_logos/svg/firefox.svg" width="10.5%" />

* Finds Firefox in the following channel order: `stable` / `esr` / `developer edition` / `nightly`.
* Supports macOS / Windows / Linux
* Works both as an ES module or CommonJS

## Support table

This table lists the default locations where Firefox is typically installed for each supported platform and channel. The package checks these paths (in order) and returns the first one found. 

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

Returns the first existing path found, or <code>null</code> if none are found.

Note: On Linux, the module first tries to resolve binaries on <code>$PATH</code> (using <code>which</code>) for the common channels listed above, then falls back to checking common filesystem locations like <code>/usr/bin/firefox</code>, <code>/usr/local/bin/firefox</code>, <code>/snap/bin/firefox</code>, and <code>/opt/firefox/firefox</code>.

## Usage

**Via Node.js:**

```js
import firefoxLocation from "firefox-location2";

console.log(firefoxLocation());
// /Applications/Firefox.app/Contents/MacOS/firefox
```

**Via CLI:**

```bash
npx firefox-location2
# /Applications/Firefox.app/Contents/MacOS/firefox
```

## Planned enhancements

- Flatpak detection on Linux: detect installed Flatpak app <code>org.mozilla.firefox</code> and expose the appropriate invocation.
- Custom build locations: probe common custom paths such as <code>~/bin/firefox</code>, <code>~/Downloads/firefox/firefox</code>, <code>/usr/local/firefox/firefox</code>, <code>/opt/firefox-dev/firefox</code>.
- Optional binary validation: helper to return <code>firefox --version</code> (or Flatpak equivalent) for diagnostics.
- Optional launch helpers: generate safe args (e.g., <code>--no-remote</code>, <code>--new-instance</code>, <code>-profile</code>, optional <code>-start-debugger-server</code>), with Flatpak-specific sandbox flags when applicable.

## Related projects

* [chrome-location2](https://github.com/hughsk/chrome-location2)
* [edge-location](https://github.com/cezaraugusto/edge-location)
* [firefox-location](https://github.com/hughsk/firefox-location)
* [brave-location](https://github.com/cezaraugusto/brave-location)
* [vivaldi-location](https://github.com/jandrey/vivaldi-location)
* [opera-location](https://github.com/jandrey/opera-location)

## License

MIT (c) Cezar Augusto.
