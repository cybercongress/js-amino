package test

import (
	"encoding/hex"
	"fmt"

	"github.com/tendermint/go-amino"
)

type SimpleStruct struct {
	Int8  int8
	Int16 int16
	Int32 int32
	Int64 int64
	Str   string
}

func PrintStruct() {
	cdc := amino.NewCodec()

	simpleStruct := SimpleStruct{
		Int8:  123,
		Int16: 12345,
		Int32: 1234567,
		Int64: 123456789,
		Str:   "teststring유니코드",
	}
	cdc.RegisterConcrete(SimpleStruct{}, "SimpleStruct", nil)

	bz := cdc.MustMarshalBinaryLengthPrefixed(simpleStruct)
	fmt.Println(`SimpleStruct{
	Int8:  123,
	Int16: 12345,
	Int32: 1234567,
	Int64: 123456789,
	Str:   "teststring유니코드",
}`, hex.EncodeToString(bz))
}
