const Reflection = require("./reflect")
const Encoder = require("./encoder")
let {
    Types,
    WireType,
    WireMap
} = require('./types')

const encodeBinary = (instance, isBare = true) => {
    let result = []
    Reflection.ownKeys(instance).forEach((key, idx) => {
        let type = instance.lookup(key) //only valid with BaseTypeAmino.todo: checking   
        let encodeData = encodeBinaryField(instance[key], idx, type)
        if (encodeData) {
            result = result.concat(encodeData)
        }
    })
    if (!isBare) {
        result = [result.length].concat(result)
    }

    return result;

}

const encodeBinaryField = (typeInstance, idx, type) => {
    let data = null;
    switch (type) {

        case Types.Int64:
            {
                let encodedInt = encodeFunc(typeInstance, idx, Encoder.encodeSignedVarint, WireMap[Types.Int64])
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
                let encodeData = encodeFunc(typeInstance, idx, Encoder.encodeSignedVarint, WireMap[Types.Int8] )
                data = encodeData
                break;
            }
        case Types.Struct:
            {
                let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, WireMap[Types.Struct])                
                let encodedData = encodeBinary(typeInstance, false)
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

const encodeFunc = (input, idx, callBack, wireType) => {
    let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, wireType)
    let encodedVal = callBack(input)
    return encodeField.concat(encodedVal)
}

module.exports = {
    encodeBinary
}