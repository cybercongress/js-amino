const Reflection = require("./reflect")
const Encoder = require("./encoder")
let {
    Types,
    WireType,
    WireMap
} = require('./types')

const encodeBinary = (instance, type, isBare = true) => {

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

    let data = null;
    switch (type) {

        case Types.Int8:
            {
                data = Encoder.encodeSignedVarint(tmpInstance)
                break;
            }

        case Types.Int32:
            {
                data = Encoder.encodeInt32(tmpInstance)
                break;
            }

        case Types.Int64:
            {
                data = Encoder.encodeInt64(tmpInstance)
                break;
            }
        case Types.Boolean:
            {
                data = Encoder.encodeBoolean(tmpInstance)
                break;
            }
        case Types.String:
            {
                let encodedString = Encoder.encodeString(tmpInstance)
                data = encodedString
                break;
            }

        case Types.Struct:
            {
                data = encodeBinaryStruct(tmpInstance, isBare)
                break;
            }
        case Types.ByteSlice:
            {
                data = Encoder.encodeSlice(tmpInstance)
                break;
            }

        case Types.Array:
            {
                data = encodeBinaryArray(tmpInstance, isBare)
                break;
            }
        case Types.Interface:
            {
                let data = encodeBinaryInterface(tmpInstance, isBare)
                return data; //dirty hack
            }
        default:
            {
                console.log("There is no data type to encode:", type)
                break;
            }
    }

    return data;

}

const encodeBinaryInterface = (instance, isBare) => {
    let data = encodeBinary(instance, instance.type, true) //dirty-hack
    data = instance.info.prefix.concat(data)
    if (!isBare) {
        data = Encoder.encodeUVarint(data.length).concat(data)
    }
    return data;

}


const encodeBinaryStruct = (instance, isBare = true) => {
    let result = []
    Reflection.ownKeys(instance).forEach((key, idx) => {
        let type = instance.lookup(key) //only valid with BaseTypeAmino.todo: checking 
        let encodeData = null;       
        encodeData = encodeBinaryField(instance[key], idx, type, isBare)
        if (encodeData) {
            result = result.concat(encodeData)
        }
    })
    if (!isBare) {
        result = Encoder.encodeUVarint(result.length).concat(result)
    }   

    return result;

}



const encodeBinaryField = (typeInstance, idx, type, isBare) => {    
    let encodeData = null
    if (type == Types.Array) {        
        encodeData = encodeBinaryArray(typeInstance, true, idx)
    } else {
        encodeData = encodeBinary(typeInstance, type, false)
        let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, WireMap[type])
        encodeData = encodeField.concat(encodeData)
    }

    return encodeData
}

const encodeBinaryArray = (instance, isBare = true, idx = 0) => {
    let result = []

    for (let i = 0; i < instance.length; ++i) {
        let item = instance[i]      
        
        let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, WireMap[Types.Array])
        let data = encodeBinary(item, item.type, false)        
        if (data) {
            data = encodeField.concat(data)            
            result = result.concat(data)
        }
    }
    if (!isBare) {
        result = Encoder.encodeUVarint(result.length).concat(result)
    }

    return result;
}



module.exports = {
    encodeBinary
}