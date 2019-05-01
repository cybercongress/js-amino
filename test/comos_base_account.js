//The test suites was generated from https://github.com/confio/amino-test-suite

const {
  Codec,
  FieldOptions,
  TypeFactory,
  Types,
  Utils
} = require('../src/index')
const {
  toHex
} = require('./util')
const assert = require('assert')

let codec = new Codec()
const BaseAccount = TypeFactory.create('BaseAccount', [{
    name: 'address',
    type: Types.ByteSlice,
  },
  {
    name: 'coins',
    type: Types.ArrayStruct,
  },
  {
    name: 'pubKey',
    type: Types.Interface,
  },
  {
    name: 'accountNumber',
    type: Types.Int64,
  },
  {
    name: 'sequence',
    type: Types.Int64,
  }
])

const Coin = TypeFactory.create('Coin', [{
    name: 'denom',
    type: Types.String,
  },
  {
    name: 'amount',
    type: Types.String,
  }
])

let PubKeySecp256k1 = TypeFactory.create('PubKeySecp256k1', [{
  name: "bytes",
  type: Types.ByteSlice
}], Types.ByteSlice)

codec.registerConcrete(new BaseAccount(), "auth/Account")
codec.registerConcrete(new PubKeySecp256k1(), "tendermint/PubKeySecp256k1", {});

let address = Utils.fromHex('00CAFE00DEADBEEF00CAFE00')
let coins = []
coins.push(new Coin("IOV", '87654321'))
coins.push(new Coin("ATOM", '100200300'))
let publicKeySlice = Utils.fromHex('024277B89F1752570C6F257E8BECEF1C9059312E636C6F171596AD44F56E7123DF')
let publicKey = new PubKeySecp256k1(publicKeySlice)

let baseAcc = new BaseAccount(address, coins, publicKey, 1234, 77777)



describe('Test encode simple struct from Confio', () => {

  it('result of simple struct should match', () => {
    assert.equal(toHex(codec.marshalBinary(baseAcc)),
      '653c9f2e0e0a0c00cafe00deadbeef00cafe00120f0a03494f561208383736353433323112110a0441544f4d12093130303230303330301a26eb5ae98721024277b89f1752570c6f257e8becef1c9059312e636c6f171596ad44f56e7123df20d20928d1df04')
  })
})