package main

import (
	"fmt"
	"strconv"

	"encoding/hex"
	"encoding/json"

	"github.com/btcsuite/btcd/btcec"
	amino "github.com/tendermint/go-amino"
	crypto "github.com/tendermint/go-crypto"
	cmn "github.com/tendermint/tmlibs/common"
)

type PubKeySecp256k1 [65]byte
type SignatureSecp256k1 []byte
type Address = cmn.HexBytes

//Msg Zone
type MsgSend struct {
	Nonce  int8    `json:"nonce"`
	From   Address `json:"from"`
	To     Address `json:"to"`
	Amount Coin    `json:"amount"`
}
type Msg interface {
	GetSignBytes() []byte
}

// NewMsgSend
func NewMsgSend(nonce int8, from, to Address, amt Coin) MsgSend {
	return MsgSend{nonce, from, to, amt}
}

func (msg MsgSend) GetSignBytes() []byte {
	bz, err := json.Marshal(msg)
	if err != nil {
		panic(err)
	}
	return bz
}

var _Msg = MsgSend{}

//Coin Zone
type Coin struct {
	Denom  string `json:"denom"`
	Amount int8   `json:"amount"`
}

func NewCoin(denom string, amount int8) Coin {
	return Coin{
		Denom:  denom,
		Amount: amount,
	}
}

//signature zone
type Signature interface {
}

type AuthSig struct {
	PubKey    `json:"pub_key"`
	Signature `json:"signature"`
	Nonce     int8 `json:"nonce"`
}

var _Signature = SignatureSecp256k1{}

func NewAuthSig(key PubKeySecp256k1, sig SignatureSecp256k1, nonce int8) AuthSig {
	return AuthSig{
		PubKey:    key,
		Signature: sig,
		Nonce:     nonce,
	}
}

//Transaction Zone
type AuthTx struct {
	Msg       `json:"message"`
	Signature AuthSig `json:"signature"`
}

func NewAuthTx(msg MsgSend, sig AuthSig) AuthTx {
	return AuthTx{
		Msg:       msg,
		Signature: sig,
	}
}

//public Key zone:
type PubKey interface {
}

var _ PubKey = PubKeySecp256k1{}

func main() {

	var cdc = amino.NewCodec()

	cdc.RegisterInterface((*Msg)(nil), nil)                          //need to register this interface
	cdc.RegisterConcrete(MsgSend{}, "shareledger/bank/MsgSend", nil) //MsgSend appear as an interface in bz

	//public key
	cdc.RegisterInterface((*PubKey)(nil), nil)
	cdc.RegisterConcrete(PubKeySecp256k1{}, "shareledger/PubSecp256k1", nil)

	cdc.RegisterConcrete(AuthTx{}, "shareledger/AuthTx", nil)

	cdc.RegisterInterface((*Signature)(nil), nil)
	cdc.RegisterConcrete(SignatureSecp256k1{}, "shareledger/SigSecp256k1", nil)
	cdc.RegisterConcrete(AuthSig{}, "shareledger/AuthSig", nil)

	pkBytes, _ := hex.DecodeString("ab83994cf95abe45b9d8610524b3f8f8fd023d69f79449011cb5320d2ca180c5")

	privKey_, pubKey_ := btcec.PrivKeyFromBytes(btcec.S256(), pkBytes)

	serPubKey := pubKey_.SerializeUncompressed()
	var pubKey PubKeySecp256k1

	copy(pubKey[:], serPubKey[:65])
	for i := 0; i < len(pubKey); i++ {
		fmt.Printf("%d,", pubKey[i])
	}

	fmt.Println("========================")

	msgSend := MsgSend{
		Nonce: 10,
		From:  Address([]byte("1234567")),
		To:    Address([]byte("2345678")),
		Amount: Coin{
			Denom:  "SHR",
			Amount: 10,
		},
	}

	nonce := 10

	// Signing
	signBytes := msgSend.GetSignBytes()

	signBytesWithNonce := append([]byte(strconv.Itoa(nonce)), signBytes...)
	//fmt.Println("signBytesWithNonce=", signBytesWithNonce)

	messageHash := crypto.Sha256(signBytesWithNonce)

	signature, _ := privKey_.Sign(messageHash)

	serSig := signature.Serialize()

	//fmt.Println("serSig=", serSig)

	var ecSig SignatureSecp256k1
	ecSig = append(ecSig, serSig...)
	for i := 0; i < len(ecSig); i++ {
		fmt.Printf("%d,", ecSig[i])
	}

	fmt.Println("========================")
	//fmt.Println("ecSig=", ecSig)

	shrSig := NewAuthSig(pubKey, ecSig, int8(nonce))
	//bzSig, _ := cdc.MarshalBinary(shrSig)
	//fmt.Println("bzSig=", bzSig)

	tx := NewAuthTx(msgSend, shrSig)
	bz, _ := cdc.MarshalBinaryLengthPrefixed(tx)
	fmt.Println("bz=", bz)

	bzJs := []byte{193, 1, 173, 15, 17, 189, 10, 33, 132, 82, 52, 230, 8, 20, 18, 7, 49, 50, 51, 52, 53, 54, 55, 26, 7, 50, 51, 52, 53, 54, 55, 56, 34, 7, 10, 3, 83, 72, 82, 16, 20, 18, 151, 1, 10, 70, 215, 60, 88, 212, 65, 4, 66, 153, 172, 244, 182, 160, 156, 54, 242, 103, 168, 146, 69, 89, 181, 159, 160, 108, 93, 62, 42, 93, 252, 4, 232, 56, 176, 21, 70, 198, 18, 48, 42, 124, 225, 1, 52, 30, 72, 142, 47, 87, 44, 217, 113, 131, 20, 117, 155, 23, 226, 47, 118, 11, 140, 178, 199, 13, 157, 229, 105, 196, 193, 161, 18, 75, 169, 50, 230, 39, 70, 48, 68, 2, 32, 101, 18, 119, 62, 51, 82, 180, 164, 154, 248, 72, 19, 153, 166, 116, 53, 130, 231, 180, 222, 146, 201, 186, 161, 93, 216, 194, 52, 71, 171, 218, 0, 2, 32, 98, 57, 131, 172, 45, 35, 92, 168, 70, 177, 10, 180, 179, 33, 11, 134, 40, 229, 60, 88, 37, 11, 117, 116, 155, 131, 146, 103, 236, 176, 53, 106, 24, 20}
	//fmt.Println(bytes.Equal(bz, bzJs))
	/* bzPub, _ := cdc.MarshalBinaryLengthPrefixed(pubKey)
	fmt.Println("BzpubKey=", bzPub)
	pubKey2 := []byte{70, 215, 60, 88, 210, 65, 4, 66, 153, 172, 244, 182, 160, 156, 54, 242, 103, 168, 146, 69, 89, 181, 159, 160, 108, 93, 62, 42, 93, 252, 4, 232, 56, 176, 21, 70,
		198, 18, 48, 42, 124, 225, 1, 52, 30, 72, 142, 47, 87, 44, 217, 113, 131, 20, 117, 155, 23, 226, 47, 118, 11, 140, 178, 199, 13, 157, 229, 105, 196, 193, 161}
	fmt.Println(string(bzPub) == string(pubKey2)) */

	var newTx AuthTx
	err := cdc.UnmarshalBinaryLengthPrefixed(bzJs, &newTx)
	if err == nil {
		fmt.Println("newTx=", newTx)
	} else {
		fmt.Println(err.Error())
	}

}
