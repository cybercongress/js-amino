const Reflection = require("./reflect")
const Encoder = require("./encoder")
let { Types,WireType } = require('./types')

const encodeBinaryStruct = instance => {
    let result = []    
    Reflect.ownKeys(instance).forEach((key, idx) => {
        let type = instance.lookup(key) //only valid with BaseTypeAmino.todo: checking   
        let encodeData = encodeBinary(instance[key], idx, type)
        if (encodeData) {            
            result = result.concat(encodeData)
        }
    })

    return result;

}

const encodeBinary = (typeInstance, idx, type) => {
    let data = null;
    switch (type) {

        case Types.Int64:
            {
                let encodedInt = encodeFunc(typeInstance,idx,Encoder.encodeSignedVarint,WireType.Varint)
                    //encodeBinaryInt(typeInstance, idx)
                data = encodedInt
                break;
            }
        case Types.String:
            {
                let encodedString = encodeBinaryString(typeInstance, idx)
                data = encodedString
                break;
            }
            case Types.Int8: {
                let encodeData = encodeFunc(typeInstance,idx,Encoder.encodeSignedVarint,WireType.Varint)
                data = encodeData
                break;
            }
        default: {
            console.log("There is no data type to encode")
        }
    }
    return data;

}

const encodeBinaryInt = (input, idx) => {
    let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, WireType.Varint)
    let encodedVal = Encoder.encodeSignedVarint(input)
    return encodeField.concat(encodedVal)
}

const encodeBinaryString = (input, idx) => {
    let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, WireType.ByteLength)
    let encodedString = Encoder.encodeString(input)
    return encodeField.concat(encodedString);

}

const encodeFunc = (input,idx,callBack, wireType) => {
    let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, wireType)
    let encodedVal = callBack(input)
    return encodeField.concat(encodedVal)
}

module.exports = {
    encodeBinaryStruct
}