const Types = {
    Int64: Symbol('Int64'),
    Int32: Symbol('Int32'),
    Int16: Symbol('Int16'),
    Int8: Symbol('Int8'),
    String: Symbol('String')
}

//reference this link: https://developers.google.com/protocol-buffers/docs/encoding
const WireType = {
    Varint: 0, //int32, int64, uint32, uint64, sint32, sint64, bool, enum
    Type8Byte: 1, //fixed64, sfixed64, double
    ByteLength: 2, //string, bytes, embedded messages, packed repeated fields
    Type4Byte: 5  //fixed32, sfixed32, float
}

module.exports = {
    Types,
    WireType
}