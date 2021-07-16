'use strict'
const dataSize = 50 * 1024 * 1024
const data = Buffer.from(new Uint8Array(dataSize))

module.exports = async function (fastify) {
  fastify.get('/', async function (request, reply) {
    reply.code(200).send(data)
  })
}
