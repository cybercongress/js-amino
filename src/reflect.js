let { Types } = require('./types')
let Factory = require('./typeFactory')



module.exports = {
    typeOf: Factory.Reflect.typeOf,
    ownKeys: Factory.Reflect.ownKeys,
}
