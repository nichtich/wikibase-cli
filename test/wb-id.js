require('should')
const { shellExec } = require('./lib/utils')

describe('wb id', function () {
  this.timeout(20000)

  it('display help', async () => {
    const { stdout } = await shellExec('./bin/wd id')
    stdout.split('Usage:').length.should.equal(2)
  })

  it('should accept a Wikipedia article title', async () => {
    const { stdout } = await shellExec('./bin/wd id Cantabria -l en')
    stdout.should.equal('Q3946')
  })

  it('should accept a sitelink URL', async () => {
    const { stdout } = await shellExec('./bin/wd id https://fr.wikipedia.org/wiki/The_Ister')
    stdout.should.equal('Q3521413')
  })
})
