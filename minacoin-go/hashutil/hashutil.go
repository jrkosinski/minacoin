package hashutil

import (
	"fmt"
	"crypto/sha256"
	"strconv"
	"encoding/hex"
)

func GenerateHash(prevHash string, merkleRoot string, nonce int, timestamp int64) string {
	s := prevHash + merkleRoot + strconv.Itoa(nonce) + strconv.FormatInt(timestamp, 10)
	return GenerateHashFromString(s)
}

func GenerateHash2(recip string, amount float32, parentId string) string {
	s := recip + fmt.Sprintf("%f", amount) + parentId
	return GenerateHashFromString(s)
}

func GenerateHash3(sender string, recip string, amount float32) string {
	s := sender + recip + fmt.Sprintf("%f", amount)
	return GenerateHashFromString(s)
}

func GenerateHashFromString(data string) string {
    h := sha256.New()
    h.Write([]byte(data))
    return hex.EncodeToString(h.Sum(nil))
}