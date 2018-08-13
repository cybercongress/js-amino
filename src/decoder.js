let uVarint = require('varint')
var sVarint = require('signed-varint')

const decodeSignedVarint = input => {
    if( !input ) throw new TypeError("Can not decodeSignedVarint invalid input")
    if( !input.length ) throw new TypeError("Can not decodeSignedVarint invalid input length")
    let buf = sVarint.decode(input)
    
    return buf;
}

const decodeUVarint = input => {
    if( !input || !Array.isArray(input) ) throw new TypeError("Can not decodeSignedVarint invalid input")
    if( !input.length ) throw new TypeError("Can not decodeSignedVarint invalid input length")
    let buf = uVarint.decode(input)
    return buf;
}

const decodeInt8 = input => {    
    if( !input || !Array.isArray(input) ) throw new TypeError("Can not decodeSignedVarint invalid input")
    let result = decodeSignedVarint(input)
    return result;
}

module.exports = {

}

if (require.main === module) {
    let result = decodeInt8([0x81, 0x01])
    console.log(result)

}