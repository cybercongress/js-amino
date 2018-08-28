const Reflection = require("./reflect")
const Encoder = require("./encoder")
let {
    Types,
    WireType,
    WireMap
} = require('./types')

const encodeBinary = (instance, typeInfo, isBare = true) => {
    let result = []
    Reflection.ownKeys(instance).forEach((key, idx) => {
        let type = instance.lookup(key) //only valid with BaseTypeAmino.todo: checking   
        let encodeData = encodeBinaryField(instance[key], idx, type, typeInfo)
        if (encodeData) {
            result = result.concat(encodeData)
        }
    })
    if (!isBare) {
        // result = [result.length].concat(result)
    }

    if (instance.info) {
        if (instance.info.registered) {            
            instance.info.prefix[3] |= WireMap[Types.Struct] //new code  
            
            result = instance.info.prefix.concat(result)
        }
    }


    result = result.concat(4) //append 4 as denoted for struct

    return result;

}

const encodeBinaryField = (typeInstance, idx, type, typeInfo) => {
    let data = null;
    switch (type) {

        case Types.Int64:
            {
                let encodedInt = encodeFunc(typeInstance, idx, Encoder.encodeInt64, WireMap[Types.Int64], typeInfo)
                data = encodedInt
                break;
            }
        case Types.String:
            {
                let encodedString = encodeBinaryString(typeInstance, idx)
                data = encodedString
                break;
            }
        case Types.Int8:
            {
                let encodeData = encodeFunc(typeInstance, idx, Encoder.encodeSignedVarint, WireMap[Types.Int8], typeInfo)
                data = encodeData
                break;
            }
        case Types.Struct:
            {
                let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, WireMap[Types.Struct])
                let encodedData = encodeBinary(typeInstance, typeInfo, false)
                data = encodeField.concat(encodedData);
                break;
            }
        default:
            {
                console.log("There is no data type to encode")
                break;
            }
    }
    return data;

}

const encodeBinaryString = (input, idx) => {
    let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, WireMap[Types.String])
    let encodedString = Encoder.encodeString(input)
    return encodeField.concat(encodedString);

}

const encodeFunc = (input, idx, callBack, wireType, typeInfo) => {
    let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, wireType)
    // typeInfo.prefix[3] |= wireType //new code    
    // encodeField = typeInfo.prefix.concat(encodeField)

    let encodedVal = callBack(input)
    return encodeField.concat(encodedVal)
}

module.exports = {
    encodeBinary
}