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

const toHex = (buffer) => {
    let s = ''
    buffer.forEach((b) => {
        b = b.toString(16)
        if (b.length == 1) {
            b = '0' + b
        }
        s += b
    })
    return s
  }
  
  const fromHex = (str) => {
    let buffer = []
    for (let i = 0; i < str.length; i += 2) {
      let hex = str.slice(i, i+2)
      buffer.push(parseInt(hex, 16))
    }
    return buffer
  }

codec.registerConcrete(new A(), "A", {})
codec.registerConcrete(new SubA, "SubA",{})
codec.registerConcrete(new SubB, "SubB",{})
let subB = new SubB("Do Ngoc Tan")
let subA =  new SubA("Hello World",5, subB)
let a = new A("Tan",45,subA)


let binary = codec.marshalBinary(a)
console.log("binary.length=",binary.length)
//let decodedData = new A()
let decodedData = new A()
//console.log("A=",new A())
//console.log("SubB=",new SubB())
//console.log("subA=",new SubA())
codec.unMarshalBinary(binary, decodedData)
console.log(decodedData.JsObject())
