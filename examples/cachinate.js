'use strict'

const urlinate = require('../')

const urls = require('../test/urls.js')

/**
 * @id cachinate
 * @function cachinate
 * Creates a URL for a cachinator request.
 * @param asset {string} - The original asset to be cached
 * @returns url {string} - A URL for the cached resulting cached asset
 */
module.exports = exports = function cachinate (asset) {
  var obj = exports.obj
  obj.asset = asset
  return urlinate(urls.cachinate, obj)
}

exports.obj = {
  duration: 60 * 60 * 24 * 7, // a week
  asset: urls.image,
  headers: {
    'x-wtv': 'whatever'
  }
}
