const {
  Codec,
  TypeFactory,
  Types,
} = require('../src/index')
const { toHex } = require('./util')
const assert = require('assert')

describe('Test encode simple struct', () => {
  let codec = new Codec()
  const SimpleStruct = TypeFactory.create('SimpleStruct', [
    {
      name: 'int8',
      type: Types.Int8,
    },
    {
      name: 'int16',
      type: Types.Int16,
    },
    {
      name: 'int32',
      type: Types.Int32,
    },
    {
      name: 'int64',
      type: Types.Int64,
    },
    {
      name: 'str',
      type: Types.String,
    },
  ])
  codec.registerConcrete(SimpleStruct, 'SimpleStruct')

  /*
  cdc.RegisterConcrete(SimpleStruct{}, "SimpleStruct", nil)
  SimpleStruct{
    Int8:  123,
    Int16: 12345,
    Int32: 1234567,
    Int64: 123456789,
    Str:   "teststring유니코드",
  } 2c4a89c4bc08f60110f2c0011887ad4b20959aef3a2a1674657374737472696e67ec9ca0eb8b88ecbd94eb939c
  */
  it('result of simple struct should match', () => {
    let simpleStruct = new SimpleStruct(123, 12345, 1234567, 123456789, 'teststring유니코드')
    assert.equal(toHex(codec.marshalBinary(simpleStruct)), '2c4a89c4bc08f60110f2c0011887ad4b20959aef3a2a1674657374737472696e67ec9ca0eb8b88ecbd94eb939c')
  })
})
