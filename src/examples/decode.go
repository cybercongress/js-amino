package main

import (
	"encoding/hex"
	"fmt"

	amino "github.com/tendermint/go-amino"
)

func main() {

	type SubB struct {
		C string
	}

	type SubA struct {
		Str string
		B   int8
		C   SubB
	}

	type A struct {
		Str1 string
		Num1 int8
		Sub  SubA
	}

	var cdc = amino.NewCodec()

	cdc.RegisterConcrete(A{}, "A", nil)
	cdc.RegisterConcrete(SubA{}, "SubA", nil)
	cdc.RegisterConcrete(SubB{}, "SubB", nil)
	/*
		s := SimpleStruct{Sub: SubStruct{A: 5}}
		b, err := cdc.MarshalBinary(s)
		if err == nil {
			fmt.Println("b=", b)
			//fmt.Println(string(s.D.E))
		} else {
			fmt.Println(err)
		}*/
	bz, _ := hex.DecodeString("34d08264d30a0354616e105a1b7a49d00b0a0b48656c6c6f20576f726c64100a1bdb8a5de30a0b446f204e676f632054616e040404")
	var s2 A
	cdc.UnmarshalBinary(bz, &s2)
	fmt.Println(s2)

}
