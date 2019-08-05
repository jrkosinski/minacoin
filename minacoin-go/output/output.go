package output

import (
	"../hashutil"
)

type Output struct {
	Id 				string 
	Recipient 		string 
	Amount 			float32
	ParentTransId 	string 
}

func (this *Output) New(recip string, amount float32, parentId string) {
	this.Id = hashutil.GenerateHash2(recip, amount, parentId)
	this.Recipient = recip 
	this.Amount = amount 
	this.ParentTransId = parentId
}