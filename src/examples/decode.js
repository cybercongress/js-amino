let {
    Codec,
    TypeFactory,
    Utils,
    Types,
    WireTypes
} = require('../index')

let codec = new Codec();

let A = TypeFactory.create('A', [ {
   name: "a",
    type: Types.String
},
{
    name: "b",
    type: Types.Int8
},
{
    name: "c",
    type: Types.Struct
}
])

let SubA = TypeFactory.create('SubA', [{
    name: "a",
    type: Types.String
},
{
    name: "b",
    type: Types.Int8
},
{
    name: "c",
    type: Types.Struct
}
])

let SubB = TypeFactory.create('SubB', [{
    name: "a",
    type: Types.String
}
])

codec.registerConcrete(new A(), "A", {})
codec.registerConcrete(new SubA, "SubA",{})
codec.registerConcrete(new SubB, "SubB",{})
let a = new A("Tan",45,new SubA("Hello World",5, new SubB("Do Ngoc Tan")))


let binary = codec.marshalBinary(a)
//console.log(binary.toString())
//let decodedData = new A()
let decodedData = new A()
codec.unMarshalBinary(binary, decodedData)
console.log(decodedData.JsObject())
