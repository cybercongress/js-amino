package test

import (
	"encoding/hex"
	"fmt"

	"github.com/tendermint/go-amino"
)

type FixedInt struct {
	Int32 int32 `binary:"fixed32"`
	Int64 int64 `binary:"fixed64"`
}

func PrintPrimitive() {
	cdc := amino.NewCodec()

	bz := cdc.MustMarshalBinaryLengthPrefixed(int8(123))
	fmt.Println("Encode int8(123)", hex.EncodeToString(bz))

	bz = cdc.MustMarshalBinaryLengthPrefixed(int16(12345))
	fmt.Println("Encode int16(12345)", hex.EncodeToString(bz))

	bz = cdc.MustMarshalBinaryLengthPrefixed(int32(1234567))
	fmt.Println("Encode int32(1234567)", hex.EncodeToString(bz))

	bz = cdc.MustMarshalBinaryLengthPrefixed(int64(123456789))
	fmt.Println("Encode int64(123456789)", hex.EncodeToString(bz))

	bz = cdc.MustMarshalBinaryLengthPrefixed("teststring유니코드")
	fmt.Println("Encode string(teststring유니코드)", hex.EncodeToString(bz))

	bz = cdc.MustMarshalBinaryLengthPrefixed(FixedInt{
		Int32: 1234567,
		Int64: 123456789,
	})
	fmt.Println(`FixedInt{
	Int32(fixed32): 1234567,
	Int64(fixed64):123456789,
}`, hex.EncodeToString(bz))
}
