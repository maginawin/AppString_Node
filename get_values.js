'use strict'

// node get_values.js -f strings.xml localizable.strings values.txt
//
// For example:
// node get_values.js -f ./assert/strings.xml ./assert/localizable.strings ~/Downloads/values.txt

const {program} = require('commander')
const {writeFile, readAndroidStrings, readIOSStrings} = require('./lib/utils')

program.version('0.0.1')

program
    .option('-f, --files <files...>', '1. strings.xml, 2. localizable.strings, 3. values.txt')
    .parse(process.argv)

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
readAndroidStrings(androidFile)
    .then(data => {

        data.forEach((value, key) => {
            console.log(`Android KV`, key, value)
            valueSet.add(value)
        })
    })
    .then(() => {

        return readIOSStrings(iosFile).then(data => {
            data.forEach((value, key) => {
                console.log(`iOS KV`, key, value)
                valueSet.add(value)
            })
        })
    })
    .then(() => {

        // Get valueSet, convert to outFile.
        console.log(`contains `, valueSet)
        let data = "#!!! Please keep the '\\n', it's a placeholder.\n\n"
        valueSet.forEach(value => {
            data += value + '\n\n'
        })
        return writeFile(outFile, data)
    })
    .then(() => {

        // Convert successful
        console.log('Successful, please check the outFile at: ', outFile)
    })
    .catch(err => console.error(err))