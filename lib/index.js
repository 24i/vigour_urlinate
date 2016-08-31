'use strict'

const url = require('url')
const qs = require('qs')
const _merge = require('lodash.merge')
const _isArray = require('lodash.isarray')
const isUrl = require('is-url')

const URL = 0
const DATA = 1

module.exports = exports = urlinate
urlinate.stringify = stringify
urlinate.parse = parse

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
  var merged = _merge(qs.parse(newUrl.query), data)
  newUrl.search = '?' + stringify(merged)
  return newUrl.format()
}

/**
 * @id stringify
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
    return qs.stringify(data)
  } else {
    return data
  }
}

/**
 * @id parse
 * @function parse
 * The opposite of urlinate.stringify
 * @param input {string} - The string to parse
 * @returns obj {object} - The parsed object
 */
function parse (input) {
  if (_isArray(input)) {
    for (let i = 0, len = input.length; i < len; i += 1) {
      parseItem(input, i)
    }
    return input
  } else if (typeof input === 'object') {
    for (let key in input) {
      parseItem(input, key)
    }
    return input
  } else {
    return parse(qs.parse(input))
  }
}

function parseItem (arr, idx) {
  if (arr[idx].slice(0, 2) === '0=') {
    // Looks like an array
    let arrish = qs.parse(arr[idx])
    let newArr = []
    for (let i in arrish) {
      newArr.push(arrish[i])
    }
    arr[idx] = parse(newArr)
  } else {
    // Doesn't look like an array
    arr[idx] = isUrl(arr[idx]) || arr[idx].indexOf('=') === -1
      ? arr[idx]
      : parse(arr[idx])
  }
}
