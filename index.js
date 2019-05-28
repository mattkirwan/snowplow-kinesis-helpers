"use strict"

const transform = require("snowplow-analytics-sdk").transform

module.exports.snowplowTransformBase64EncodedRecord = r => {
    try {
        return Promise.resolve(transform(new Buffer.from(r, 'base64').toString()))
    } catch(e) {
        return Promise.reject(e.message)
    }
}