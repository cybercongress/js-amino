# An Implementation of Amino in Javascript and TypeScript

For more information spec, please refer: https://github.com/tendermint/go-amino 

## Installation

1. Run `npm install`

## Running The Examples

1. `cd src/examples`
2. `go get`
3. Run examples, e. g. in Go: `go run string.go` and in JS `node string.js`

## Running The Unit Test

1. Run `npm test`
   

## Usage
```js
const {
  Codec,
  FieldOtions,
  TypeFactory,
  Types,
  Utils
} = require('js-amino')


let codec = new Codec() //init codec

//Equivalent Structure in Go-lang
// // BaseAccount - a base account structure.
// // This can be extended by embedding within in your AppAccount.
// // There are examples of this in: examples/basecoin/types/account.go.
// // However one doesn't have to use BaseAccount as long as your struct
// // implements Account.
// type BaseAccount struct {
// 	Address sdk.AccAddress `json:"address"`
// 	Coins   sdk.Coins      `json:"coins"`
// 	PubKey  crypto.PubKey  `json:"public_key"`
// 	AccountNumber uint64         `json:"account_number"`
// 	Sequence      uint64         `json:"sequence"`
// }

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
let binary = Utils.toHex(codec.marshalBinary(baseAcc))
```

