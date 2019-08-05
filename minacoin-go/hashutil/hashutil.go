package hashutil

import (
	"fmt"
	"crypto/sha256"
	"strconv"
	"encoding/hex"
)

func GenerateHash(prevHash string, merkleRoot string, nonce int, timestamp int64) string {
	s := prevHash + merkleRoot + strconv.Itoa(nonce) + strconv.FormatInt(timestamp, 10)
    h := sha256.New()
    h.Write([]byte(s))
    return hex.EncodeToString(h.Sum(nil))
}

func GenerateHash2(recip string, amount float32, parentId string) string {
	s := recip + fmt.Sprintf("%f", amount) + parentId
    h := sha256.New()
    h.Write([]byte(s))
    return hex.EncodeToString(h.Sum(nil))
}