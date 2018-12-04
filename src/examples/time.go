package main

import (
	"fmt"
	"time"

	amino "github.com/tendermint/go-amino"
)

type TimeStruct struct {
	Time time.Time
	Str2 string `json:"str2"`
	Int  int64  `json:"int"`
}

func main() {
	var cdc = amino.NewCodec()

	cdc.RegisterConcrete(TimeStruct{}, "test/TimeStruct", nil)
	//	t1, _ := time.Parse("01 Dec 2018 00:12:00 GMT", "1970-01-01 00:00:00 +0000 GMT")
	//t1, _ := time.Parse("2006-01-02 15:04:05 +0000 UTC", "1970-01-01 00:00:01.978131102 +0000 UTC")
	/*t1 := time.Date(2018, time.December, 1, 0, 0, 0, 0, time.UTC)
	fmt.Printf("t=%v", t1)
	timeStruct1 := TimeStruct{
		Time: t1,
		//Str2: "안녕",
		//Int:  10,
	}
	println("second=", t1.Unix())
	//println("Msecond=", int32(t1.UnixNano()))

	bz, err := cdc.MarshalBinaryLengthPrefixed(timeStruct1)
	if err != nil {
		panic(err)
	}
	fmt.Println(bz)
	*/
	timeStruct2 := TimeStruct{}
	err := cdc.UnmarshalBinaryLengthPrefixed([]byte{28, 23, 189, 208, 16, 10, 6, 8, 181, 142, 230, 157, 4, 18, 11, 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 24, 244, 3}, &timeStruct2)
	if err != nil {
		panic(err)
	}
	fmt.Println(timeStruct2)
	//right value: 12 23 189 208 16 10 6 8 128 158 135 224 5
}
