package main

import (
	"encoding/hex"
	"fmt"

	amino "github.com/tendermint/go-amino"
)

type PubKeySecp256k1 [5]byte

func main() {

	type SubStruct struct {
		E []byte
	}

	type SubStruct3 struct {
		A string
		B int8
	}

	type SubStruct2 struct {
		A string
		B int8
		C SubStruct3
	}

	type SimpleStruct struct {
		A int8
		B []SubStruct
		C int8
		D string
		E SubStruct2
		//E PubKeySecp256k1
	}

	var cdc = amino.NewCodec()

	cdc.RegisterConcrete(SimpleStruct{}, "SimpleStruct", nil)
	cdc.RegisterConcrete(SubStruct{}, "SubStruct", nil)

	b2, _ := hex.DecodeString("424a89c4bc08c80112050a0301020312050a0302030412050a030304051802220b4a6520537569732054616e2a150a0548656c6c6f10401a0a0a05576f726c6410a001")

	var s SimpleStruct
	err := cdc.UnmarshalBinaryLengthPrefixed(b2, &s)
	if err == nil {
		fmt.Println("s=", s)
		//fmt.Println(string(s.D.E))
	} else {
		fmt.Println("decode error")
	}

}
