const RegisteredType = require("./registeredType").RegisteredType
const Reflection = require("./reflect")
const BinaryEncoder = require("./binaryEncoder")
const TypeFactory = require("./typeFactory")
let { Types,WireType } = require('./types')


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
        if( this.typeMap.get(typeName) ) {
            throw new Error(`${typeName} was registered`)           
        }         
        let registeredType = new RegisteredType(name,typeName)
        
        privObj.typeMap.set(typeName, registeredType)       

    }

    marshalJson(obj) {
        if(!obj) return null;
        let typeInfo = this.typeMap.get( Reflection.typeOf(obj) )
        let serializedObj = {
            type: typeInfo.disfix.toString('hex'),
            value: {}
        }
        serializedObj.value = Object.assign({},obj)

        return JSON.stringify(serializedObj);       

    }

    unMarshalJson(json, instance) {
        let deserializedObj = JSON.parse(json)
        let typeName = Reflection.typeOf(instance);
        if( !this.typeMap.get(typeName) ) {
            throw new Error(`No ${typeName} was registered`)
            return;          
        }       
        Object.assign(instance, deserializedObj.value)               
        
    }

    marshalBinary(obj) {
        if(!obj) return null;
        let typeInfo = this.typeMap.get( Reflection.typeOf(obj) )
        if(!typeInfo) return null;
       let encodedData =  BinaryEncoder.encodeBinaryStruct(obj)     
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

class MyStruct 
{
    constructor(a,b,c,d,e) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;      

    }
}

if (require.main === module) {
    let codec1 = new Codec();

    let A = TypeFactory.create('TestAmino', [{
        name: "a",
        type: Types.Int8
    },
    {
        name: "b",
        type: Types.String
    }
])

   
    
    codec1.registerConcrete(new A(),"SimpleStruct",{})
   // codec1.registerConcrete(new A(),"SimpleStruct",{})
    let aObj = new A(127,"toi la tan")
   // let myStruct = new MyStruct(100,200,300,"SimpleStruct",400)
   

    let binary = codec1.marshalBinary(aObj)
    console.log(binary)
    
    
  
   

}