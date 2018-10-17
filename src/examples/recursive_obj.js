let {Codec,TypeFactory,Utils, Types, WireTypes} = require('../index')

let codec1 = new Codec();

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
}])

let SubA2 = TypeFactory.create('SubA2', [ {
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
let SimpleStruct = TypeFactory.create('SimpleStruct', [{
    name: "a",
    type: Types.Int64
}/*,
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
}*/
])

let SubStruct = TypeFactory.create('SubStruct', [{
    name: "a",
    type: Types.ByteSlice
}])



codec1.registerConcrete(new SimpleStruct(), "SimpleStruct", {}) 
codec1.registerConcrete(new SubStruct(), "SubStruct", {})   
let obj = new SimpleStruct(100/*,6,'Sanh La Tin',new SubStruct([10,20,30])*/)
/*let subObj = new SubA(10)
let subObj2 = new SubA2("Do Ngoc Tan",21)
let aObj = new A(23,"Sanh la tin", new SubA("Toi la Tan",12,subObj2))    
let bObj = new A()
*/
let binary = codec1.marshalBinary(obj)
console.log(binary.toString())
 
/*
codec1.unMarshalBinary(binary,bObj)
if( Utils.isEqual(aObj,bObj)) {
    console.log("equal")
}
else console.log("Not equal")

//console.log(bObj)
*/


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