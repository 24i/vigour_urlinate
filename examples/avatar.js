'use strict'

const urlinate = require('../')

const urls = require('../test/urls.js')

/**
 * @id avatar
 * @function avatar
 * Creates a URL for an avatar a semi-transparent mask, blurring, resizing and porting to PNG, with all source images and the produced image being cached in the process.
 * @param sourceImageURL {string} - The original image to be transformed into an avatar
 * @returns url {string} - A URL for the cached resulting image
 */
module.exports = exports = function avatar (sourceImageURL) {
  var obj = exports.obj
  obj.asset.$[1].input.$[1].asset = sourceImageURL
  return urlinate(urls.cachinate, obj)
}

exports.obj = {
  duration: 60 * 60 * 24 * 7, // a week
  asset: {
    $: [urls.imaginate, {
      input: {
        $: [urls.cachinate, { // a year (default)
          asset: 'SOURCE_IMAGE_URL'
        }]
      },
      use: [
        // resize
        [{
          $: [urls.cachinate, {
            asset: urls.cResize
          }]
        }, {
          width: 500,
          height: 500
        }],
        // mask
        [{
          $: [urls.cachinate, {
            asset: urls.cMask
          }]
        }, {
          mask: {
            $: [urls.cachinate, {
              asset: urls.mask
            }]
          }
        }],
        // blur
        [{
          $: [urls.cachinate, {
            asset: urls.cBlur
          }]
        }, {
          sigma: 3,
          radius: 2
        }],
        // format
        [{
          $: [urls.cachinate, {
            asset: urls.cFormat
          }]
        }, {
          format: 'png'
        }]
      ]
    }]
  }
}
