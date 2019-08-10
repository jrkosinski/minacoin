package transaction

import (
	."../input"
	."../output"
	"../hashutil"
	."../keypair"
)

type Transaction struct {
	Id 			string 
	Sender		string
	Recipient 	string 
	Amount		float32
	Signature	string
	Inputs		[]Input
	Outputs		[]Output
}

func (this *Transaction) New(from string, to string, amount float32) {
	//this.Id = nil
	this.Sender = from
	this.Recipient = to
	this.Amount = amount
	//this.Signature = nil
	this.Inputs = make([]Input, 0)
	this.Outputs = make([]Output, 0)
	//this.chain = chain
}

func (this *Transaction) New2(from string, to string, amount float32, inputs []Input) {
	this.New(from, to, amount)
	this.Inputs = inputs
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
	keyPair := new(KeyPair)
	keyPair.FromPrivateKey(privKey)
	//return keyPair.SignData(this.Sender + this.Recipient + fmt.Sprintf("%f", this.Amount))
	return make([]byte, 0)
}

//not done
func (this *Transaction) VerifySignature() bool {
	return false
}
