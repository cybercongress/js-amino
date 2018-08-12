let varint = require('varint')
var svarint = require('signed-varint')

const encodeSignedVarint = input => {
    let buf = svarint.encode(input)
    return buf;
}

const encodeUVarint = input => {
    let buf = varint.encode(input)
    return buf;
}
//encode sign functions
const encodeInt8 = input => {
    return encodeSignedVarint(input)
}

const encodeInt16 = input => {
    return encodeSignedVarint(input)
}

const encodeString = input => {
    console.log(input)
    let data = input.split('')
    let encodedData =[]
    data.forEach(element => {        
        encodedData = encodedData.concat(encodeUVarint(element.charCodeAt()))        
    });
    
    return [input.length].concat(encodedData)
}

const encodeUint8 = input => {
    return encodeUVarint(input)
}

const encodeBoolean = input => {
    if(input) return encodeUint8(1)
    return encodeUint8(0)
}

const encodeFieldNumberAndType = (num,type) => { //reference:https://developers.google.com/protocol-buffers/docs/encoding
    let encodedVal = (num <<3 | type )
    return varint.encode(encodedVal)
}


module.exports = {
    encodeSignedVarint,
    encodeFieldNumberAndType,
    encodeString,
    encodeInt8,
    encodeInt16
}