const Reflection = require("./reflect")
const Encoder = require("./encoder")
let {
    Types,
} = require('./types')

const encodeBinary = (instance, type, opts, isBare = true) => {

    let tmpInstance = instance;

    //retrieve the single property of the Registered AminoType
    if (type != Types.Struct && type != Types.Interface && type != Types.ArrayStruct && type != Types.Interface) { //only get the first property with type != Struct        
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

        case Types.Int16:
            {
                data = Encoder.encodeSignedVarint(tmpInstance)
                break;
            }

        case Types.Int32:
            {
                if (opts.binFixed32) {
                    data = Encoder.encodeInt32(tmpInstance)
                } else {
                    data = Encoder.encodeUVarint(tmpInstance)
                }

                break;
            }

        case Types.Int64:
            {
                if (opts.binFixed64) {
                    data = Encoder.encodeInt64(tmpInstance)
                } else {
                    data = Encoder.encodeUVarint(tmpInstance)
                }
                break;
            }
       /* case Types.Time:
            {
                data = encodeTime(tmpInstance, isBare) //Encoder.encodeTime(tmpInstance)
                break;
            }*/
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
                data = encodeBinaryStruct(tmpInstance, opts, isBare)
                break;
            }
        case Types.ByteSlice:
            {
                data = Encoder.encodeSlice(tmpInstance)
                break;
            }

        case Types.ArrayStruct:
            {
                data = encodeBinaryArray(tmpInstance, Types.ArrayStruct, opts, isBare)
                break;
            }

        case Types.ArrayInterface:
            {
                data = encodeBinaryArray(tmpInstance, Types.ArrayInterface, opts, isBare)
                break;
            }

        case Types.Interface:
            {
                let data = encodeBinaryInterface(tmpInstance, opts, isBare)
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

const encodeBinaryInterface = (instance, opts, isBare) => {
    let data = encodeBinary(instance, instance.type, opts, true) //dirty-hack
    data = instance.info.prefix.concat(data)
    if (!isBare) {
        data = Encoder.encodeUVarint(data.length).concat(data)
    }
    return data;

}


const encodeBinaryStruct = (instance, opts, isBare = true) => {
    let result = []
    Reflection.ownKeys(instance).forEach((key, idx) => {
        let type = instance.lookup(key) //only valid with BaseTypeAmino.todo: checking 
        let encodeData = null;
        encodeData = encodeBinaryField(instance[key], idx, type, opts)
        if (encodeData) {
            result = result.concat(encodeData)
        }

    })
    if (!isBare) {
        result = Encoder.encodeUVarint(result.length).concat(result)
    }

    return result;

}



const encodeBinaryField = (typeInstance, idx, type, opts) => {
    let encodeData = null
    if (type == Types.ArrayStruct || type == Types.ArrayInterface) {
        encodeData = encodeBinaryArray(typeInstance, type, opts, true, idx)
    } else if (type == Types.Time) {
        encodeData = encodeTime(typeInstance, idx,false)
    } else {
        encodeData = encodeBinary(typeInstance, type, opts, false)        
        let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, Reflection.typeToTyp3(type, opts))
        encodeData = encodeField.concat(encodeData)
    }

    return encodeData
}

const encodeBinaryArray = (instance, arrayType, opts, isBare = true, idx = 0) => {
    let result = []

    for (let i = 0; i < instance.length; ++i) {
        let item = instance[i]

        let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, Reflection.typeToTyp3(Types.ArrayStruct, opts))
        let itemType = arrayType == Types.ArrayInterface ? Types.Interface : Types.Struct
        let data = encodeBinary(item, itemType, opts, false)
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

const encodeTime = (time, idx, isBare) => {
    let result = []
    let encodeData = null;
    encodeData = Encoder.encodeTime(time);
    result = result.concat(encodeData);

    if (!isBare) {
        result = Encoder.encodeUVarint(result.length).concat(result)
    }
    let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, Reflection.typeToTyp3(Types.Struct/*, opts*/)) //notice: use Types.Struct -> Time is a special of Struct
    result = encodeField.concat(result)
    return result

}



module.exports = {
    encodeBinary
}