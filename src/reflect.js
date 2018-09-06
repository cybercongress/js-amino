let { Types } = require('./types')
let Factory = require('./typeFactory')



module.exports = {
    typeOf: Factory.Reflection.typeOf,
    ownKeys: Factory.Reflection.ownKeys,
}
