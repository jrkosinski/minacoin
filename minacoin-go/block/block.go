package block

import (
	"fmt"
	"strings"
	"time"
	"../hashutil"
	."../transaction"
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

//DONE
func (this *Block) CalculateHash() string {
	return hashutil.GenerateHash(this.PrevHash, this.MerkleRoot, this.Nonce, this.Timestamp)
}

//DONE
func (this *Block) AddTransaction(t *Transaction) bool {
	output := true 

	if t != nil {
		if len(this.PrevHash) > 0 {
			if !t.Process() {
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
	/*
            let output = true; 

            if (transaction) {
                //exclude genesis block
                if (this.prevHash) {
                    if (!transaction.process()) {
                        console.log('transaction failed to process; discarding'); 
                        output = false;
                    }
                }
            }
            else 
                output = false;

            if (output) {
                this.transactions.push(transaction); 
                console.log('successfully added transaction');                 
            }

            return output; 
			*/
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

//DONE
func (this *Block) IsMined(difficulty int) bool {
	return strings.Count(this.Hash, "0") == difficulty
}