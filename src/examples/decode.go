package main

import (
	"fmt"

	amino "github.com/tendermint/go-amino"
)

func main() {

	type SubStruct struct {
		A int8
	}

	type SimpleStruct struct {
		Sub SubStruct
	}

	var cdc = amino.NewCodec()

	cdc.RegisterConcrete(SimpleStruct{}, "A", nil)
	cdc.RegisterConcrete(SubStruct{}, "SubA", nil)
	/*
		s := SimpleStruct{Sub: SubStruct{A: 5}}
		b, err := cdc.MarshalBinary(s)
		if err == nil {
			fmt.Println("b=", b)
			//fmt.Println(string(s.D.E))
		} else {
			fmt.Println(err)
		}*/
	bz := []byte{13, 208, 130, 100, 211, 11, 122, 73, 208, 11, 8, 10, 4, 4}
	var s2 SimpleStruct
	cdc.UnmarshalBinary(bz, &s2)
	fmt.Println(s2)

}
