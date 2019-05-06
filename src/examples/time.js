let {
    Codec,
    TypeFactory,
    Utils,
    Types,
    WireTypes
  } = require('../index')
  
  let TimeStruct = TypeFactory.create('TimeStruct', [{
    name: 'time',
    type: Types.Time,
  }, {
    name: 'str2',
    type: Types.String,
  }, {
    name: 'int',
    type: Types.Int64,
  }])
  
  let codec = new Codec()
  codec.registerConcrete(new TimeStruct(), 'test/TimeStruct')
  
  let timeStruct = new TimeStruct(new Date('2006-01-02 20:04:05 +0000 UTC'), "Hello World",500) //01 Dec 2018 00:00:00 UTC
  //console.log("timeStruct:",timeStruct)
  let binary = codec.marshalBinary(timeStruct)
  console.log(binary.toString())
  let decodedTime = new TimeStruct();
  codec.unMarshalBinary(binary,decodedTime)
  console.log(decodedTime.JsObject())
  
  
