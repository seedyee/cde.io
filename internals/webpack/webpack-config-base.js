const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = (env) => (options) => ({
  context: path.resolve(__dirname, '../../app'),
  entry: options.entry,
  output: options.output,
  cache: !env.prod,
  debug: !env.prod,
  devtool: options.devtool,
  target: options.target,
  externals: options.externals,
  plugins: options.plugins,

  resolve: {
    // A list of directories to resolve modules from
    modules: ['app', 'node_modules'],
    // A list of extensions which should be tried for files
    extensions: ['', '.js']
  },

  module: {
    loaders: [{
      test: /bootstrap-sass\/assets\/javascripts\//,
      loader: 'imports-loader',
      query: {
        jQuery: 'jquery'
      }
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',

      query: {
        // https://github.com/babel/babel-loader#options
        cacheDirectory: !env.prod,
        // https://babeljs.io/docs/usage/options/
        babelrc: false,

        presets: [
          'es2015-webpack',
          'react',
          'stage-0'
        ].concat(env.prod ? [] : ['react-hmre']),

        plugins: ['transform-runtime'].concat(env.prod ? [
            'transform-react-remove-prop-types',
            'transform-react-constant-elements',
            'transform-react-inline-elements'
        ] : [])
      }
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      loaders: options.styleLoaders
    }, {
      // Do not transform vendor's CSS with CSS-modules
      // The point is that they remain in global scope.
      // Since we require these CSS files in our JS or CSS files,
      // they will be a part of our compilation either way.
      // So, no need for ExtractTextPlugin here.
      test: /\.css$/,
      include: /node_modules/,
      loaders: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.(jpe?g|png|gif)$/i,
      loaders: [
        {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'asserts/images/' + (env.prod ? '[name].[hash:7].[ext]' : '[name].[ext]')
          }
        },
        'image-webpack'
      ]
    }, {
      test: /\.(eot|ttf|woff|woff2|svg)$/i,
      loader: 'file-loader',
      query: {
        name: 'asserts/fonts/' + (env.prod ? '[name].[hash:7].[ext]' : '[name].[ext]')
      }
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },

  postcss: (bundler) => ([
    // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
    // https://github.com/postcss/postcss-import
    require('postcss-import')({addDependencyTo: bundler}),
    require('postcss-url')(),
    require('postcss-cssnext')({
      browsers: [
        'Android 2.3',
        'Android >= 4',
        'Chrome >= 35',
        'Firefox >= 31',
        'Explorer >= 9',
        'iOS >= 7',
        'Opera >= 12',
        'Safari >= 7.1'
      ]
    }),
    require('postcss-browser-reporter')(),
    require('postcss-reporter')({
      clearMessages: true
    })
  ]),

  imageWebpackLoader: {
    progressive: true,
    optimizationLevel: 7,
    bypassOnDebug: false,
    pngquant: {
      quality: '65-90',
      speed: 4
    }
  }
})
