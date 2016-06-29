const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = (env) => (
  require('./webpack-config-base')(env)({
    entry: './server.js',
    target: 'node',
    output: {
      path: path.resolve(__dirname, '../../build/server'),
      filename: 'index.js',
      libraryTarget: 'commonjs'
    },
    externals: [nodeExternals()],
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          SERVER: true
        }
      }),
      new webpack.BannerPlugin({
        banner: 'require(\'source-map-support\').install();',
        raw: true,
        entryOnly: false
      })
    ],
    devtool: 'source-map',
  })
)
