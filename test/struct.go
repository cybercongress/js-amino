package test

import (
	"encoding/hex"
	"fmt"

	"github.com/tendermint/go-amino"
)

type Struct interface {
	A()
}

type SimpleStruct struct {
	Int8  int8
	Int16 int16
	Int32 int32
	Int64 int64
	Str   string
}

func (s SimpleStruct) A() {}

type SimpleStruct2 struct {
	Str string
}

func (s SimpleStruct2) A() {}

func PrintStruct() {
	cdc := amino.NewCodec()

	simpleStruct := SimpleStruct{
		Int8:  123,
		Int16: 12345,
		Int32: 1234567,
		Int64: 123456789,
		Str:   "teststring유니코드",
	}
	cdc.RegisterInterface((*Struct)(nil), nil)
	cdc.RegisterConcrete(SimpleStruct{}, "SimpleStruct", nil)
	cdc.RegisterConcrete(SimpleStruct2{}, "SimpleStruct2", nil)

	bz := cdc.MustMarshalBinaryLengthPrefixed(simpleStruct)
	fmt.Println(`SimpleStruct{
	Int8:  123,
	Int16: 12345,
	Int32: 1234567,
	Int64: 123456789,
	Str:   "teststring유니코드",
}`, hex.EncodeToString(bz))

	simpleStruct2 := SimpleStruct2{
		Str: "test",
	}
	simpleStruct2.Str = "test"
	arrayInterface := make([]Struct, 0)
	arrayInterface = append(arrayInterface, simpleStruct, simpleStruct2)
	bz = cdc.MustMarshalBinaryLengthPrefixed(arrayInterface)
	fmt.Println(`[]Struct{
	SimpleStruct{
		Int8:  123,
		Int16: 12345,
		Int32: 1234567,
		Int64: 123456789,
		Str:   "teststring유니코드",
	},
	SimpleStruct2{
		Str:   "test",
	}
}`, hex.EncodeToString(bz))
}
