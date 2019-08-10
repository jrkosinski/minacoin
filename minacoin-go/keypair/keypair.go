package keypair 

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/md5"
	"crypto/rand"
	"fmt"
	"hash"
	"io"
	"math/big"
	"os"
)

type KeyPair struct {
	PublicKey 		ecdsa.PublicKey
	PrivateKey 		ecdsa.PrivateKey
	PubKeyString	string
	PrivKeyString	string
}


func GenerateKeyPair() KeyPair {
	pubkeyCurve := elliptic.P256() //see http://golang.org/pkg/crypto/elliptic/#P256

	privatekey := new(ecdsa.PrivateKey)
	privatekey, err := ecdsa.GenerateKey(pubkeyCurve, rand.Reader) // this generates a public & private key pair

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	var pubkey ecdsa.PublicKey
	pubkey = privatekey.PublicKey

	fmt.Println("Private Key :")
	fmt.Printf("%x \n", privatekey)

	fmt.Println("Public Key :")
	fmt.Printf("%x \n", pubkey)

	output := KeyPair {
		PublicKey: pubkey,
		PrivateKey: *privatekey,
		PubKeyString: fmt.Sprintf("%x %x", pubkey.X.Bytes(), pubkey.Y.Bytes()),
		PrivKeyString: fmt.Sprintf("%x", privatekey.D.Bytes()),
	}

	return output
}

func (this *KeyPair) FromPrivateKey(privateKey string) {

}

//not done 
func (this *KeyPair) Verify(signature []byte) bool {
	return false
	//verifystatus := ecdsa.Verify(&pubkey, signhash, r, s)
	//fmt.Println(verifystatus) // should be true
	//return verifystatus
}

func (this *KeyPair) SignData(data string) []byte {
	var h hash.Hash
	h = md5.New()
	r := big.NewInt(0)
	s := big.NewInt(0)

	io.WriteString(h, data)
	signhash := h.Sum(nil)

	r, s, serr := ecdsa.Sign(rand.Reader, &this.PrivateKey, signhash)
	if serr != nil {
		os.Exit(1)
	}

	signature := r.Bytes()
	signature = append(signature, s.Bytes()...)

	fmt.Printf("Signature : %x\n", signature)
	return signature
}
