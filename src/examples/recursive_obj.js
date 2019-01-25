let {
    Codec,
    TypeFactory,
    Utils,
    Types,
    WireTypes
} = require('../index')

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



let SimpleStruct = TypeFactory.create('SimpleStruct', [{
        name: "a",
        type: Types.Int8
    },
    {
        name: "b",
        type: Types.ArrayStruct
    },
    {
        name: "c",
        type: Types.Int8
    },
    {
        name: "d",
        type: Types.String
    },
    {
        name: "e",
        type: Types.Struct
    }
])



let SubStruct = TypeFactory.create('SubStruct', [{
    name: "a",
    type: Types.ByteSlice
}])


let SubStruct2 = TypeFactory.create('SubStruct2', [{
    name: "a",
    type: Types.Int8
}])



codec1.registerConcrete(new SimpleStruct(), "SimpleStruct", {})
codec1.registerConcrete(new SubStruct(), "SubStruct", {})
let subStructs = []
let subStructs2 = []
for (let i = 0; i < 10; ++i) {
    let subStruct = new SubStruct([i + 1, i + 2, i + 3]);
    subStructs.push(subStruct)
}

for (let i = 0; i < 15; ++i) {
    let subStruct2 = new SubStruct2(i+1);
    subStructs2.push(subStruct2)
}

let obj = new SimpleStruct(100, subStructs, 1, "Je Suis Tan", new SubA('Hello', 32, new SubA2('World', 80)))

let binary = codec1.marshalBinary(obj)
//console.log("binary=",binary.toString())
console.log(Utils.toHex(binary))

let decodedObj = new SimpleStruct()
codec1.unMarshalBinary(binary,decodedObj)
let jsObj = decodedObj.JsObject();
console.log("decodedObj=",JSON.stringify(jsObj))

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