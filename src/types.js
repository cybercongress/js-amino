const Types = {
    Int64: Symbol('Int64'),
    Int32: Symbol('Int32'),
    Int16: Symbol('Int16'),
    Int8: Symbol('Int8'),
    String: Symbol('String'),
    Struct: Symbol('Struct'),
    Time: Symbol('Time'),
    ByteSlice: Symbol('ByteSlice'),
    ArrayStruct: Symbol('ArrayStruct'),
    ArrayInterface: Symbol('ArrayInterface'),
    Interface: Symbol('Interface')
}

//reference : https://developers.google.com/protocol-buffers/docs/encoding
let WireType = {
    Varint: 0, //int32, int64, uint32, uint64, sint32, sint64, bool, enum
    Type8Byte: 1, //fixed64, sfixed64, double
    ByteLength: 2, //string, bytes, embedded messages, packed repeated fields
    Type4Byte: 5  //fixed32, sfixed32, float
}

const WireMap = {
    [Types.Int64]: WireType.Varint,
    [Types.Int32]: WireType.Type4Byte,
    [Types.Int16]: WireType.Varint,
    [Types.Int8]: WireType.Varint,
    [Types.Time]: WireType.Varint,
    [Types.String]: WireType.ByteLength,
    [Types.Struct]: WireType.ByteLength,
    [Types.ByteSlice]: WireType.ByteLength,
    [Types.ArrayStruct]: WireType.ByteLength,
    [Types.ArrayInterface]: WireType.ByteLength,
    [Types.Interface]: WireType.ByteLength,
}

WireType.keysOf = number => {
    let resultKey = null
    Reflect.ownKeys(WireType).forEach(key => {        
        if(WireType[key] == number ) {
            resultKey = key
            return;
        }
    })
    return resultKey
}

WireMap.keysOf = wireType => {    
    let resultKey = null
    Reflect.ownKeys(WireMap).forEach(key => {                
        if(WireMap[key] == wireType ) {
            resultKey = key
            return;
        }
    })
    return resultKey
}

module.exports = {
    Types,
    WireType,
    WireMap
}