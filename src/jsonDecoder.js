const Reflection = require("./reflect")
let {
    Types,
} = require('./types')
let { Buffer } = require('safe-buffer')

const decodeJson = (value, instance) => {
    Reflection.ownKeys(instance).forEach((key, idx) => {    
        let type = instance.lookup(key) //only valid with BaseTypeAmino.todo: checking        
        let data = decodeJsonField(value[key], idx, type, instance[key])
        instance[key] = data
    })
}

const decodeJsonField = (value, idx, type,instance) => {
    switch (type) {
        // fall-through
        case Types.Int8:
        case Types.Int16:
        case Types.Int32:
            return parseInt(value)
        case Types.Int64:
            return parseInt(value)
        case Types.String:
            return value    
        case Types.Struct:
            {          
                return decodeJsonStruct(value, instance)
            }
        case Types.ByteSlice:
            {
                return decodeJsonSlice(value)
            }
        case Types.ArrayInterface:
            {
                return decodeJsonArray(value, instance, Types.ArrayInterface)
            }
        case Types.ArrayStruct:
            {
                return decodeJsonArray(value, instance, Types.ArrayStruct)
            }
        case Types.Interface:
            {
                return decodeJsonInterface(value, instance)
            }
        default:
            {
                throw new Error("There is no data type to decode:", type)
            }
    }
}

const decodeJsonStruct = (value, instance) => {
    Reflection.ownKeys(instance).forEach((key, idx) => {    
        let type = instance.lookup(key) //only valid with BaseTypeAmino.todo: checking          
        let data = decodeJsonField(value, idx, type, instance[key])
        instance[key] = data
    })
    return instance
}

const decodeJsonSlice = (value) => {
    return Array.from(Buffer.from(value, 'base64'))
}

const decodeJsonInterface = (value, instance) => {
    let typeName = Reflection.typeOf(instance);
    if (!this.lookup(typeName)) {
        throw new Error(`No ${typeName} was registered`)
    }
    let typeInfo = this.lookup(Reflection.typeOf(instance))
    if (typeInfo && typeInfo.name) {
        if (value.type !== typeInfo.name) {
            throw new Error(`Type not match. expected: ${typeInfo.name}, but: ${value.type}`)
        }
    }

    return decodeJson(value.value, instance.type) //dirty-hack
}

const decodeJsonArray = (value, instance, arrayType) => {
    let result = []
    let withPrefix = arrayType === Types.ArrayInterface ? true : false

    for (let i = 0; i < value.length; i++) {
        let type = Types.Struct
        if (withPrefix) {
            type = Types.Interface
        }
        let data = decodeJson(value[i], type)        
        if (data) {       
            result = result.concat(data)
        }
    }

    return result;
}

module.exports = {
    decodeJson
}
