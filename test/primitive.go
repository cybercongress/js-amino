package test

import (
	"encoding/hex"
	"fmt"

	"github.com/tendermint/go-amino"
)

func PrintPrimitive() {
	fmt.Println("test")

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
}
