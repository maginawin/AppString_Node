'use strict'

const fs = require('fs')

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

module.exports = {
    readFile: readFile,
    writeFile: writeFile
}