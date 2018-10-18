let varint = require('varint')
var svarint = require('signed-varint')
let Int53 = require('int53')

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
    return encodeSignedVarint(input) //todo: add Int16Array ?
}

const encodeInt32 = input => {
    let buffer = new ArrayBuffer(4); //4 byte
    let view = new DataView(buffer);
    view.setUint32(0, input); // big endiant
    return Array.from(new Uint8Array(buffer));
}

//todo: using TypeArray for compatibility with React and Web
const encodeInt64 = input => {
    let buff = Buffer(8)
    Int53.writeInt64LE(input, buff, 0)
    return Array.from(new Int32Array(buff))
}

const encodeSlice = input => {
    let encodedData = input.slice();

    return [encodeUVarint(input.length)].concat(encodedData)
}

const encodeString = input => {
    let data = input.split('')
    let encodedData = []
    data.forEach(element => {
        encodedData = encodedData.concat(encodeUVarint(element.charCodeAt()))
    });

    return [input.length].concat(encodedData)
}

const encodeUint8 = input => {
    return encodeUVarint(input) //todo: add Uint8Array
}

const encodeBoolean = input => {
    if (input) return encodeUint8(1)
    return encodeUint8(0)
}

const encodeFieldNumberAndType = (num, type) => { //reference:https://developers.google.com/protocol-buffers/docs/encoding
    let encodedVal = (num << 3 | type)
    return varint.encode(encodedVal)
}


module.exports = {
    encodeSignedVarint,
    encodeFieldNumberAndType,
    encodeString,
    encodeInt8,
    encodeInt16,
    encodeInt32,
    encodeInt64,
    encodeSlice,
    encodeBoolean,
    encodeUVarint
}

if (require.main == module) {
    let arr = [4, 66, 153, 172, 244, 182, 160, 156, 54, 242, 103, 168, 146, 69, 89, 181, 159, 160, 108, 93, 62, 42, 93, 252, 4, 232,
        56, 176, 21, 70, 198, 18, 48, 42, 124, 225, 1, 52, 30, 72, 142, 47, 87, 44, 217, 113, 131, 20, 117, 155, 23, 226, 47, 118, 11,
        140, 178, 199, 13, 157, 229, 105, 196, 193, 161
    ]

    let result = encodeSlice(arr)
    console.log(result.toString())
}