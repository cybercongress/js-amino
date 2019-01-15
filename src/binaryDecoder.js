const Reflection = require("./reflect")
const Decoder = require("./decoder")
const Utils = require("./utils")

let {
    Types,
    WireType,
    WireMap
} = require('./types')

const decodeBinary = (bz, instance, type) => {


    //  if (instance) {       
    //     bz = checkPrefix(bz, instance) //to do: get the RegisteredType of this instance -> update above lines
    // }
    //console.log("instance=",instance)
    //console.log("instance.type=",instance.type)
    let decodedData = null;
    //console.log("type = ",type)
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
        case Types.ByteSlice:
            {
                decodedData = Decoder.decodeSlice(bz)
                break;

            }

        case Types.Interface:
            {
                //  console.log("decode Interface:",instance);
                // console.log("instance.type=",instance.type)

                decodedData = decodeInterface(bz, instance, instance.type)
                // return decodedData;
                break;
            }

        default:
            {
                console.log("There is no data type to decode")
                break;
            }
    }
    if (decodedData) {
        if (decodedData.byteLength > 0) {
            //  bz = bz.slice(decodedData.byteLength)
            //  console.log("bz After slice=", bz.length)
        }
    }
    return {
        data: decodedData ? decodedData.data : null,
        //newBz: bz
        byteLength: decodedData.byteLength > 0 ? decodedData.byteLength : 0
    }

}
const checkPrefix = (bz, instance) => {
    let shiftedPrefixByte = 0;
    if (instance.info) {
        if (instance.info.registered) {

            if (!Utils.isEqual(bz.slice(0, 4), instance.info.prefix)) {
                console.log("instance.info.prefix)=",instance.info)
                //throw new TypeError("prefix not match") //todo: try to fix thiss
            }
            bz = bz.slice(4)
            shiftedPrefixByte = 4;
        }
    }
    return shiftedPrefixByte;

}

const decodeBinaryField = (bz, idx, type, instance) => {

    let decodedFieldtype = Decoder.decodeFieldNumberAndType(bz)
    
    let excludeTypes = [WireType.Interface, WireType.Struct, WireType.ByteSlice]
    if (WireMap[type] != WireMap[decodedFieldtype.type] //also check that interface can be any time
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

    let decodedData = decodeBinary(bz, instance, type)
   
    return {
        data: decodedData.data,
        byteLength: decodedFieldtype.byteLength + decodedData.byteLength
    }

}

const decodeBinaryStruct = (bz, instance, isBare = true) => {

    let totalLength = 0;
    if (instance) {
        let shiftedByte = checkPrefix(bz, instance)
        if (shiftedByte > 0) bz = bz.slice(shiftedByte)
        totalLength = shiftedByte;

    }

    Reflection.ownKeys(instance).forEach((key, idx) => {


        let type = instance.lookup(key) //only valid with BaseTypeAmino.todo: checking     
        


        let {
            data,
            byteLength
        } = decodeBinaryField(bz, idx, type, instance[key])
        instance[key] = data
        totalLength += byteLength;
        bz = bz.slice(byteLength)
        
    })

    return {
        data: instance,
        byteLength: totalLength +1 //final 4 number was added while encode Struct -> this was removed in lastest version of Amino
    }



}

const decodeInterface = (bz, instance, type) => {
   
    let lengthResult = 0;
    if (type != Types.Struct) {        
        let shiftedByte = checkPrefix(bz, instance)
        if (shiftedByte > 0) bz = bz.slice(shiftedByte)
        lengthResult = shiftedByte

    }
    let decodedData = decodeBinary(bz, instance, type)
    //console.log("decode Interface length=", decodedData.byteLength + lengthResult)
    return {
        data: decodedData.data,
        byteLength: decodedData.byteLength + lengthResult
    }

}



module.exports = {
    decodeBinary
}