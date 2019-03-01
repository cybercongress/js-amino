let uVarint = require('varint')
var sVarint = require('signed-varint')
let Int53 = require('int53')
let Utils = require('./utils')

let {
    Types,
    WireType,
    WireMap
} = require('./types')
let { Buffer } = require('safe-buffer')

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

const decodeInt64 = input => {
    let offset = 0;
    let buf = Buffer.from(input.slice(0,8))    
    var number = Int53.readInt64LE(buf, offset)
    
    return {
        data: number,
        byteLength: 8
    };   

   
}

const decodeString = input => {       
    let decodedSlice = decodeSlice(input)
    let str = Buffer.from(decodedSlice.data).toString('utf8')
    //new code
  /*  str.forEach( (element,idx) => { //for-each instead of map to prevent copy js array
        str[idx] = String.fromCharCode(element)                
    });
    str = str.join('')   */

    return {
        data:str,
        byteLength: decodedSlice.byteLength
    } 
}

const decodeSlice = input =>{
    let {data,byteLength} = decodeUVarint(input)
    let length = data
    if(input.length < length) throw new RangeError(`insufficient bytes decoding string of length ${strLength}`)
    
    let slicedData = input.slice(byteLength,length+1);

    return {
        data:slicedData,
        byteLength: byteLength + length
    } 
}

const decodeFieldNumberAndType = bz => {  
    let decodedData = decodeUVarint(bz)   
    let wiretypeNumber = decodedData.data & 0x07
   
    let idx =  decodedData.data >> 3    
    if( idx > (1<<29) -1 ) throw new RangeError("Invalid Field Num:",idx)    

    return  {
        type: wiretypeNumber,//type,
        byteLength: decodedData.byteLength,
        idx: idx
    }
}

module.exports = {
    decodeUVarint,
    decodeInt8,
    decodeInt16,
    decodeInt64,
    decodeString,
    decodeFieldNumberAndType,
    decodeSlice
}

if (require.main === module) {
    const typeArr = new Int8Array([150,160,10])
    console.log(typeArr)
 
}