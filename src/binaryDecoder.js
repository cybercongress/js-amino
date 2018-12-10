const Reflection = require("./reflect")
const Decoder = require("./decoder")
const Utils = require("./utils")

let {
    Types,
    WireType,
    WireMap
} = require('./types')

const decodeBinary = (bz, instance, type) => {

    if (instance) {
        bz = checkPrefix(bz, instance)
    }

    switch (type) {

        case Types.Int64:
            {
                //todo
                break;
            }
        case Types.String:
            {
                decodedData = Decoder.decodeString(bz)
                break;
            }
        case Types.Int8:
            {
                decodedData = Decoder.decodeInt8(bz)

                break;
            }
        case Types.Struct:
            {
                decodedData = decodeBinaryStruct(bz, instance, false)
                break;
            }
        default:
            {
                console.log("There is no data type to decode")
                break;
            }
    }
    if (decodedData) {
        bz = bz.slice(decodedData.byteLength)
    }
    return {
        data: decodedData.data,
        newBz: bz
    }

}
const checkPrefix = (bz, instance) => {
    if (instance.info) {
        if (instance.info.registered) {
            if (!Utils.isEqual(bz.slice(0, 4), instance.info.prefix)) {
               // throw new TypeError("prefix not match")
            }
            bz = bz.slice(4)
        }
    }
    return bz;

}

const decodeBinaryField = (bz, idx, type, instance) => {

    let decodedFieldtype = Decoder.decodeFieldNumberAndType(bz)

    if (WireMap[type] != WireMap[decodedFieldtype.type]) throw new TypeError("Type does not match in decoding")

    if (idx + 1 != decodedFieldtype.idx) throw new RangeError("Index of Field is not match while decoding")
    bz = bz.slice(decodedFieldtype.byteLength)
    let decodedData = decodeBinary(bz, instance, type)

    return decodedData;

}

const decodeBinaryStruct = (bz, instance, isBare = true) => {

    Reflection.ownKeys(instance).forEach((key, idx) => {

        let type = instance.lookup(key) //only valid with BaseTypeAmino.todo: checking     

        let instance2 = instance[key]

        let {
            data,
            newBz
        } = decodeBinaryField(bz, idx, type, instance[key])
        instance[key] = data
        bz = newBz
    })
    /*if (!isBare) {
        return {
            data: instance,
            newBz: bz
        }
    }
      else return;*/
    return {
        data: instance,
        newBz: bz
    }



}



module.exports = {
    decodeBinary
}