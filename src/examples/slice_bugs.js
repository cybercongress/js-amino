
const {
    Codec,
    FieldOtions,
    TypeFactory,
    Utils,
    Types,
    WireTypes,
  } = require('../index')
  
  

  
  
  let codec = new Codec()
  
  /*
  type StdTx struct {
  Msgs       []sdk.Msg      `json:"msg"`
  Fee        StdFee         `json:"fee"`
  Signatures []StdSignature `json:"signatures"`
  Memo       string         `json:"memo"`
  }
  cdc.RegisterConcrete(StdTx{}, "auth/StdTx", nil)
  */
  
  let StdTx = TypeFactory.create('StdTx', [
    {
      name: 'msg',
      type: Types.ArrayInterface,
    },/*,
    {
      name: 'fee',
      type: Types.Struct,
    },*/
    {
      name: 'signatures',
      type: Types.ArrayStruct,
    },
    {
      name: 'memo',
      type: Types.String,
    },
  ])

  let MsgSend = TypeFactory.create('MsgSend', [{
    name: "nonce",
    type: Types.Int8
}])
  
  let PubKeySecp256k1 = TypeFactory.create('PubKeySecp256k1', [
    {
      name: 's',
      type: Types.ByteSlice,
    }
  ], Types.ByteSlice)
  
  let Signature = TypeFactory.create('signature', [
    {
      name: 'pub_key',
      type: Types.Interface,
    },
    {
      name: 'signature',
      type: Types.ByteSlice,
    },
    {
      name: 'account_number',
      type: Types.Int8,
    },
    {
      name: 'sequence',
      type: Types.Int64,
    }
  ])
  
  let Coin = TypeFactory.create('coin', [
    {
      name: 'denom',
      type: Types.String,
    },
    {
      name: 'amount',
      type: Types.Int8,
    }
  ])
  
  let Fee = TypeFactory.create('fee', [
    {
      name: 'amount',
      type: Types.ArrayStruct,
    },
    {
      name: 'gas',
      type: Types.Int8,
    }
  ])
  
  let Output = TypeFactory.create('output', [
    {
      name: 'address',
      type: Types.ByteSlice,
    },
    {
      name: 'coins',
      type: Types.ArrayStruct,
    }
  ])
  
  let IssueMsg = TypeFactory.create('cosmos-sdk/Issue', [
    {
      name: 'banker',
      type: Types.ByteSlice,
    },
    {
      name: 'outputs',
      type: Types.ArrayStruct,
    }
  ])
  
  codec.registerConcrete(new StdTx(), 'auth/StdTx', {})
  codec.registerConcrete(new MsgSend(), 'bank/MsgSend', {})
  codec.registerConcrete(new IssueMsg(), 'cosmos-sdk/Issue', {}) //c06abad6
  codec.registerConcrete(new PubKeySecp256k1(), 'tendermint/PubKeySecp256k1', {}) //eb5ae987
  let issueMsg = new IssueMsg([0], [new Output([0], [new Coin('test', 10000)])])
  let sendMsg = new MsgSend(1)
  let fee = new Fee(new Coin('test', 0), 200000)
  let sig = new Signature(
    new PubKeySecp256k1(Utils.fromHex('02745e346835ef675e880413ed29303e9e41cff37079525868ae986ee613b3f542')),
    [1,2,3],
    0,
    0)
  
  let stdTx = new StdTx([sendMsg], /*fee,*/ [sig], 'test')
  let binary = codec.marshalBinary(stdTx)
  console.log(Utils.toHex(binary))
  //let json = codec.marshalJson(stdTx)
  //console.log(json)

  /*let stdTx2 = new StdTx()
  codec.unMarshalJson(json, stdTx2)
  console.log(stdTx2)*/
  