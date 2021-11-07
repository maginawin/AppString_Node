'use strict'

// node get_values.js -f strings.xml localizable.strings values.txt
//
// For example:
// node get_values.js -f ./assert/strings.xml ./assert/localizable.strings ~/Downloads/app_strings.txt

const {program} = require('commander')
const {readFile, writeFile} = require('./lib/utils')
const {parseString} = require('xml2js')

program.version('0.0.1')

program
    .option('-f, --files <files...>', '1. strings.xml, 2. localizable.strings, 3. values.txt')

program.parse(process.argv)

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

// Read Android
readFile(androidFile)
    .then(data => {

        return parseString(data, (err, result) => {
            if (err) return

            const items = result['resources']['string']

            return items.forEach(item => {
                const key = item['$']['name']
                const value = item['_'].trim()
                console.log(`key & value`, key, value)
                valueSet.add(value)
            })
        })
    })
    .then(() => {

        // Read iOS
        return readFile(iosFile).then(data => {

            const items = data.split(/\n/g)
            return items.forEach(item => {
                if (item.length < 5) return
                const keyValue = item.split(/=/g)
                if (keyValue.length !== 2) return
                const key = keyValue[0].trim().replace(/"/g, '')
                const value = keyValue[1].trim().replace(/;/g, '').replace(/"/g, '')
                console.log(`keyValue `, key, value)
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