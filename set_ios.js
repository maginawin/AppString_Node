'use strict'

// HomeeLife
// node set_ios.js -f ./assert/homeelife_Localizable.strings ./assert/homeelife_translation.xlsx ./assert/homeelife_Localizable_cn.strings

const { program } = require('commander')
const { readFile, readTranslation, writeFile } = require('./lib/utils')


program.version('0.0.1')

program.option('-f, --files <files...>',
  '1. Localizable.strings, 2. translation.xlsx, 3. new_Localizable.strings').parse(process.argv)

const options = program.opts()
console.log(options)

const files = options.files
if (!Array.isArray(files) || files.length !== 3) {

  console.log('Files incorrect!')
  process.exit(0)
}

const stringsFile = files[0]
const translationFile = files[1]
const newFile = files[2]

readTranslation(translationFile).then(translation => {

  return readFile(stringsFile).then(data => {

    let items = data.toString().split('\n')
    let result = ''
    items.forEach(item => {

      if (item.indexOf('" = "') !== -1 || item.indexOf('";') !== -1) {

        const start = item.indexOf('" = "')
        const end = item.lastIndexOf('";')
        if (start !== -1 && end !== -1) {
          const text = item.substring(start + 5, end)
          const translated = translation[text]
          if (typeof translated === 'string') {

            const oldText = '" = "' + text + '";'
            const newText = '" = "' + translated + '";'
            const newItem = item.replace(oldText, newText)

            result += newItem + '\n'

          } else {

            result += item + '\n'
            console.log(`Not translated: ${text}`)
          }

        } else {

          result += item + '\n'
          console.log(`No start and end index: ${item}`)
        }

      } else {

        result += item + '\n'
      }
    })

    return writeFile(newFile, result)
  })

}).catch(err => console.error(err))


