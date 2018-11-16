let {
  Codec,
  TypeFactory,
  Utils,
  Types,
  WireTypes
} = require('../index')

let StrStruct = TypeFactory.create('StrStruct', [{
  name: 'str1',
  type: Types.String,
}, {
  name: 'str2',
  type: Types.String,
}, {
  name: 'int',
  type: Types.Int8,
}])

let codec = new Codec()
codec.registerConcrete(new StrStruct(), 'test/StrStruct')

let strStruct = new StrStruct('ascii', '안녕', 10)

let binary = codec.marshalBinary(strStruct)
console.log(binary.toString())

let strStruct2 = new StrStruct()
codec.unMarshalBinary(binary, strStruct2)
console.log(strStruct2)
console.log(strStruct.str1 === strStruct2.str1 && strStruct.str2 === strStruct2.str2 && strStruct.int === strStruct2.int)

/*
21,56,46,110,101,10,5,97,115,99,105,105,18,6,236,149,136,235,133,149,24,20
AminoType {
  idx: 2,
  str1: 'ascii',
  str2: '안녕',
  int: 10,
  [Symbol(privateTypeMap)]:
   Map {
     'str1' => Symbol(String),
     'str2' => Symbol(String),
     'int' => Symbol(Int8) } }
true
*/
