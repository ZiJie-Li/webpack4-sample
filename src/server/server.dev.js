"use strict";

import path from 'path'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'
import express from 'express'
import apiRouter from './routers/api'

const app = express()
const DIST_DIR = __dirname
const HTML_FILE = path.join(DIST_DIR, 'index.html')
const compiler = webpack(config)
const port = process.env.PORT || 8080;

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.use('/api', apiRouter)

app.get('*', ({res, next}) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
    if (err) {
      res.status(404).json({ message: "Page Not Found !" });
      // return next(err)
    }
    else {
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    }
  })
})

/*app.use(({err, res}) => {
  if (err.code == "ENOENT") {
    res.status(404).json({ message: "Page Not Found !" });
  }
});*/

app.listen(port);
console.log(`App Runs on http://localhost:${port}`);
