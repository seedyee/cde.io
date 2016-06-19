const path = require('path')
const express = require('express')
const webpack = require('webpack')

const logger = require('./logger')
const webpackConfig = require('./webpack-config-dev')

const app = express()
const compiler = webpack(webpackConfig)
const middleware = require('webpack-dev-middleware')(compiler, {
  stats: {
    chunks: false
  },
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'}
})
app.use(middleware)
app.use(require('webpack-hot-middleware')(compiler))

// Since webpack-dev-middleware uses memory-fs internally to store built
// artifacts, we use it to serve the `index.html` file
const fs = middleware.fileSystem

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
