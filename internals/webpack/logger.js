/* eslint-disable no-console,prefer-template */

const pretty = require('pretty-error').start()
const chalk = require('chalk')
const ip = require('ip')

const divider = chalk.gray('\n-----------------------------------')

const logger = {
  error: (err) => {
    console.log(pretty.render(err))
  },

  appStarted: (port) => {
    console.log('Webpack dev server started ' + chalk.green('✓'))

    console.log(
      chalk.bold('\nAccess URLs:') +
      divider +
      '\nLocalhost: ' + chalk.magenta('http://localhost:' + port) +
      '\n      LAN: ' + chalk.magenta('http://' + ip.address() + ':' + port) +
      divider,
      chalk.blue('\nPress ' + chalk.italic('CTRL-C') + ' to stop\n')
    )
  },
}

module.exports = logger
