const Reflection = require("./reflect")
const Decoder = require("./decoder")

let {
    Types,
    WireType,
    WireMap
} = require('./types')

const decodeBinary = (bz, instance, isBare = true) => {
    Reflection.ownKeys(instance).forEach((key, idx) => {
        let type = instance.lookup(key) //only valid with BaseTypeAmino.todo: checking        
        let {
            data,
            newBz
        } = decodeBinaryField(bz, idx, type)
        instance[key] = data
        bz = newBz     

    })

}

const decodeBinaryField = (bz, idx, type) => {
    let decodedFieldtype = Decoder.decodeFieldNumberAndType(bz)

    if (type.toString() != decodedFieldtype.type.toString()) throw new TypeError("Type does not match in decoding")

    if (idx + 1 != decodedFieldtype.idx) throw new RangeError("Index of Field is not match while decoding")
    bz = bz.slice(decodedFieldtype.byteLength)
    let decodedData = null;
    switch (type) {

        case Types.Int64:
            {

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



module.exports = {
    decodeBinary
}