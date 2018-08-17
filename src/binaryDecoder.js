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
                     
        let {data, newBz} = decodeBinaryField(bz, idx, type,instance[key])
        instance[key] = data
        bz = newBz  
    })
    if(!isBare) {
       // console.log("data=",instance)
        return {
            data: instance,
            newBz:bz
        }
    }
    else return;

}

const decodeBinaryField = (bz, idx, type,instance) => {
    let decodedFieldtype = Decoder.decodeFieldNumberAndType(bz)     
    //if (type.toString() != decodedFieldtype.type.toString()) throw new TypeError("Type does not match in decoding")
    if (WireMap[type] != WireMap[decodedFieldtype.type]) throw new TypeError("Type does not match in decoding")
    
    if (idx + 1 != decodedFieldtype.idx) throw new RangeError("Index of Field is not match while decoding")
    bz = bz.slice(decodedFieldtype.byteLength)
    let decodedData = null;
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
            {   let firstField = Decoder.decodeSlice(bz)
                bz = bz.slice(1)                
                decodedData = decodeBinary(bz, instance, false)               
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