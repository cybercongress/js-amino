let {
    Codec,
    TypeFactory,
    Utils,
    Types,
    WireTypes
} = require('../index')

let codec = new Codec();

let SubA = TypeFactory.create('SubA', [{
        name: "a",
        type: Types.String
    },
    {
        name: "b",
        type: Types.Int8
    },
    {
        name: "sub2",
        type: Types.Struct
    }
])

let SubA2 = TypeFactory.create('SubA2', [{
        name: "a",
        type: Types.String
    },
    {
        name: "b",
        type: Types.Int8
    }
])


let A = TypeFactory.create('A', [{
        name: "a",
        type: Types.Int8
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

let B = TypeFactory.create('B', [{
        name: "a",
        type: Types.String
    },
    {
        name: "b",
        type: Types.Int8
    },
    {
        name: "c",
        type: Types.Int8
    },

    {
        name: "d",
        type: Types.Struct
    }
])
let subC = TypeFactory.create('SubC', [{
        name: "a",
        type: Types.String
    },
    {
        name: "e",
        type: Types.ByteSlice
    }
])

let C = TypeFactory.create('C', [{
        name: "a",
        type: Types.Int8
    },
    {
        name: "b",
        type: Types.Int8
    },
    {
        name: "c",
        type: Types.String
    },
    {
        name: "d",
        type: Types.Struct
    }
])

let Slice = TypeFactory.create('Slice', [{
    name: "a",
    type: Types.ByteSlice
}], Types.ByteSlice)

codec.registerConcrete(new A(), "SimpleStruct", {})
codec.registerConcrete(new C(), "shareledger/MsgSend", {})
codec.registerConcrete(new Slice(), "shareledger/PubSecp256k1", {})
codec.registerConcrete(new subC(),"shareledger/SubStruct",{})

let subObj2 = new SubA2("Do Ngoc Tan", 21)
let aObj = new A(23, "Sanh la tin", new SubA("Toi la Tan", 12, subObj2))

let arr = [100, 80, 124, 1, 35]
let slice = new Slice(arr)
let subCObj = new subC("Truong Huynh Anh Thu",slice)
let c = new C(100, 10, "Toi La Tan",subCObj)



//console.log("binary=",binary.toString())
//console.log("fullObj=",aObj.type)
let binary = codec.marshalBinary(c)
let cObj = new C()
codec.unMarshalBinary(binary, cObj)
/*
if (Utils.isEqual(c, cObj)) {
    console.log("equal")
    console.log(cObj.JsObject())
} else console.log("Not equal")
*/
console.log(cObj.JsObject())





/*
codec1.registerConcrete(new B(), "SimpleStruct", {})  
let obj  = new B("Tan",1,2,new SubA2("sanh la tin",21));
let obj2 = new B();
let obj3 = new B()
let binary = codec1.marshalBinary(obj)
//console.log(binary)    
console.log(obj)
codec1.unMarshalBinary(binary,obj2)
console.log("obj2=",obj2)
console.log(Utils.isEqual(obj,obj2))

*/