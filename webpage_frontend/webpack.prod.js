const path = require('path');
const webpack = require('webpack');

module.exports = require('./webpack.common.js');

// Exports modification
module.exports.output = {
    filename: "[name].js",
    path: path.resolve(__dirname, "./static/frontend")
}
module.exports.plugins = [
    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production"),
        }
    })
]