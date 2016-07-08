const path = require('path')
const uniq = require('lodash/uniq')
const pullAll = require('lodash/pullAll')
const webpack = require('webpack')

const pkg = require('../../package.json')

const dllConfig = {
  /**
   * Specify any additional dependencies here.
   */
  includeDependencies: [
  ],

  /**
   * Exclude dependencies which are not intended for the browser
   * by listing them here.
   */
  excludeDependencies: [
    'babel-runtime',
    'chalk',
    'koa',
    'koa-convert',
    'pretty-error'
  ]
}

const mergeDependencies = () => {
  const pkgDependencies = Object.keys(pkg.dependencies)

  const includeDependencies = uniq(pkgDependencies.concat(dllConfig.includeDependencies))
  const dependencies = pullAll(includeDependencies, dllConfig.excludeDependencies)
  return dependencies
}

const outputPath = path.resolve(__dirname, '../../build')

module.exports = {
  context: path.resolve(__dirname, '../..'),
  entry: {
    common: mergeDependencies()
  },
  devtool: 'eval',
  output: {
    filename: '[name].dll.js',
    path: outputPath,
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.join(outputPath, '[name].json')
    })
  ],
  debug: true
}
