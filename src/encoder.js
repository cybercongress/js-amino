let varint = require('varint')
var svarint = require('signed-varint')
let Int53 = require('int53')
const nano = require('nanoseconds');
let {
    Buffer
} = require('safe-buffer')
const Utils = require("./utils")
let {
    Types,
    WireType,
    WireMap
} = require('./types')

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
    view.setUint32(0, input, true); // little endiant
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

    return encodeUVarint(input.length).concat(encodedData)
}

const encodeString = input => {
    return encodeSlice(Array.from(Buffer.from(input)))
}

const encodeUint8 = input => {
    return encodeUVarint(input) //todo: add Uint8Array
}

const encodeBoolean = input => {
    if (input) return encodeUint8(1)
    return encodeUint8(0)
}

const encodeTime = time => {
    let data = []    
    let s = time.getTime() / 1000 //get the second
   
    if (s != 0) {
        if (s < Utils.MinSecond && s >= Utils.MaxSecond) {
            throw new RangeError(`Second have to be >= ${Utils.MinSecond}, and <: ${Utils.MaxSecond}`)
        }
        let encodeField = encodeFieldNumberAndType(1, WireMap[Types.Time])
        data = encodeField.concat(encodeUVarint(s))
    }
   
    /*let ns = nano([0, s*1000000]);    
    ns = 0
    if (ns != 0) {
        if (ns < 0 && ns > Utils.MaxNano) {
            throw new RangeError(`NanoSecond have to be >= 0, and <=: ${Utils.MaxNano}`)
        }
        let encodeField = encodeFieldNumberAndType(2, WireMap[Types.Time])
        data = data.concat(encodeField.concat(encodeUVarint(ns)))
    }
    */
    return data;

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
    encodeUVarint,
    encodeTime
}

if (require.main == module) {
    let time = new Date('01 Dec 2018 00:12:00 GMT');


    let result = encodeTime(time)
    console.log(result)
}