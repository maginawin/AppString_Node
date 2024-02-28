'use strict'

// node set_android.js -f strings.xml values.txt new_strings.xml
// Example:
// node set_android.js -f ./assert/strings.xml ./assert/translation.xlsx ~/Downloads/new_strings.xml

// HomeeLife
// node set_android.js -f ./assert/homeelife/strings_en_230511.xml ./assert/homeelife/230511.xlsx ./assert/homeelife/strings_cn_230511.xml
// node set_android.js -f ./assert/homeelife/strings_en_240127.xml ./assert/homeelife/en_fr_240127.xlsx ./assert/homeelife/strings_fr_240127.xml

// nfc
// node set_android -f ./assert/nfc/strings_en_230616.xml ./assert/nfc/230616.xlsx ./assert/nfc/strings_cn_230616.xml

// easythings
// node set_android -f ./assert/easythings/strings_en_1206.xml ./assert/easythings/de_1206.xlsx ./assert/easythings/strings_de_231206.xml

const { program } = require('commander')
const { readFile, readTranslation, writeFile } = require('./lib/utils')

program.version('0.0.1')

program.option('-f, --files <files...>',
  '1. strings.xml, 2. translation.xlsx, 3. new_strings.xml').parse(process.argv)

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

      if (item.indexOf('</string>') !== -1 || item.indexOf('</item>') !== -1) {

        const start = item.indexOf('>')
        const end = item.lastIndexOf('<')
        if (start !== -1 && end !== -1) {
          const text = item.substring(start + 1, end)
          const translated = translation[text]
          if (typeof translated === 'string') {

            const oldText = '>' + text + '<'
            const newText = '>' + translated + '<'
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


