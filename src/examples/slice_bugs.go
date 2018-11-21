package main

import (
	"encoding/hex"
	"fmt"

	//	codec "github.com/cosmos/cosmos-sdk/codec"

	codec "github.com/tendermint/go-amino"

	//	"github.com/cosmos/cosmos-sdk/x/auth"
	//	"github.com/cosmos/cosmos-sdk/x/bank"
	crypto "github.com/tendermint/tendermint/crypto"
	"github.com/tendermint/tendermint/crypto/secp256k1"
)

//Msg Zone
type MsgSend struct {
	Nonce int8 `json:"nonce"`
}
type Msg interface {
	GetSignBytes() []byte
}

var _Msg = MsgSend{}

// NewMsgSend
func NewMsgSend(nonce int8) MsgSend {
	return MsgSend{nonce}
}

func (msg MsgSend) GetSignBytes() []byte {
	/* bz, err := json.Marshal(msg)
	if err != nil {
		panic(err)
	} */
	return []byte{}
}

// Standard Signature
type StdSignature struct {
	crypto.PubKey `json:"pub_key"` // optional
	Signature     []byte           `json:"signature"`
	AccountNumber int8             `json:"account_number"`
	Sequence      int64            `json:"sequence"`
}

type StdTx struct {
	Msgs []Msg `json:"msg"`
	//Fee        StdFee         `json:"fee"`
	Signatures []StdSignature `json:"signatures"`
	Memo       string         `json:"memo"`
}

func main() {
	var cdc = codec.NewCodec()

	cdc.RegisterInterface((*crypto.PubKey)(nil), nil)
	cdc.RegisterInterface((*Msg)(nil), nil)
	cdc.RegisterConcrete(secp256k1.PubKeySecp256k1{},
		"tendermint/PubKeySecp256k1", nil)
	cdc.RegisterConcrete(MsgSend{},
		"bank/MsgSend", nil)

	cdc.RegisterConcrete(StdTx{}, "auth/StdTx", nil)

	//sdk.RegisterCodec(cdc)
	//bank.RegisterCodec(cdc)
	//auth.RegisterCodec(cdc)
	/*
		txEncoding := StdTx{Msgs: []Msg{MsgSend{Nonce: 1}}}

		bz, err := cdc.MarshalBinaryLengthPrefixed(txEncoding)
		if err == nil {
			fmt.Println("encode:", hex.EncodeToString(bz))
		} else {
			fmt.Println(err.Error())
		}*/

	//json, _ := cdc.MarshalJSON(stdTx)
	//fmt.Println(string(json))

	encodedBz, _ := hex.DecodeString("45f0625dee0a06c47602bf080212310a26eb5ae9872102745e346835ef675e880413ed29303e9e41cff37079525868ae986ee613b3f5421203010203180020001a0474657374")
	var tx StdTx
	err2 := cdc.UnmarshalBinaryLengthPrefixed(encodedBz, &tx)
	if err2 == nil {
		fmt.Println("newTx=", tx)
	} else {
		fmt.Println(err2.Error())
	}
}
