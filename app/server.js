import Koa from 'koa'

//import a from './app'

const app = new Koa()

foo()

app.use(ctx => {
  ctx.body = 'Hello World'
})

app.listen(3000)
