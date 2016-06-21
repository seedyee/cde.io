const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = require('./webpack-config-base')({
  entry: [
    'bootstrap-loader',
    path.join(__dirname, '..', '..', 'app/index.js')
  ],

  // Utilize long-term caching by adding content hashes (not compilation hashes)
  output: {
    path: path.join(__dirname, '..', '..', 'build', 'app'),
    publicPath: '/',
    filename: '[name].[chunkhash:7].js',
    chunkFilename: '[name].[chunkhash:7].chunk.js',
  },

  // Use ExtractTextPlugin so we get a seperate CSS file instead
  // of the CSS being in the JS and injected as a style tag
  cssLoaders: ExtractTextPlugin.extract(
    'style-loader',
    'css-loader?module&&importLoaders=1|postcss-loader'
  ),

  postcssPlugins: [
    require('postcss-import')({addDependencyTo: webpack}),
    require('postcss-url')(),
    require('postcss-cssnext')(),
    require('postcss-browser-reporter')(),
    require('postcss-reporter')()
  ],

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      children: true,
      minChunks: 2,
      async: true,
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

    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'app/index.html',
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

    // Extract the CSS into a seperate file
    new ExtractTextPlugin('[name].[contenthash:7].css')
  ]
})
