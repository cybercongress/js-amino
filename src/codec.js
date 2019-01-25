const RegisteredType = require("./registeredType").RegisteredType
const Reflection = require("./reflect")
const BinaryEncoder = require("./binaryEncoder")
const BinaryDecoder = require("./binaryDecoder")
const JsonEncoder = require("./jsonEncoder")
const JsonDecoder = require("./jsonDecoder")
const Encoder = require("./encoder")
const Decoder = require("./decoder")
const TypeFactory = require("./typeFactory")
const Utils = require("./utils")

let {
    Types,
    WireType
} = require('./types')


let instance = null;

let privObj = {
    typeMap: null
}

class FieldOtions {

    constructor(opts = {}) {
        this.jsonName = opts.jsonName || "";
        this.jsonOmitEmpty = opts.jsonOmitEmpty || "";
        this.binFixed64 = opts.binFixed64 || false; // (Binary) Encode as fixed64
        this.binFixed32 = opts.binFixed32 || false; // (Binary) Encode as fixed32
        this.unsafe = opts.unsafe || false; // e.g. if this field is a float.
        this.writeEmpty = opts.writeEmpty || false; // write empty structs and lists (default false except for pointers)
        this.emptyElements = opts.emptyElements || false; // Slice and Array elements are never nil, decode 0x00 as empty struct.

    }
}

class Codec {

    constructor() {
        if (!instance) {
            instance = this; //singleton-design pattern
        }
        privObj.typeMap = new Map()
        return instance;
    }

    lookup(typeName) {
        return this.typeMap.get(typeName);
    }

    set(typeName, registeredType) {
        privObj.typeMap.set(typeName, registeredType)
    }

    registerConcrete(instance, name, opt) {
        let typeName = Reflection.typeOf(instance);
        if (this.lookup(typeName)) {
            throw new Error(`${typeName} was registered`)
        }
        let type = new RegisteredType(name, typeName)
        type.registered = true
        instance.info = type
        this.set(typeName, type)

    }

    marshalJson(obj) {
        if (!obj) return null;
        let typeInfo = this.lookup(Reflection.typeOf(obj))
        let value = JsonEncoder.encodeJson(obj, obj.type)
        // if this object was not registered with prefix
        let serializedObj = value
        // if this object was registered with prefix
        if (typeInfo && typeInfo.name) {
            serializedObj = {
                type: typeInfo.name,
                value: value,
            }
        }
        return JSON.stringify(serializedObj)
    }

    unMarshalJson(json, instance) {
        let deserializedObj = JSON.parse(json)
        let typeName = Reflection.typeOf(instance);
        if (!this.lookup(typeName)) {
            throw new Error(`No ${typeName} was registered`)
        }
        let value = deserializedObj
        let typeInfo = this.lookup(Reflection.typeOf(instance))
        if (typeInfo && typeInfo.name) {
            if (deserializedObj.type !== typeInfo.name) {
                throw new Error(`Type not match. expected: ${typeInfo.name}, but: ${deserializedObj.type}`)
            }
            value = deserializedObj.value
        }
        JsonDecoder.decodeJson(value, instance)
    }

    marshalBinary(obj, fieldOpts = new FieldOtions()) {
        if (!obj) return null
        // let typeInfo = this.lookup(Reflection.typeOf(obj))        
        // if (!typeInfo) return null;
        
        let encodedData = BinaryEncoder.encodeBinary(obj, obj.type, fieldOpts)
        if (obj.info) { //if this object was registered with prefix
            if (obj.info.registered) {
                encodedData = obj.info.prefix.concat(encodedData)
            }
        }

        let lenBz = Encoder.encodeUVarint(encodedData.length)

        return lenBz.concat(encodedData)
    }

    unMarshalBinary(bz, instance, fieldOpts = new FieldOtions()) {
        if (bz.length == 0) throw new RangeError("UnmarshalBinary cannot decode empty bytes")
        if (!instance) throw new TypeError("UnmarshalBinary cannot decode to Null instance")
        let typeName = Reflection.typeOf(instance)
        let typeInfo = this.lookup(typeName)
        if (!typeInfo) throw new TypeError(`No ${typeName} was registered`)
        let {
            data, //length of buffer
            byteLength
        } = Decoder.decodeUVarint(bz)
        let realbz = bz.slice(byteLength)
        
        if (data != realbz.length) throw new RangeError("Wrong length of Encoded Buffer")
        if (!Utils.isEqual(realbz.slice(0, 4), typeInfo.prefix)) {
            throw new TypeError("prefix not match")
        }
        realbz = bz.slice(5)
        
        BinaryDecoder.decodeBinary(realbz, instance, instance.type/*, fieldOpts*/)

    }
    get typeMap() {
        return privObj.typeMap;
    }
}

module.exports = {
    Codec,
    FieldOtions
}