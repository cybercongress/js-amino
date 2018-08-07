let { Types } = require('./types')

const typeOf = instance => {
    if ((typeof instance) === "undefined") {
        throw new Error("Undefined Type");
    }
    if( instance in Types ) return Types[instane]
    
    if (typeof instance == 'object') {
        if( instance.constructor.name == 'AminoType' ) return instance.typeName()
        return instance.constructor.name;

    }
    if (typeof instance == 'number') {
        if (Number.isInteger(instance)) return 'int'
    }
    return typeof instance;
}

module.exports = {
    typeOf
}