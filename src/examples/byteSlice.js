let {
    Codec,
    TypeFactory,
    Utils,
    Types,
    WireTypes
} = require('../index')
let PubSecp256k1 = TypeFactory.create('PubSecp256k1', [{
    name: "a",
    type: Types.ByteSlice
}], Types.ByteSlice)

let Signature = TypeFactory.create('Signature', [{
    name: "a",
    type: Types.ByteSlice
}], Types.ByteSlice)

let MsgSend = TypeFactory.create('MsgSend', [{
    name: "nonce",
    type: Types.Int8
},
{
    name: "from",
    type: Types.String
},
{
    name: "to",
    type: Types.String
},
{
    name: "amount",
    type: Types.Struct
}
])

let Coin = TypeFactory.create('Coin', [{
    name: "denom",
    type: Types.String
},
{
    name: "amount",
    type: Types.Int8
}
])

let AuthSignature = TypeFactory.create('AuthSignature', [{
    name: "pubKey",
    type: Types.Interface
},
{
    name: "signature",
    type: Types.Interface
},
{
    name: "nonce",
    type: Types.Int8
}
])

let AuthTx = TypeFactory.create('AuthTx', [{
    name: "msg",
    type: Types.Interface
},
{
    name: "signature",
    type: Types.Struct
}
])

let codec = new Codec()
codec.registerConcrete(new PubSecp256k1(), "shareledger/PubSecp256k1", {})
codec.registerConcrete(new Signature(), "shareledger/SigSecp256k1", {})
codec.registerConcrete(new MsgSend(), "shareledger/bank/MsgSend", {})
codec.registerConcrete(new AuthSignature(), "shareledger/AuthSig", {})
codec.registerConcrete(new AuthTx(), "shareledger/AuthTx", {})

let pubKey = [4,66,153,172,244,182,160,156,54,242,103,168,146,69,89,181,159,160,108,93,62,42,93,252,4,
    232,56,176,21,70,198,18,48,42,124,225,1,52,30,72,142,47,87,44,217,113,131,20,117,155,23,226,47,118,
    11,140,178,199,13,157,229,105,196,193,161
]

let sig = [48,68,2,32,101,18,119,62,51,82,180,164,154,248,72,19,153,166,116,53,130,231,180,222,146,201,
    186,161,93,216,194,52,71,171,218,0,2,32,98,57,131,172,45,35,92,168,70,177,10,180,179,33,11,134,40,
    229,60,88,37,11,117,116,155,131,146,103,236,176,53,106
]
let nonce = 10
let pubSecp256k1 = new PubSecp256k1(pubKey)
let signature = new Signature(sig)
let coin = new Coin('SHR',10)
let msgSend = new MsgSend(nonce,"1234567","2345678",coin)
let authSig = new AuthSignature(pubSecp256k1,signature,nonce)
let authTx = new AuthTx(msgSend,authSig)

let binary = codec.marshalBinary(authTx)
console.log("length=",binary.length)

let decodedData = new AuthTx()
//let binary = fromHex(hex)
console.log("encode=",Utils.toHex(binary))
codec.unMarshalBinary(binary, decodedData)

//console.log(binary.toString())