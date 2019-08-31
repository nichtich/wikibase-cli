const program = require('../program')
const wdEdit = require('wikibase-edit')
const { inspect } = require('util')
const { red } = require('chalk')
const parseObjectValue = require('./parse_object_value')

module.exports = (section, action) => {
  const name = `${action}-${section}`
  program.process(name)

  if (!program.instance) throw new Error('missing instance')

  let { args } = program

  if (args.length === 0) return program.help()

  // Allow to define a customArgsParser on program to convert the command-line input
  // into what the wikibase-edit interface expects.
  // Running this after program.process allows to pass after the options
  // where removed from the args array
  if (program.customArgsParser) args = program.customArgsParser(args)

  if (program.dry) return console.log(JSON.stringify(args[0], null, 2))

  try {
    args = args.map(parseObjectValue)
  } catch (err) {
    logDeepError(err)
  }

  const config = require('../config/config')

  const cmd = () => {
    const { verbose, instance } = program
    const wdEditConfig = {
      instance,
      credentials: {
        username: config.username,
        password: config.password
      },
      summary: '#wikidatajs/cli',
      bot: config.bot,
      verbose
    }
    section = customSectionRenaming[section] || section
    return wdEdit(wdEditConfig)[section][action].apply(null, args)
    .then(res => {
      if (!program.quiet) console.log(JSON.stringify(res, null, 2))
    })
  }

  if (program.instance) config.instance = program.instance

  require('./assert_credentials')(config)
  .then(cmd)
  .catch(logDeepError)
}

// Show the full error object
const logDeepError = err => {
  if (err.statusCode === 400) {
    console.error(red(err.message), err.context)
  } else {
    // util.inspect doc: https://nodejs.org/api/util.html#util_util_inspect_object_options
    console.error(inspect(err, { depth: null, maxArrayLength: null }))
  }
  process.exit(1)
}

// The wikibase-edit command is wdEdit.entity.create
// but it can't create properties,
// so calling the command create-item makes more sense
const customSectionRenaming = {
  item: 'entity'
}
