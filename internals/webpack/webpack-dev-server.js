const path = require('path')
const express = require('express')
const webpack = require('webpack')

const logger = require('./logger')

const webpackConfig = require('./webpack-config-client')({
  prod: process.env.NODE_ENV === 'production'
})

const compiler = webpack(webpackConfig)
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  stats: {
    colors: true,
    chunks: false
  },
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'}
})

const app = express()
app.use(devMiddleware)
app.use(require('webpack-hot-middleware')(compiler))

// Since webpack-dev-middleware uses memory-fs internally to store built
// artifacts, we use it to serve the `index.html` file
const fs = devMiddleware.fileSystem

app.get('*', (req, res) => {
  const file = fs.readFileSync(path.join(compiler.outputPath, 'index.html'))
  res.send(file.toString())
})

const port = process.env.PORT || 3000

app.listen(port, (err) => {
  if (err) {
    return logger.error(err)
  }

  logger.appStarted(port)
})
