package main

import (
	"fmt"

	amino "github.com/tendermint/go-amino"
)

type StrStruct struct {
	Str1 string `json:"str1"`
	Str2 string `json:"str2"`
	Int  int8   `json:"int"`
}

func main() {
	var cdc = amino.NewCodec()

	cdc.RegisterConcrete(StrStruct{}, "test/StrStruct", nil)

	strStruct := StrStruct{
		Str1: "ascii",
		Str2: "안녕",
		Int:  10,
	}

	bz, err := cdc.MarshalBinaryLengthPrefixed(strStruct)
	if err != nil {
		panic(err)
	}
	fmt.Println(bz)

	strStruct2 := StrStruct{}
	err = cdc.UnmarshalBinaryLengthPrefixed([]byte{21, 56, 46, 110, 101, 10, 5, 97, 115, 99, 105, 105, 18, 6, 236, 149, 136, 235, 133, 149, 24, 20}, &strStruct2)
	if err != nil {
		panic(err)
	}
	fmt.Println(strStruct.Str1 == strStruct2.Str1 && strStruct.Str2 == strStruct2.Str2 && strStruct.Int == strStruct2.Int)
}
