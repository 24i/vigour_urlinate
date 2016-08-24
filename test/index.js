'use strict'

const url = require('url')
const qs = require('qs')
const test = require('tape')
const urlinate = require('../')

const urls = require('./urls')

const avatar = require('../examples/avatar')

const LABEL = 0 // Name the test
const OBJ = 1 // args parameter
const STR = 2 // expected string

const testCases = [
  [
    'simple',
    [urls.cachinate, {
      asset: urls.image
    }],
    'http://cachinate.io/?asset=https%3A%2F%2Fimg.jpg%23h'
  ],
  [
    'nested',
    [urls.cachinate, {
      asset: {
        $: [urls.imaginate, {
          input: urls.image
        }]
      }
    }],
    'http://cachinate.io/?asset=https%3A%2F%2Fimaginate.io%2F%3Finput%3Dhttps%253A%252F%252Fimg.jpg%2523h'
  ]
]
const nbTests = testCases.length
test('stringify', function (t) {
  for (let i = 0; i < nbTests; i += 1) {
    let testCase = testCases[i]
    let expected = testCase[STR]
    let observed = urlinate(testCase[OBJ])
    t.equal(observed, expected, testCase[LABEL])
    t.comment('length of produced url ' + observed.length)
  }
  t.end()
})

test('avatar example', function (t) {
  const avatarURL = avatar(urls.image)
  t.comment('length of produced url ' + avatarURL.length)

  // Let's verify that this will be parsable in the way we expect it to be

  const cachinateQuery = qs.parse(url.parse(avatarURL).query)
  t.equal(parseInt(cachinateQuery.duration, 10), 604800, 'correct cache duration for produced image')

  const imaginateQuery = qs.parse(url.parse(cachinateQuery.asset).query)

  const inputQuery = qs.parse(url.parse(imaginateQuery.input).query)
  t.equal(inputQuery.asset, urls.image, 'correct source input')

  const parsedUse = qs.parse(imaginateQuery.use)
  var i = 0
  var item = parsedUse[i]
  while (item) {
    let parsed = qs.parse(item)

    let cachedTransform = url.parse(parsed[0])
    let cachedTransformQuery = qs.parse(cachedTransform.query)
    let transform = cachedTransformQuery.asset
    t.equal(transform, avatar.obj.asset.$[1].use[i][0].$[1].asset, 'correct transform URL')

    let transformOptions = qs.parse(parsed[1])
    if (i === 1) {
      let cachedMask = url.parse(transformOptions.mask)
      let cachedMaskQuery = qs.parse(cachedMask.query)
      t.equal(cachedMaskQuery.asset, urls.mask, 'correct mask')
    } else {
      t.deepEqual(transformOptions, getTransformOptions(i), 'correct transform options for transform ' + i)
    }

    i += 1
    item = parsedUse[i]
  }

  t.end()
})

function getTransformOptions (i) {
  if (i === 0) {
    return {
      width: '500',
      height: '500'
    }
  }
  if (i === 2) {
    return {
      sigma: '3',
      radius: '2'
    }
  }
  if (i === 3) {
    return {
      format: 'png'
    }
  }
  throw new Error('This is unexpected')
}
