[![Coverage Status](https://coveralls.io/repos/github/cybercongress/js-amino/badge.svg)](https://coveralls.io/github/cybercongress/js-amino)
[![All Contributors](https://img.shields.io/badge/all_contributors-7-orange.svg?style=flat-square)](#contributors)

# An Implementation of Amino in Javascript and TypeScript

For more information spec, please refer: https://github.com/tendermint/go-amino

## Install From NPM:
Run `npm i js-amino`

## Install From Source

1. Run `npm install`

## Running The Examples

1. `cd src/examples`
2. `go get`
3. Run examples, e. g. in Go: `go run string.go` and in JS `node string.js`

## Running The Unit Test

1. Run `npm test`

## Features:
1. Encode and Decode simple types: int8,int16,int32,int64
2. Encode and Decode recursive Struct and Interface
3. Encode simple Time data

## Todo:
1. Full support for Time encoding and decoding
2. Add more Unit test
3. Benchmark

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

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://github.com/Thunnini"><img src="https://avatars2.githubusercontent.com/u/16339680?v=4" width="100px;" alt="JungHwan Tony Yun"/><br /><sub><b>JungHwan Tony Yun</b></sub></a><br /><a href="https://github.com/cybercongress/js-amino/commits?author=Thunnini" title="Code">💻</a></td><td align="center"><a href="https://www.linkedin.com/in/do-ngoc-tan-64260072/"><img src="https://avatars3.githubusercontent.com/u/8816061?v=4" width="100px;" alt="TanNgocDo"/><br /><sub><b>TanNgocDo</b></sub></a><br /><a href="https://github.com/cybercongress/js-amino/commits?author=TanNgocDo" title="Code">💻</a> <a href="#maintenance-TanNgocDo" title="Maintenance">🚧</a></td><td align="center"><a href="https://github.com/philipstanislaus"><img src="https://avatars1.githubusercontent.com/u/6912756?v=4" width="100px;" alt="philipstanislaus"/><br /><sub><b>philipstanislaus</b></sub></a><br /><a href="https://github.com/cybercongress/js-amino/commits?author=philipstanislaus" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/SaveTheAles"><img src="https://avatars0.githubusercontent.com/u/36516972?v=4" width="100px;" alt="Ales Puchilo"/><br /><sub><b>Ales Puchilo</b></sub></a><br /><a href="#projectManagement-SaveTheAles" title="Project Management">📆</a></td><td align="center"><a href="https://github.com/litvintech"><img src="https://avatars2.githubusercontent.com/u/1690657?v=4" width="100px;" alt="Valery Litvin"/><br /><sub><b>Valery Litvin</b></sub></a><br /><a href="https://github.com/cybercongress/js-amino/commits?author=litvintech" title="Code">💻</a></td><td align="center"><a href="https://github.com/cyberadmin"><img src="https://avatars1.githubusercontent.com/u/36439031?v=4" width="100px;" alt="Cyber Admin"/><br /><sub><b>Cyber Admin</b></sub></a><br /><a href="https://github.com/cybercongress/js-amino/commits?author=cyberadmin" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/ethanfrey"><img src="https://avatars3.githubusercontent.com/u/5689864?v=4" width="100px;" alt="Ethan Frey"/><br /><sub><b>Ethan Frey</b></sub></a><br /><a href="https://github.com/cybercongress/js-amino/commits?author=ethanfrey" title="Tests">⚠️</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!