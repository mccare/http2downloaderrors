'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}

// See https://cloud.google.com/logging/docs/agent/logging/configuration#special-fields
module.exports.options = {
  onProtoPoisoning: 'remove',
  onConstructorPoisoning: 'remove',
  bodyLimit: 10485760,
  http2: true,
  return503OnClosing: false,
  http2SessionTimeout: 1,
}
