'use strict'

const fs = require('fs')
const {parseString, parseStringPromise} = require('xml2js')
const nodeXlsx = require('node-xlsx')

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

function writeFile(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, {
            flag: 'w',
            encoding: 'utf8',
            mode: 0o666
        }, err => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

function readAndroidStrings(path) {

    return readFile(path)
        .then(data => {

            return parseStringPromise(data).then(result => {

                // return result

                let keyValues = new Map()
                const items = result['resources']['string']

                items.forEach(item => {
                    const key = item['$']['name']
                    const value = item['_'].trim()
                    keyValues.set(key, value)
                })

                const arrayItems = result['resources']['string-array']
                if (arrayItems != null && arrayItems instanceof Array) {

                    for (let i = 0; i < arrayItems.length; i++) {

                        const arrayItem = arrayItems[i]
                        const key = arrayItem['$']['name']

                        const subItems = arrayItem['item']
                        for (let j = 0; j < subItems.length; j++) {
                            const subKey = key + `_${j}`
                            const value = subItems[j]
                            keyValues.set(subKey, value)
                        }
                    }
                }

                return keyValues
            })
        })
        .catch(err => console.error(err))
}

function readIOSStrings(path) {

    return readFile(path)
        .then(data => {

            let keyValues = new Map()

            const items = data.split(/\n/g)
            items.forEach(item => {

                if (item.length < 5) return
                const keyValue = item.split(/=/g)
                if (keyValue.length !== 2) return
                const key = keyValue[0].trim().replace(/"/g, '')
                const value = keyValue[1].trim().replace(/;/g, '').replace(/"/g, '')
                keyValues.set(key, value)
            })
            return keyValues
        })
        .catch(err => console.error(err))
}

function readTranslation(path) {

    const sheets = nodeXlsx.parse(path)

    let result = {}

    sheets.forEach(sheet => {
        const rows = sheet.data
        for (let i = 0; i < rows.length; i++) {
            const first = rows[i][0]
            const second = rows[i][1]
            if (typeof first === 'string' && typeof second === 'string') {
                result[first] = second
            }
        }
    })

    return new Promise((resolve, reject) => {
        resolve(result)
    })
}

module.exports = {
    readFile: readFile,
    writeFile: writeFile,
    readAndroidStrings: readAndroidStrings,
    readIOSStrings: readIOSStrings,
    readTranslation: readTranslation
}

// readAndroidStrings('./assert/easythings_strings.xml').then(result => {
//     console.log(result)
// }).catch(err => console.error(err))

// readTranslation('./assert/test_translation.xlsx').then(data => {
//     console.log(`data `, data)
// }).catch(err => console.error(err))
