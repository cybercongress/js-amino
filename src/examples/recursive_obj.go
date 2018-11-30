package main

import (
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

	b2 := []byte{66, 74, 137, 196, 188, 8, 200, 1, 18, 5, 10, 3, 1, 2, 3, 18, 5, 10, 3, 2, 3, 4, 18, 5, 10, 3, 3, 4, 5, 24, 2, 34, 11, 74, 101, 32, 83, 117, 105, 115, 32, 84, 97, 110, 42, 21, 10, 5, 72, 101, 108, 108, 111, 16, 64, 26, 10, 10, 5, 87, 111, 114, 108, 100, 16, 160, 1}

	var s SimpleStruct
	err := cdc.UnmarshalBinaryLengthPrefixed(b2, &s)
	if err == nil {
		fmt.Println("s=", s)
		//fmt.Println(string(s.D.E))
	} else {
		fmt.Println("decode error")
	}

}
