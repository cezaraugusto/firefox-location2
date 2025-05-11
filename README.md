[npm-image]: https://img.shields.io/npm/v/firefox-location2.svg
[npm-url]: https://npmjs.org/package/firefox-location2
[action-image]: https://github.com/cezaraugusto/firefox-location2/workflows/CI/badge.svg
[action-url]: https://github.com/cezaraugusto/firefox-location2/actions?query=workflow%3ACI
[downloads-image]: https://img.shields.io/npm/dm/firefox-location2.svg
[downloads-url]: https://npmjs.org/package/firefox-location2

# firefox-location2 [![npm][npm-image]][npm-url] [![workflow][action-image]][action-url] [![downloads][downloads-image]][downloads-url] 

> Approximates the current location of the Firefox browser across platforms.

# Usage

**Via Node.js:**

```js
// ESM
import firefoxLocation from 'firefox-location2'

// Returns the path to Firefox as a string
console.log(firefoxLocation())
// /Applications/Firefox.app/Contents/MacOS/firefox

// CommonJS
const firefoxLocation = require('firefox-location')
```

## Supported Platforms

- macOS (darwin)
- Windows (win32)
- Linux (default fallback)

## Related projects

* [chrome-location2](https://github.com/hughsk/chrome-location2)
* [edge-location](https://github.com/cezaraugusto/edge-location)
* [firefox-location](https://github.com/hughsk/firefox-location)
* [brave-location](https://github.com/cezaraugusto/brave-location)
* [vivaldi-location](https://github.com/jandrey/vivaldi-location)
* [opera-location](https://github.com/jandrey/opera-location)

## License

MIT (c) Cezar Augusto.
