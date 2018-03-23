#!/usr/bin/env node
/**
 * Replace the locale in an exported space.
 *
 * Usage:
 *  node index.js -l es-ES < space.json > translated.json
 *
 * The above will translate the space to Spanish (currently the only supported
 * language to translate to).
 */

const cli = require('commander')
const fs = require('fs')
const util = require('util')

// Here we will remember which SpaceFile the user wants to translate to what.
let spaceFilePath
let targetLocale

cli
  .version(require('./package.json').version)
  .usage('<exportedSpaceFile> <targetLocale>')
  .option('-b, --base-locale [base locale]', 'The current locale of the exported Space, defaults to en-US')
  .option('-s, --save [save file]', 'Save the resulting Space in a file')
  .action((exportedSpaceFile, usersTargetLocale) => {
    if (!exportedSpaceFile || !usersTargetLocale) {
      console.log(`Please provide both the exported file and target locale.`)
      process.exit(1)
    }
    spaceFilePath = exportedSpaceFile
    targetLocale = usersTargetLocale
  })

cli.on('--help', () => {
  console.log('\nIf you do not specify "-s" you can pipe the output of this tool into a file using the ">" operator.')
})

cli.parse(process.argv)

const baseLocale = cli.baseLocale || 'en-US'

const locales = require('./locales.json')

const run = async () => {
  if (!locales.find(locale => locale.code === targetLocale)) {
    console.log(`Sorry, but we don't support ${targetLocale}\nYou can open a request at https://github.com/HoverBaum/contentful-locale/issues`)
  }
  const loadFile = util.promisify(fs.readFile)
  const spaceFile = await loadFile(spaceFilePath)
  const space = spaceFile.toString()
  const replacesLocaleCodes = space.replace(new RegExp(baseLocale, 'g'), targetLocale)
  const parsedSpace = JSON.parse(replacesLocaleCodes)
  parsedSpace.locales = [locales.find(locale => locale.code === targetLocale)]
  if (cli.save) {
    const saveFile = util.promisify(fs.writeFile)
    await saveFile(cli.save, JSON.stringify(parsedSpace, null, 2))
  } else {
    console.log(JSON.stringify(parsedSpace, null, 2))
  }
}

run()
