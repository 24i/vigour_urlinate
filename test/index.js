'use strict'

const test = require('tape')
const urlinate = require('../')

const urls = require('./urls')

const LABEL = 0 // Name the test
const OBJ = 1 // args parameter
const STR = 2 // expected string

const testCases = [
  [
    'simple',
    [urls.cachinate, {
      asset: urls.image
    }],
    'http://cachinate.io/?d=%7B%22asset%22%3A%22https%3A%2F%2Fimg.jpg%23h%22%7D'
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
    'http://cachinate.io/?d=%7B%22asset%22%3A%22https%3A%2F%2Fimaginate.io%2F%3Fd%3D%257B%2522input%2522%253A%2522https%253A%252F%252Fimg.jpg%2523h%2522%257D%22%7D'
  ]
]
const nbTests = testCases.length
test('stringify', function (t) {
  for (let i = 0; i < nbTests; i += 1) {
    let testCase = testCases[i]
    let expected = testCase[STR]
    let observed = urlinate(testCase[OBJ])
    t.equal(observed, expected, testCase[LABEL])
    t.comment('Length of produced url ' + observed.length)
  }
  t.end()
})
