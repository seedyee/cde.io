const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = require('./webpack-config-base')({
  entry: [
    'webpack-hot-middleware/client',
    'bootstrap-loader',
    path.join(process.cwd(), 'app/app.js')
  ],

  // Don't use hashes in dev mode for better performance
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },

  cssLoaders: [
    'style-loader',
    {
      loader: 'css-loader',
      query: {
        localIdentName: '[path][name]__[local]___[hash:base64:5]',
        modules: true,
        importLoaders: 1,
        sourceMap: true,
        camelCase: true
      }
    },
    'postcss-loader'
  ],

  postcssPlugins: [
    require('postcss-import')({addDependencyTo: webpack}),
    require('postcss-url')(),
    require('postcss-cssnext')(),
    require('postcss-browser-reporter')(),
    require('postcss-reporter')()
  ],

  // Add hot reloading
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: true // Inject all files that are generated by webpack, e.g. bundle.js
    })
  ],

  babelQuery: {
    presets: ['react-hmre']
  },

  // Emit a source map for easier debugging
  devtool: 'inline-source-map'
})
