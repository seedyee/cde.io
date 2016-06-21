const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = (options) => ({
  entry: options.entry,
  output: options.output,
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
      query: JSON.parse(fs.readFileSync('./.babelrc'))
    }, {
      // Transform our own .css files with PostCSS and CSS-modules
      test: /\.css$/,
      exclude: /node_modules/,
      loaders: options.cssLoaders
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
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        {
          loader: 'url-loader',
          query: {
            limit: 10000,
            hash: 'sha512',
            degist: 'hex',
            name: '[name].[hash:7].[ext]'
          }
        },
        'image-webpack'
      ]
    }, {
      test: /\.(eot|ttf|woff|woff2)$/i,
      loader: 'file-loader',
      query: {
        hash: 'sha512',
        degist: 'hex',
        name: 'fonts/[name].[hash:7].[ext]'
      }
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  plugins: options.plugins.concat([
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
    extensions: ['', '.js', '.jsx'],
    packageMains: ['jsnext:main', 'main']
  },

  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window

  postcss: () => ([
    require('postcss-import')({addDependencyTo: webpack}),
    require('postcss-url')(),
    require('postcss-cssnext')(),
    require('postcss-browser-reporter')(),
    require('postcss-reporter')()
  ]),

  imageWebpackLoader: {
    progressive: true,
    optimizationLevel: 7,
    bypassOnDebug: false,
    pngquant:{
      quality: "65-90",
      speed: 4
    }
  }
})
