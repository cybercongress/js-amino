const RegisteredType = require("./registeredType").RegisteredType
const Reflection = require("./reflect")
const BinaryEncoder = require("./binaryEncoder")
const TypeFactory = require("./typeFactory")
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
            instance = this;
        }
        privObj.typeMap = new Map()
        return instance;
    }

    registerConcrete(instance, name, opt) {
        let typeName = Reflection.typeOf(instance);
        if (this.typeMap.get(typeName)) {
            throw new Error(`${typeName} was registered`)
        }
        let registeredType = new RegisteredType(name, typeName)

        privObj.typeMap.set(typeName, registeredType)

    }

    marshalJson(obj) {
        if (!obj) return null;
        let typeInfo = this.typeMap.get(Reflection.typeOf(obj))
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
        if (!this.typeMap.get(typeName)) {
            throw new Error(`No ${typeName} was registered`)
            return;
        }
        Object.assign(instance, deserializedObj.value)

    }

    marshalBinary(obj) {
        if (!obj) return null;
        let typeInfo = this.typeMap.get(Reflection.typeOf(obj))
        if (!typeInfo) return null;
        let encodedData = BinaryEncoder.encodeBinary(obj)
        let binWithoutLenPrefix = typeInfo.prefix.concat(encodedData);
        let lengthPrefix = binWithoutLenPrefix.length;
        return [lengthPrefix].concat(binWithoutLenPrefix)

    }

    unMarshalBinary(json, instance) {


    }
    get typeMap() {
        return privObj.typeMap;
    }
}

module.exports = {
    Codec
}



if (require.main === module) {
    let codec1 = new Codec();

    let SubA = TypeFactory.create('SubA', [{
        name: "a",
        type: Types.String
    },
    {
        name: "b",
        type: Types.Int64
    },
    {
        name: "sub2",
        type: Types.Struct
    }])

    let SubA2 = TypeFactory.create('SubA2', [{
        name: "c",
        type: Types.String
    },
    {
        name: "d",
        type: Types.Int8
    }
])


    let A = TypeFactory.create('A', [{
            name: "a",
            type: Types.Int64
        },
        {
            name: "b",
            type: Types.String
        },
        {
            name: "sub",
            type: Types.Struct
        }
    ])



    codec1.registerConcrete(new A(), "SimpleStruct", {})
   // codec1.registerConcrete(new SubA(), "SubStruct", {})
    // codec1.registerConcrete(new A(),"SimpleStruct",{})
    let subObj = new SubA(10)
    let subObj2 = new SubA2("Do Ngoc Tan",21)
    let aObj = new A(234,"Sanh la tin", new SubA("Toi la Tan",999,subObj2))
    // let myStruct = new MyStruct(100,200,300,"SimpleStruct",400)


    let binary = codec1.marshalBinary(aObj)
    console.log(binary)





}