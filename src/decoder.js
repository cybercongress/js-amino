let uVarint = require('varint')
var sVarint = require('signed-varint')
let Utils = require('./utils')
let {
    Types,
    WireType,
    WireMap
} = require('./types')

const decodeSignedVarint = input => {
    if( !input ) throw new TypeError("Can not decodeSignedVarint invalid input")
    if( !input.length ) throw new TypeError("Can not decodeSignedVarint invalid input length")
    let buf = sVarint.decode(input)
    
    return {
        data: buf,
        byteLength: sVarint.decode.bytes
    };
}

const decodeUVarint = input => {
    if( !input || !Array.isArray(input) ) throw new TypeError("Can not decodeSignedVarint invalid input")
    if( !input.length ) throw new TypeError("Can not decodeSignedVarint invalid input length")
    let buf = uVarint.decode(input)

    return {
        data: buf,
        byteLength: uVarint.decode.bytes
    };    
}

const decodeInt8 = input => {  
    let result = decodeSignedVarint(input)
    if( result.data > Number.MaxInt8) throw new TypeError("EOF decoding int8")
    let int8Buffer = Int8Array.from([result.data]);       

    return {
        data: int8Buffer[0],
        byteLength: result.byteLength
    };   
}

const decodeInt16 = input => {
    let result = decodeSignedVarint(input)
    if( result.data > Number.MaxInt16) throw new TypeError("EOF decoding int8")
    let int16Buffer = new Int16Array.from([result]);  

    return {
        data: int16Buffer[0],
        byteLength: result.byteLength
    };   
}

const decodeString = input => {
    let decodedData = decodeUVarint(input)


}

const decodeFieldNumberAndType = bz => {     
    let decodedData =  decodeUVarint(bz)
    let wiretypeNumber = decodedData.data & 0x07    
    let type = WireMap.keysOf(wiretypeNumber)  
    let idx =  decodedData.data >> 3    

    return  {
        type: type,
        byteLength: decodedData.byteLength,
        idx: idx
    }
}

module.exports = {
    decodeInt8,
    decodeInt16,
    decodeString,
    decodeFieldNumberAndType
}

if (require.main === module) {
    const typeArr = new Int8Array([150,160,10])
    console.log(typeArr)
 
}