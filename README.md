# Urlinate

Adds data to a URL

<!-- VDOC.badges travis; standard; npm; coveralls -->
<!-- DON'T EDIT THIS SECTION (including comments), INSTEAD RE-RUN `vdoc` TO UPDATE -->
[![Build Status](https://travis-ci.org/vigour-io/urlinate.svg?branch=master)](https://travis-ci.org/vigour-io/urlinate)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/urlinate.svg)](https://badge.fury.io/js/urlinate)
[![Coverage Status](https://coveralls.io/repos/github/vigour-io/urlinate/badge.svg?branch=master)](https://coveralls.io/github/vigour-io/urlinate?branch=master)

<!-- VDOC END -->

<!-- VDOC.jsdoc urlinate -->
<!-- DON'T EDIT THIS SECTION (including comments), INSTEAD RE-RUN `vdoc` TO UPDATE -->
#### var newUrl = urlinate(url, data)

Adds data to a URL. As syntax sugar for recursion, if the data provided contains an object with a `key === '$'`, the value at that key will be considered an array of arguments to pass to urlinate to obtain a string which will replace said object.
- **url** (*string*) - Anything you can pass to [Node's url.parse](https://nodejs.org/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost)
- **data** (*object*) - The data to add to the URL
- **returns** (*string*) newUrl - the original url but with specified data encoded in the `d` query parameter

<!-- VDOC END -->

```javascript
var urlinator = require('urlinator')
urlinate('cachinate.io', {
  asset: {
    $: ['imaginate.io', {
      input: 'imgs.io/a.jpg'
    }]
  }
})
// cachinate.io?asset=imaginate.io%3Finput%3Dimgs.io%252Fa.jpg
```

## example

[The avatar example](examples/avatar.js) uses `urlinate` to export a function which accepts the URL of a source image and produces a URL for an avatar based on that image to be created by [imaginate](https://npmjs.org/package/imaginate) and cached by [cachinate](https://npmjs.org/package/cachinate). See how these servers parse the URL produced in [the tests](test/index.js)