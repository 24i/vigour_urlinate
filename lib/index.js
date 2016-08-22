'use strict'

const url = require('url')
const _isArray = require('lodash.isarray')

const URL = 0
const DATA = 1

module.exports = exports = urlinate
urlinate.stringify = stringify

/**
 * @id urlinate
 * @function urlinate
 * Adds data to a URL. As syntax sugar for recursion, if the data provided contains an object with a `key === '$'`, the value at that key will be considered an array of arguments to pass to urlinate to obtain a string which will replace said object.
 * @param url {string} - Anything you can pass to [Node's url.parse](https://nodejs.org/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost)
 * @param data {object} - The data to add to the URL
 * @returns newUrl {string} - the original url but with specified data encoded in the `d` query parameter
 */
function urlinate (args, top, path) {
  // convert from documented function signature to internal
  if (!_isArray(args)) {
    return urlinate([args, top])
  }

  const urlish = args[URL]
  const data = args[DATA]

  var newUrl = url.parse(urlish)
  if (!newUrl.query) {
    newUrl.query = {}
  }
  newUrl.query.d = stringify(top || data, path || [], data)
  return newUrl.format()
}

/**
 * @function stringify
 * Converts urlinate data to a string
 * @param data {any} - The object to stringify
 * @returns str {string}
 */
function stringify (data) {
  if (typeof (data) === 'object') {
    for (let key in data) {
      if (key === '$') {
        return urlinate(data[key])
      } else {
        data[key] = stringify(data[key])
      }
    }
    return JSON.stringify(data)
  } else {
    return data
  }
}
