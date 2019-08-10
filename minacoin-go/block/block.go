package block

import (
	"fmt"
	"strings"
	"time"
	"../hashutil"
	."../transaction"
	."../utxomap"
	."../output"
)

type Block struct {
	Hash 			string
	PrevHash		string
	MerkleRoot		string
	Nonce			int
	Transactions 	[]Transaction
	Timestamp 		int64
}

func (this *Block) New(prevHash string) {
	this.PrevHash = prevHash
	this.Nonce = 0
	this.Transactions = make([]Transaction, 0)
	this.Timestamp = time.Now().Unix()

	this.Hash = this.CalculateHash(); 
}

func (this *Block) CalculateHash() string {
	return hashutil.GenerateHash(this.PrevHash, this.MerkleRoot, this.Nonce, this.Timestamp)
}

func (this *Block) ProcessTransaction(t *Transaction, utxos *UtxoMap) bool {

	if !t.VerifySignature() {
		fmt.Println("failed to verify transaction signature")
		return false
	}
			
	for k, v := range t.Inputs { 
		t.Inputs[k].Utxo = utxos.Get(v.OutputId)
	}
	
	inputsTotal := t.GetInputsValue()
	remainBalance := inputsTotal - t.Amount
	t.Id = t.CalculateHash()

	//output for the recipient is the trans amount 
	ro := new(Output)
	ro.New(t.Recipient, t.Amount, t.Id)
	t.Outputs = append(t.Outputs, *ro)
	
	//output for the sender is the remaining balance 
	so := new(Output)
	ro.New(t.Sender, remainBalance, t.Id)
	t.Outputs = append(t.Outputs, *so)

	//add outputs to Unspent list
	for _, v := range t.Outputs { 
		utxos.Add(&v)
	}

	//remove transaction inputs from UTXO lists as spent:
	for _, v := range t.Inputs { 
		utxos.Remove(v.OutputId)
	}

	return true; 
}

func (this *Block) AddTransaction(t *Transaction, utxos *UtxoMap) bool {
	output := true 

	if t != nil {
		if len(this.PrevHash) > 0 {
			if !this.ProcessTransaction(t, utxos) {
				output = false
			} 
		} 
	} else {
		output = false
	}

	if output {
		this.Transactions = append(this.Transactions, *t);
	}

	return output 
}

//partially done
func (this *Block) MineBlock(difficulty int) {
	//this.merkleRoot = merkle.getMerkleRoot(this.transactions); 

	for strings.Count(this.Hash, "0") != difficulty {
		this.Nonce++
		this.Hash = this.CalculateHash()
	}

	fmt.Printf("Block mined! %s\n", this.Hash);
}

func (this *Block) IsMined(difficulty int) bool {
	return strings.Count(this.Hash, "0") == difficulty
}