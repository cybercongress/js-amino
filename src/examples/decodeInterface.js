let {
    Codec,
    TypeFactory,
    Utils,
    Types,
    WireTypes
} = require('../index')

const fromHex = (str) => {
    let buffer = []
    for (let i = 0; i < str.length; i += 2) {
      let hex = str.slice(i, i+2)
      buffer.push(parseInt(hex, 16))
    }
    return buffer
  }

  let MsgSend = TypeFactory.create('MsgSend', [
    {
        name: "to",
        type: Types.ByteSlice
    },
    {
        name: "amount",
        type: Types.Struct
    }
])

let Coin = TypeFactory.create('Coin', [
    {
        name: "denom",
        type: Types.String
    },
    {
        name: "amount",
        type: Types.Int64
    }
])


let PubKeySecp256k1 = TypeFactory.create('PubKeySecp256k1', [{
    name: "bytes",
    type: Types.ByteSlice
} 
], Types.ByteSlice)
//signature section


let SignatureSecp256k1 = TypeFactory.create('SignatureSecp256k1', [{
    name: "bytes",
    type: Types.ByteSlice
} 
], Types.ByteSlice)

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
        type: Types.Int64
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

let BasicTx = TypeFactory.create('BasicTx', [{
    name: "msg",
    type: Types.Interface
},
{
    name: "signature",
    type: Types.Interface
},
])







let codec = new Codec()
codec.registerConcrete(new MsgSend(), "shareledger/bank/MsgSend", {})
codec.registerConcrete(new SignatureSecp256k1(), "shareledger/SigSecp256k1", {});
codec.registerConcrete(new AuthTx(), "shareledger/AuthTx", {})
codec.registerConcrete(new PubKeySecp256k1(),  "shareledger/PubSecp256k1", {})
codec.registerConcrete(new AuthSignature(),  "shareledger/AuthSig", {})
//codec.registerConcrete(new Coin(), "shareledger/Coin", {})


let hex = "b601ad0f11bb0f845234e30a0423456708130a0353485210140404138d819c3b0fd73c58d241044299acf4b6a09c36f267a8924559b59fa06c5d3e2a5dfc04e838b01546c612302a7ce101341e488e2f572cd9718314759b17e22f760b8cb2c70d9de569c4c1a117a932e622473045022100d5e86c339d791f288fb2ed3f30c8d0415774261977d9e0b9764a252abd114ad102200a7c0221953ada433e5efa72648135c60e34fabe250ecc195577f556e5b8d4fb18040404"
let bz = fromHex(hex)


let pubKey = [4,66,153,172,244,182,160,156,54,242,103,168,146,69,89,181,159,160,108,93,62,42,93,252,4,232,56,176,21,70,198,18,48,42,124,225,1,52,30,72,142,47,87,44,217,113,131,20,117,155,23,226,47,118,11,140,178,199,13,157,229,105,196,193,161]
let bzSig = [48,68,2,32,8,103,69,197,205,156,48,192,109,2,173,72,93,138,182,206,40,72,54,131,81,19,126,68,136,232,132,233,245,40,178,10,2,32,0,249,95,6,105,145,171,59,227,21,231,242,42,131,52,157,27,223,18,90,234,251,163,55,40,63,160,143,173,26,82,247]
//bzSig = [1,2,3]
//let pubKey = [4,66,153,172,244,182,160,156,54,242,103,168,146,69,89,181,159,160,108,93,62]
//let bzSig = [4,66,153,172,244,182,160,156,54,242,103,168,146,69,89,181,159,160,108,93,62,4,66,153,172,244,182,160,156,54,242,103,168,146,69,89,181,159,160,108,93,62]

let nonce = 1000
let pubSecp256k1 = new PubKeySecp256k1(pubKey)

let coin = new Coin("SHR", 10)
let msgSend = new MsgSend([ 35, 69, 103, 8 ], coin)
let signature = new SignatureSecp256k1(bzSig)
let authSig = new AuthSignature(pubSecp256k1, signature, nonce)
let authTx = new AuthTx(msgSend, authSig)




let binary = codec.marshalBinary(authTx)
//console.log("binary=", binary.toString())
//binary = [21,82,11,174,219,15,60,255,134,83,8,2,4,23,25,159,107,155,8,4,4,4]
let decodedData = new AuthTx()
//let binary = fromHex(hex)
console.log("hex encode=",Utils.toHex(binary))
console.log("binary=",binary.toString())
codec.unMarshalBinary(binary, decodedData)

console.log("Decode Data=", decodedData.JsObject())