const RegisteredType = require("./registeredType").RegisteredType
const Reflection = require("./reflect")
const BinaryEncoder = require("./binaryEncoder")
const BinaryDecoder = require("./binaryDecoder")
const Encoder = require("./encoder")
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
        let serializedObj = {
            type: typeInfo.disfix.toString('hex'),
            value: {}
        }
        serializedObj.value = Object.assign({}, obj)

        return JSON.stringify(serializedObj);

    }

    unMarshalJson(json, instance) {
        let deserializedObj = JSON.parse(json)
        let typeName = Reflection.typeOf(instance);
        if (!this.lookup(typeName)) {
            throw new Error(`No ${typeName} was registered`)            
        }
        Object.assign(instance, deserializedObj.value)

    }

    marshalBinary(obj) {
        if (!obj) return null        
        let typeInfo = this.lookup(Reflection.typeOf(obj))
        if (!typeInfo) return null;
        let encodedData = BinaryEncoder.encodeBinary(obj,obj.type)  
        if( obj.info.registered ) {
            encodedData = obj.info.prefix.concat(encodedData)            
        }
        let lenBz = Encoder.encodeUVarint(encodedData.length)        
        
        return lenBz.concat(encodedData)
    }

    unMarshalBinary(bz, instance) {
        if( bz.length == 0 ) throw new RangeError("UnmarshalBinary cannot decode empty bytes")
        if( !instance ) throw new TypeError("UnmarshalBinary cannot decode to Null instance")
        let typeName = Reflection.typeOf(instance)
        let typeInfo = this.lookup(typeName)
        if( !typeInfo ) throw new TypeError(`No ${typeName} was registered`)
        let length = bz[0]
        let realbz = bz.slice(1);  
        if(length != realbz.length) throw new RangeError("Wrong length")      
        if( !Utils.isEqual(realbz.slice(0,4),typeInfo.prefix )) {
            throw new TypeError("prefix not match")
        }
        realbz = bz.slice(5)
        BinaryDecoder.decodeBinary(realbz,instance)

    }
    get typeMap() {
        return privObj.typeMap;
    }
}

module.exports = {
    Codec
}



