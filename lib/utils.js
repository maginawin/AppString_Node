'use strict'

const fs = require('fs')
const {parseString, parseStringPromise} = require('xml2js')

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

                let keyValues = new Map()
                const items = result['resources']['string']

                items.forEach(item => {
                    const key = item['$']['name']
                    const value = item['_'].trim()
                    keyValues.set(key, value)
                })
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

module.exports = {
    readFile: readFile,
    writeFile: writeFile,
    readAndroidStrings: readAndroidStrings,
    readIOSStrings: readIOSStrings
}