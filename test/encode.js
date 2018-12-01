const {
  Codec,
  TypeFactory,
  Utils,
  Types,
  WireTypes
} = require('../src/index')
const { toHex } = require('./util')
const assert = require('assert')

describe('Test encode primitive type int', () => {
  let codec = new Codec()
  const Int8 = TypeFactory.create('Int8', [
    {
      name: 'int8',
      type: Types.Int8,
    }
  ], Types.Int8)

  const Int16 = TypeFactory.create('Int16', [
    {
      name: 'int16',
      type: Types.Int16,
    }
  ], Types.Int16)

  const Int32 = TypeFactory.create('int32', [
    {
      name: 'int32',
      type: Types.Int32,
    }
  ], Types.Int32)

  const Int64 = TypeFactory.create('int64', [
    {
      name: 'int64',
      type: Types.Int64,
    }
  ], Types.Int64)

  /*
    Encode int8(123) 02f601
    Encode int16(12345) 03f2c001
    Encode int32(1234567) 0387ad4b
    Encode int64(123456789) 04959aef3a
    */
  it('result of int8 should match', () => {
    let int8 = new Int8(123)
    assert.equal(toHex(codec.marshalBinary(int8)), '02f601')
  })

  it('result of int16 should match', () => {
    let int16 = new Int16(12345)
    assert.equal(toHex(codec.marshalBinary(int16)), '03f2c001')
  })

  it('result of int32 should match', () => {
    let int32 = new Int32(1234567)
    assert.equal(toHex(codec.marshalBinary(int32)), '0387ad4b')
  })

  it('result of int64 should match', () => {
    let int64 = new Int64(123456789)
    assert.equal(toHex(codec.marshalBinary(int64)), '04959aef3a')
  })
})


describe('Test encode primitive type string', () => {
  let codec = new Codec()
  const Str = TypeFactory.create('Str', [
    {
      name: 'str',
      type: Types.String,
    }
  ], Types.String)

  /*
  Encode string(teststring유니코드) 171674657374737472696e67ec9ca0eb8b88ecbd94eb939c
  */
  it('result of string should match', () => {
    let str = new Str('teststring유니코드')
    assert.equal(toHex(codec.marshalBinary(str)), '171674657374737472696e67ec9ca0eb8b88ecbd94eb939c')
  })
})
