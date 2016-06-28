const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env) => (
  require('./webpack-config-base')(env)({
    entry: [
      'bootstrap-loader',
      'index.js'
    ],

    // Utilize long-term caching by adding content hashes (not compilation hashes)
    output: {
      path: path.resolve(__dirname, '../../build/app'),
      publicPath: '/',
      filename: '[name].[chunkhash:7].js',
      chunkFilename: '[name].[chunkhash:7].chunk.js',
    },

    // Use ExtractTextPlugin so we get a seperate CSS file instead
    // of the CSS being in the JS and injected as a style tag
    styleLoaders: ExtractTextPlugin.extract(
      'style-loader',
      'css-loader?module&&importLoaders=1!postcss-loader'
    ),

    plugins: [
      // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
      // inside your code for any environment checks; UglifyJS will automatically
      // drop any unreachable code
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          SERVER: false
        }
      }),

      // OccurrenceOrderPlugin is needed for long-term caching to work properly
      // See http://mxs.is/googmv
      new webpack.optimize.OccurrenceOrderPlugin(true),

      // Merge all duplicate modules
      new webpack.optimize.DedupePlugin(),

      // Minify and optimize the JavaScript
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false, // don't show warnings in the console
        },
      }),

      // Extract the CSS into a seperate file
      new ExtractTextPlugin('asserts/styles/[name].[contenthash:7].css'),

      // Minify and optimize the index.html
      new HtmlWebpackPlugin({
        template: 'index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
        inject: true
      }),
    ]
  })
)
