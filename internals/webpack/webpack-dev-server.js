const Koa = require('koa')
const convert = require('koa-convert')
const webpack = require('webpack')
const devMiddlewareFactory = require('koa-webpack-dev-middleware')
const hotMiddlewareFactory = require('koa-webpack-hot-middleware')

const webpackConfigFactory = require('./webpack-config-client')
const logger = require('./logger')

const host = process.env.HOST || 'localhost'
const port = parseInt(process.env.PORT) || 3000
const env = {
  prod: process.env.NODE_DEV === 'production'
}
const webpackConfig = webpackConfigFactory(env)

const serverConfig = {
  contentBase: `http://${host}:${port}`,
  quiet: false,
  noInfo: false,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {
    colors: true,
    chunks: false
  },
  historyApiFallback: true
}

const app = new Koa()
const compiler = webpack(webpackConfig)
const devMiddleware = devMiddlewareFactory(compiler, serverConfig)
const hotMiddleware = hotMiddlewareFactory(compiler)
app.use(convert(devMiddleware))
app.use(convert(hotMiddleware))

app.listen(port, (err) => {
  if (err) {
    return logger.error(err)
  }

  logger.appStarted(port)
})
