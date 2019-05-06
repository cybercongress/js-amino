const Reflection = require("./reflect")
const Decoder = require("./decoder")
const Utils = require("./utils")

let {
    Types,
    WireType,
    WireMap
} = require('./types')

const decodeBinary = (bz, instance, type, opts, isBare = true) => {

    let decodedData = null;

    switch (type) {

        case Types.Int64: {
            if (opts.binFixed64) {
                decodedData = Decoder.decodeInt64(bz)
            } else {
                decodedData = Decoder.decodeUVarint(bz)
            }

            break;
        }
        case Types.String: {

            decodedData = Decoder.decodeString(bz)
            break;
        }
        case Types.Int8: {
            decodedData = Decoder.decodeInt8(bz)
            break;
        }
        case Types.Struct: {
            decodedData = decodeBinaryStruct(bz, instance, opts, isBare)
            break;
        }

        case Types.ArrayStruct: {
            decodedData = decodeBinaryArray(bz, Types.ArrayStruct, instance, opts, isBare)
            break;
        }

        case Types.ArrayInterface: {
            decodedData = decodeBinaryArray(bz, Types.ArrayInterface, instance, opts, isBare)
            break;
        }

        case Types.ByteSlice: {
            decodedData = Decoder.decodeSlice(bz)
            break;
        }

        case Types.Interface: {

            decodedData = decodeInterface(bz, instance, instance.type, opts, isBare)
            break;
        }

        default: {
            console.log("There is no data type to decode:", type)
            throw new Error("There is no data type to decode:", type)

        }
    }

    return {
        data: decodedData ? decodedData.data : null,
        byteLength: decodedData.byteLength > 0 ? decodedData.byteLength : 0
    }

}


const decodeBinaryField = (bz, idx, type, instance, opts, isBare) => {
    let decodedData = null;
    let decodedFieldtype = Decoder.decodeFieldNumberAndType(bz)
    let totalLength = 0;
    if (type == Types.ArrayStruct || type == Types.ArrayInterface) {
        decodedData = decodeBinaryArray(bz, type, instance, opts, true, idx)
        totalLength = decodedData.byteLength
    } else if (type == Types.Time) {
        bz = bz.slice(decodedFieldtype.byteLength)        
        decodedData = decodeTime(bz, instance, idx, isBare)
        totalLength = decodedFieldtype.byteLength + decodedData.byteLength
    } else {

        let expectedTyp3 = Reflection.typeToTyp3(type, opts)
        let buffTyp3 = decodedFieldtype.type //Reflection.typeToTyp3(decodedFieldtype.type, {})
        let excludeTypes = [WireType.Interface, WireType.Struct, WireType.ByteSlice]
        if (expectedTyp3 != buffTyp3 /*WireMap[decodedFieldtype.type]*/ //also check that interface can be any time
            &&
            !excludeTypes.includes(WireMap[type]) && !excludeTypes.includes(WireMap[decodedFieldtype.type])) {
            // && (WireMap[type] != WireType.Interface || WireMap[decodedFieldtype.type] != WireType.Interface)) {

            throw new TypeError("Type does not match in decoding. Expecting:" + type.toString() +
                " But got:" + decodedFieldtype.type.toString())
        }

        if (idx + 1 != decodedFieldtype.idx) {
            throw new RangeError("Index of Field is not match. Expecting:" + (idx + 1) +
                " But got:" + decodedFieldtype.idx)
        }
        bz = bz.slice(decodedFieldtype.byteLength)
        decodedData = decodeBinary(bz, instance, type, opts, isBare)
        totalLength = decodedFieldtype.byteLength + decodedData.byteLength

    }
    return {
        data: decodedData.data,
        byteLength: totalLength
    }

}

const decodeBinaryStruct = (bz, instance, opts, isBare = true) => {

    let totalLength = 0;

    if (!isBare) { // Read byte-length prefixed byteslice.
        let prefixSlice = Decoder.decodeUVarint(bz)
        bz = bz.slice(prefixSlice.byteLength)

        if (bz.length < prefixSlice.data) {
            throw new RangeError("Wrong length prefix for Struct")
        }
        totalLength += prefixSlice.byteLength;
    }



    Reflection.ownKeys(instance).forEach((key, idx) => {

        let type = instance.lookup(key)
        let {
            data,
            byteLength
        } = decodeBinaryField(bz, idx, type, instance[key], opts, false)
        instance[key] = data
        totalLength += byteLength;
        bz = bz.slice(byteLength)

    })

    return {
        data: instance,
        byteLength: totalLength
    }



}

const decodeBinaryArray = (bz, arrayType, instance, opts, isBare = true, idx = 0) => {
    let totalLength = 0;
    let items = []
    if (!isBare) { // Read byte-length prefixed byteslice.
        let prefixSlice = Decoder.decodeUVarint(bz)
        bz = bz.slice(prefixSlice.byteLength)
        if (bz.length < prefixSlice.data) throw new RangeError("Wrong length prefix for Binary Array")
        totalLength += prefixSlice.byteLength;
    }
    let itemType = arrayType == Types.ArrayInterface ? Types.Interface : Types.Struct

    for (let i = 0; i < instance.length; ++i) {
        let decodedFieldtype = Decoder.decodeFieldNumberAndType(bz)
        bz = bz.slice(decodedFieldtype.byteLength) //remove  byte field

        let decodedData = decodeBinary(bz, instance[i], itemType, opts, false)
        bz = bz.slice(decodedData.byteLength);
        items.push(decodedData.data)


        totalLength += decodedFieldtype.byteLength;
        totalLength += decodedData.byteLength;

    }

    return {
        data: items,
        byteLength: totalLength //+ instance.length
    }
}

const decodeTime = (bz, instance,idx, isBare) => {
    let totalLength = 0;
    
    if (!isBare) { // Read byte-length prefixed byteslice.
        let prefixSlice = Decoder.decodeUVarint(bz)
        bz = bz.slice(prefixSlice.byteLength)        
        
       // if (bz.length < prefixSlice.data) throw new RangeError("Wrong length prefix for Time")
        totalLength += prefixSlice.byteLength;
    }
   // console.log("bz=",bz);
    let decodedData = Decoder.decodeTime(bz);
    totalLength += decodedData.byteLength;
    
    return {
        data: decodedData.data,
        byteLength: totalLength
    }

}


const verifyPrefix = (bz, instance) => {
    let shiftedPrefixByte = 0;
    if (instance.info) {
        if (instance.info.registered) {

            if (!Utils.isEqual(bz.slice(0, 4), instance.info.prefix)) {
                throw new TypeError("prefix not match")
            }
            shiftedPrefixByte = 4;
        }
    }
    return shiftedPrefixByte;

}

const decodeInterface = (bz, instance, type, opts, isBare = true) => {

    let totalLength = 0;

    if (!isBare) { // Read byte-length prefixed byteslice.
        let prefixSlice = Decoder.decodeUVarint(bz)
        bz = bz.slice(prefixSlice.byteLength)
        if (bz.length < prefixSlice.data) throw new RangeError("Wrong length prefix for Interface")
        totalLength += prefixSlice.byteLength;
    }

    let shiftedByte = verifyPrefix(bz, instance)
    if (shiftedByte > 0) bz = bz.slice(shiftedByte)
    totalLength += shiftedByte


    let decodedData = decodeBinary(bz, instance, type, opts, true)
    totalLength += decodedData.byteLength;

    return {
        data: decodedData.data,
        byteLength: totalLength
    }

}



module.exports = {
    decodeBinary
}