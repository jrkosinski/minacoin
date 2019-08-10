package wallet 

import (
	"fmt"
	"../chain"
	"../transaction"
	"../input"
	"../output"
	"../keypair"
)

type Wallet struct {
	Chain 			*chain.Chain
	KeyPair 		keypair.KeyPair 
	Name 			string 
	Utxos			map[string]output.Output
}

func New(chain *chain.Chain, name string, keyPair *keypair.KeyPair) *Wallet {
	w := &Wallet{}
	w.Chain = chain
	if (keyPair != nil) {
		w.KeyPair = *keyPair
	} else {
		w.GenerateKeyPair()
	}
	w.Name = name
	w.Utxos = make(map[string]output.Output)
	return w 
}

func New2(chain *chain.Chain, name string) *Wallet {
	return New(chain, name, nil)
}

func (this *Wallet) GetPublicKey() string {
	return this.KeyPair.PubKeyString
}

func (this *Wallet) GetPrivateKey() string {
	return this.KeyPair.PrivKeyString
}

func (this *Wallet) GenerateKeyPair() {
	this.KeyPair = keypair.GenerateKeyPair()

	fmt.Println("new wallet key pair created: ")
	fmt.Printf("public key: " + this.GetPublicKey() + "\n")
	fmt.Printf("private key: " + this.GetPrivateKey() + "\n") 
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

func (this *Wallet) SendFunds(recip string, amount float32) *transaction.Transaction {
	if this.GetBalance() < amount {
		fmt.Println("insufficient balance")
		return nil
	}

	inputs := make([]input.Input, 0)
	var total float32 
	total = 0

    for _, v := range this.Utxos { 
		total += v.Amount
		newInput := input.Input {
			OutputId: v.Id,
		}
		inputs = append(inputs, newInput)
	}

	trans := transaction.New2(this.GetPublicKey(), recip, amount, inputs)
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
	

