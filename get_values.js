'use strict'

// node get_values.js -f strings.xml localizable.strings values.txt
//
// For example:
// node get_values.js -f ./assert/strings.xml ./assert/localizable.strings ~/Downloads/values.txt

// EasyThings
// node get_values.js -f ./assert/easythings_strings.xml ./assert/easythings_Localizable.strings ./assert/easythings_values.txt

// SR NFC Tool
// node get_values.js -f ./assert/srnfctool_strings.xml ./assert/srnfctool_Localizable.strings ./assert/srnfctool_values.txt

// HomeeLife
// node get_values.js -f ./assert/homeelife/strings_en_230511.xml ./assert/homeelife/Localizable_en_230511.strings ./assert/homeelife/values_230511.txt
// node get_values.js -f ./assert/homeelife/strings_en_230911.xml ./assert/homeelife/Localizable_en_230911.strings ./assert/homeelife/values_230911.txt
// node get_values.js -f ./assert/homeelife/strings_en_240127.xml ./assert/homeelife/Localizable_en_240127.strings ./assert/homeelife/values_240127.txt

// nfc
// node get_values.js -f ./assert/nfc/strings_en_230616.xml ./assert/Localizable_empty.strings ./assert/nfc/values_230616.txt
// node get_values.js -f ./assert/nfc/strings_en_230719.xml ./assert/nfc/strings_en_230719.strings ./assert/nfc/values_230719.txt
// node get_values.js -f ./assert/nfc/strings_en_extra.xml ./assert/nfc/Localizable_en_extra.strings ./assert/nfc/values_extra.txt
// node get_values.js -f ./assert/nfc/strings_en_230803.xml ./assert/nfc/Localizable_en_230803.strings ./assert/nfc/values_230803.txt

// Azoula Smart
// node get_values.js -f ./assert/azoulasmart/strings_en_230712.xml ./assert/Localizable_empty.strings ./assert/azoulasmart/values_230712.txt
// node get_values.js -f ./assert/azoulasmart/strings_en_241214.xml ./assert/azoulasmart/Localizable_en_241214.strings ./assert/azoulasmart/values_241214.txt

// EasyTings
// node get_values.js -f ./assert/easythings/empty.xml ./assert/easythings/231128.strings ./assert/easythings/values_231128.txt

const { program } = require('commander')
const { writeFile, readAndroidStrings, readIOSStrings } = require('./lib/utils')

program.version('0.0.1')

program.option('-f, --files <files...>',
  '1. strings.xml, 2. localizable.strings, 3. values.txt').parse(process.argv)

const options = program.opts()
console.log(options)

const files = options.files
if (!Array.isArray(files) || files.length !== 3) {

  console.log('Files incorrect!')
  process.exit(0)
}

const androidFile = files[0]
const iosFile = files[1]
const outFile = files[2]

let valueSet = new Set()

// Read Android then read iOS.
readAndroidStrings(androidFile).then(data => {

  data.forEach((value, key) => {
    console.log(`Android KV`, key, value)
    valueSet.add(value)
  })
}).then(() => {

  return readIOSStrings(iosFile).then(data => {
    data.forEach((value, key) => {
      console.log(`iOS KV`, key, value)
      valueSet.add(value)
    })
  })
}).then(() => {

  // Get valueSet, convert to outFile.
  console.log(`contains `, valueSet)
  // let data = "#!!! Please keep the '\\n', it's a placeholder.\n\n"
  let data = '\n'
  valueSet.forEach(value => {
    data += value + '\n'
  })
  return writeFile(outFile, data)
}).then(() => {

  // Convert successful
  console.log('Successful, please check the outFile at: ', outFile)
}).catch(err => console.error(err))
