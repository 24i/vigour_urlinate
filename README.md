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

## Why?

This makes it easy to create an ecosystem of chainable HTTP GET APIs. This is useful if, for example, a browser is launching a request for you (from an image tag or css instruction) but you still want to use your API.

#### Services using this kind of API

  - [cachinate](github.com/vigour-io/cachinate)
  - [imaginate](github.com/vigour-io/imaginate)

#### Example with chaining and nesting

- [The avatar example](examples/avatar.js)