const Reflection = require("./reflect")
let {
    Types,
} = require('./types')
let { Buffer } = require('safe-buffer')

const encodeJson = (instance, type) => {

    let tmpInstance = instance;

    //retrieve the single property of the Registered AminoType
    if (type != Types.Struct && type != Types.Interface && type != Types.Array) { //only get the first property with type != Struct        
        let keys = Reflection.ownKeys(instance);
        if (keys.length > 0) { //type of AminoType class with single property
            keys.forEach(key => {
                let aminoType = instance.lookup(key)
                if (type != aminoType) throw new TypeError("Amino type does not match")
                tmpInstance = instance[key]
                return;
            })
        }
    }

    switch (type) {
        // fall-through
        case Types.Int8:
        case Types.Int16:
        case Types.Int32:
            {
                return tmpInstance
            }
        case Types.Int64:
            {
                // https://github.com/tendermint/go-amino/blob/v0.14.1/json-encode.go#L99
                // TODO: In go-amino, (u)int64 is encoded by string, because some languages like JS can't handle (u)int64
                // So, It seemed that it is necessary to decode (u)int64 to library like bignumber.js?
                return tmpInstance.toString()
            }
        case Types.String:
            {
                return tmpInstance.toString()
            }

        case Types.Struct:
            {
                return encodeJsonStruct(tmpInstance)
            }
        case Types.ByteSlice:
            {
                return encodeJsonSlice(tmpInstance)
            }

        case Types.ArrayStruct:
            {
                return encodeJsonArray(tmpInstance, Types.ArrayStruct)
            }
        case Types.ArrayInterface:
            {
                return encodeJsonArray(tmpInstance, Types.ArrayInterface)
            }
        case Types.Interface:
            {
                return encodeJsonInterface(tmpInstance)
            }
        default:
            {
                console.log("There is no data type to encode:", type)
                break;
            }
    }
}

const encodeJsonInterface = (instance) => {
    let value = encodeJson(instance, instance.type) //dirty-hack
    let type = instance.info.name
    return {type:type, value: value}

}


const encodeJsonStruct = (instance) => {
    let result = {}
    Reflection.ownKeys(instance).forEach((key) => {
        let type = instance.lookup(key) //only valid with BaseTypeAmino.todo: checking 
        let value = encodeJsonField(instance[key], type)
        result[key] = value
    })

    return result;

}



const encodeJsonField = (typeInstance, type) => {    
    let value = null
    if (type == Types.Array) {        
        value = encodeJsonArray(typeInstance)
    } else {
        value = encodeJson(typeInstance, type)
    }

    return value
}

const encodeJsonArray = (instance, arrayType) => {
    let result = []
    let withPrefix = arrayType === Types.ArrayInterface ? true : false

    for (let i = 0; i < instance.length; ++i) {
        let item = instance[i]      
        
        let type = item.type
        if (withPrefix) {
            type = Types.Interface
        }
        let data = encodeJson(item, type)        
        if (data) {       
            result = result.concat(data)
        }
    }

    return result;
}

const encodeJsonSlice = (tmpInstance) => {
    // In go-amino, bytes are encoded by base64 when json-encoding
    return Buffer.from(tmpInstance).toString('base64')
}

module.exports = {
    encodeJson
}
