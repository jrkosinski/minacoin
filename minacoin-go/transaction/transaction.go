package transaction

import (
	"fmt"
	"../input"
	"../output"
	"../hashutil"
	//"../keypair"
)

type Transaction struct {
	Id 			string 
	Sender		string
	Recipient 	string 
	Amount		float32
	Signature	string
	Inputs		[]input.Input
	Outputs		[]output.Output
}

func New(from string, to string, amount float32) *Transaction {
	trans := &Transaction {
		Sender: from,
		Recipient: to, 
		Amount: amount,
		Inputs: make([]input.Input, 0),
		Outputs: make([]output.Output, 0),
	}
	return trans
}

func New2(from string, to string, amount float32, inputs []input.Input) *Transaction {
	trans := New(from, to, amount)
	trans.Inputs = inputs
	return trans
}

func (this *Transaction) GetInputsValue() float32 {
	var output float32
	output = 0.0
	for _, v := range this.Inputs { 
		//if v.Utxo != nil {
			output += v.Utxo.Amount 
		//}
	}
	
	return output;
}

func (this *Transaction) GetOutputsValue() float32 {
	var output float32
	output = 0.0
	for _, v := range this.Outputs { 
		output += v.Amount 
	}
	
	return output;
}

func (this *Transaction) CalculateHash() string {
	return hashutil.GenerateHash3(this.Sender, this.Recipient, this.Amount)
}

//partially done
func (this *Transaction) GenerateSignature(privKey string) []byte {
	//keyPair := new(keypair.KeyPair)
	//keyPair.FromPrivateKey(privKey)

	fmt.Println("\n\n* New Signed Trans *")
	fmt.Println("sender: " + this.Sender)
	fmt.Println("recip: " + this.Recipient)
	fmt.Printf("amount: %f\n", this.Amount)

	//return keyPair.SignData(this.Sender + this.Recipient + fmt.Sprintf("%f", this.Amount))
	return make([]byte, 0)
}

//not done
func (this *Transaction) VerifySignature() bool {
	return false
}
