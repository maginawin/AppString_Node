'use strict'

// node set_android.js -f strings.xml values.txt new_strings.xml
// Example:
// node set_android.js -f ./assert/strings.xml ./assert/values.txt ~/Downloads/new_strings.xml

const {program} = require('commander')
const {readFile, readAndroidStrings} = require('./lib/utils')

program.version('0.0.1')

program
    .option('-f, --files <files...>', '1. strings.xml, 2. values.txt, 3. new_strings.xml')
    .parse(process.argv)

const options = program.opts()
console.log(options)

const files = options.files
if (!Array.isArray(files) || files.length !== 3) {

    console.log('Files incorrect!')
    process.exit(0)
}

const stringsFile = files[0]
const valuesFile = files[1]
const newFile = files[2]

readAndroidStrings(stringsFile)
    .then(data => {
        console.log(`data `, data)


    })
    .catch(err => console.error(err))