'use strict'

const url = require('url')
const test = require('tape')
const urlinate = require('../')

const urls = require('./urls')

const avatar = require('../examples/avatar')
const cachinate = require('../examples/cachinate')

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
  // console.log('avatarURL', avatarURL)
  t.comment('length of produced url ' + avatarURL.length)

  // Let's verify that this will be parsable in the way we expect it to be

  const cachinateQuery = urlinate.parse(url.parse(avatarURL).query)
  // console.log('cachinateQuery', cachinateQuery)
  t.equal(parseInt(cachinateQuery.duration, 10), 604800, 'correct cache duration for produced image')

  const imaginateQuery = urlinate.parse(url.parse(cachinateQuery.asset).query)
  // console.log('imaginateQuery', imaginateQuery)

  const inputQuery = urlinate.parse(url.parse(imaginateQuery.input).query)
  // console.log('inputQuery', inputQuery)
  t.equal(inputQuery.asset, urls.image, 'correct source input')

  const transforms = imaginateQuery.use
  // console.log('transforms', transforms)
  for (let i = 0, len = transforms.length; i < len; i += 1) {
    let cachedTransformQuery = urlinate.parse(url.parse(transforms[i][0]).query)
    // console.log('cachedTransformQuery', cachedTransformQuery)
    let transform = cachedTransformQuery.asset
    // console.log('transform', transform)
    t.equal(transform, avatar.obj.asset.$[1].use[i][0].$[1].asset, 'correct transform URL')

    let transformOptions = transforms[i][1]
    // console.log('transformOptions', transformOptions)
    if (i === 1) {
      let cachedMask = url.parse(transformOptions.mask)
      // console.log('cachedMask', cachedMask)
      let cachedMaskQuery = urlinate.parse(cachedMask.query)
      // console.log('cachedMaskQuery', cachedMaskQuery)
      t.equal(cachedMaskQuery.asset, urls.mask, 'correct mask')
    } else {
      t.deepEqual(transformOptions, getTransformOptions(i), 'correct transform options for transform ' + i)
    }
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

test('cachinate example', function (t) {
  const cachinateURL = cachinate(urls.image)
  // console.log('cachinateURL', cachinateURL)
  t.comment('length of produced url ' + cachinateURL.length)

  // Let's verify that this will be parsable in the way we expect it to be

  const cachinateQuery = urlinate.parse(url.parse(cachinateURL).query)
  console.log('cachinateQuery', cachinateQuery)
  t.equal(parseInt(cachinateQuery.duration, 10), 604800, 'correct cache duration for produced image')

  t.equal(cachinateQuery.asset, urls.image, 'correct asset URL')
  t.deepEqual(cachinateQuery.headers, cachinate.obj.headers, 'headers are correct')
  t.end()
})
