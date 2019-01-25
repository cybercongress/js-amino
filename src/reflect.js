let {
    Types,
    WireType,
} = require('./types')
let Factory = require('./typeFactory')

const typeOf = instance => {
    if ((typeof instance) === "undefined") {
        throw new Error("Undefined Type");
    }
    if( instance in Types ) return Types[instane]
    
    if (typeof instance == 'object') {
        if( instance.constructor.name == 'AminoType' ) return instance.typeName()
        return instance.constructor.name;

    }
 
    return typeof instance;
}

const ownKeys = instance => {    
    if( !Factory.isExisted(typeOf(instance)) ) return []//throw new TypeError("instance must be amino type") //remember to check it again
    return Reflect.ownKeys(instance).filter(key => {
        let val = instance.lookup(key)
        return val != null || val != undefined
    })
}

const typeToTyp3 = (type, opts) => {
    switch (type) {
        case Types.Interface:
            return WireType.ByteLength
        case Types.ArrayInterface:
        case Types.ByteSlice:
        case Types.ArrayStruct:   
            return WireType.ByteLength
        case Types.String:
            return WireType.ByteLength
        case Types.Struct:
        // case Types.Map:
            return WireType.ByteLength
        case Types.Int64:
            if (opts.binFixed64) {
                console.log("type 8 byte================")
                return WireType.Type8Byte
            } else {
                return WireType.Varint
            }
        case Types.Int32:
            if (opts.binFixed32) {
                return WireType.Type4Byte
            } else {
                return WireType.Varint
            }
        case Types.Time:
        case Types.Int8:
        case Types.Int16:
            return WireType.Varint 
        // case Types.Float64:
        //      return WireType.Type8Byte
        // case Types.Float32:
        //      return WireType.Type4Byte
        default:
            console.log("unsupport:",type)
            throw new Error('"unsupported field type ' + type)       
    }
}

module.exports = {
    typeOf,
    ownKeys,
    typeToTyp3,
}