const test = require('ava')
const execa = require('execa')

test('wd label: display help', t => {
  return execa.shell('../bin/wd label')
  .then(res => t.deepEqual(res.stdout.split('Usage:').length, 2))
})