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

func New(recip string, amount float32, parentId string) *Output {
	output := &Output{
		Id: hashutil.GenerateHash2(recip, amount, parentId),
		Recipient: recip,
		Amount: amount, 
		ParentTransId: parentId,
	}
	return output
}