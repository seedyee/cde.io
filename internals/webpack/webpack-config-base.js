const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/'
  }, options.output),
  module: {
    loaders: [{
      test: /bootstrap-sass\/assets\/javascripts\//,
      loader: 'imports-loader',
      query: {
        jQuery: 'jquery'
      }
    }, {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: JSON.parse(fs.readFileSync('./.babelrc'))
    }, {
      test: /\.jpe?g$|\.gif$|\.png$|\.svg$/i,
      loader: 'url-loader',
      query: {
        limit: 10000
      }
    }, {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      query: {
        name: 'fonts/[name].[hash].[ext]',
        mimetype: 'application/font-woff'
      }
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      query: {
        name: 'fonts/[name].[hash].[ext]',
        mimetype: 'application/font-woff'
      }
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      query: {
        name: 'fonts/[name].[hash].[ext]',
        mimetype: 'application/octet-stream'
      }
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      query: {
        name: 'fonts/[name].[hash].[ext]'
      }
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  plugins: options.plugins.concat([
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]),
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: ['', '.js', 'jsx'],
    packageMains: ['jsnext:main', 'main']
  },
  devtool: options.devtool,
  target: 'web',
  stats: false, // Don't show stats in the console
  process: true
})
