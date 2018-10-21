'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    
    // Amazon S3 Upload File
    AMAZON_S3_ACCESS_KEY_ID: '""',
    AMAZON_S3_SECRET_ACCESSS_KEY:  '""',
    AMAZON_S3_BUCKET: '""',
    AMAZON_S3_REGION: '"eu-west-3"',
    AMAZON_S3_URL: '"https://s3.eu-west-3.amazonaws.com/"'
})
