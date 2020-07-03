const comoEstasEnvType = process.env.CE_ENV
const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'

module.exports = require(`./${comoEstasEnvType}/${env}`)