package wallet 

import (
	"fmt"
	."../chain"
	."../transaction"
	."../input"
	."../output"
	."../keypair"
)

type Wallet struct {
	Chain 			*Chain
	KeyPair 		KeyPair 
	Name 			string 
	Utxos			map[string]Output
}


func (this *Wallet) New(chain *Chain, name string, keyPair *KeyPair) {
	this.Chain = chain
	if (keyPair != nil) {
		this.KeyPair = *keyPair
	}
	this.Name = name
	this.Utxos = make(map[string]Output)
}

func (this *Wallet) New2(chain *Chain, name string) {
	this.New(chain, name, nil)
	this.GenerateKeyPair()
}

func (this *Wallet) GetPublicKey() string {
	return this.KeyPair.PubKeyString
}

func (this *Wallet) GetPrivateKey() string {
	return this.KeyPair.PrivKeyString
}

func (this *Wallet) GenerateKeyPair() {
	this.KeyPair = GenerateKeyPair()

	fmt.Println("new wallet key pair created: ")
	fmt.Printf("public key: %s\n" + this.GetPublicKey())
	fmt.Printf("private key: %s\n" + this.GetPrivateKey()) 
}

func (this *Wallet) GetBalance() float32 {
	var total float32
	total = 0

    for k, v := range this.Chain.Utxos.Map { 
		if v.Recipient == this.GetPublicKey() {
			this.Utxos[k] = v
			total += v.Amount
		}
	}

	return total
}

func (this *Wallet) SendFunds(recip string, amount float32) *Transaction {
	if this.GetBalance() < amount {
		fmt.Println("insufficient balance")
		return nil
	}

	inputs := make([]Input, 0)
	var total float32 
	total = 0

    for _, v := range this.Utxos { 
		total += v.Amount
		newInput := Input {
			OutputId: v.Id,
		}
		inputs = append(inputs, newInput)
	}

	trans := &Transaction {}
	trans.New2(this.GetPublicKey(), recip, amount, inputs)
	trans.GenerateSignature(this.GetPrivateKey())

	//remove spent inputs
    for _, v := range inputs { 
		delete(this.Utxos, v.OutputId)
	}

	return trans
}

func (this *Wallet) Print() {
	fmt.Printf("* wallet '%s'\n", this.Name)
	fmt.Printf("public %s\n", this.GetPublicKey())
	fmt.Printf("private %s\n", this.GetPrivateKey())
	fmt.Printf("balance: %f\n", this.GetBalance())
}
	

