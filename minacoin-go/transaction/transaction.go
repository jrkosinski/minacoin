package transaction

import (
	."../input"
	."../output"
)

type Transaction struct {
	Id 			string 
	Sender		string
	Recipient 	string 
	Amount		float32
	Signature	string
	Inputs		[]Input
	Outputs		[]Output
	//Chain		Chain
}

//DONE
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

//DONE
func (this *Transaction) New2(from string, to string, amount float32, inputs []Input) {
	this.New(from, to, amount)
	this.Inputs = inputs
}

//DONE
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

//DONE
func (this *Transaction) GetOutputsValue() float32 {
	var output float32
	output = 0.0
	for _, v := range this.Outputs { 
		output += v.Amount 
	}
	
	return output;
}

//not done
func (this *Transaction) CalculateHash() string {
	return ""
}

//not done
func (this *Transaction) GenerateSignature(privKey string) string {
	return ""
}

//not done
func (this *Transaction) VerifySignature() bool {
	return false
}

//not done
func (this *Transaction) Process() bool {
	return false
}