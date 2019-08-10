package main 

import (
	"fmt"
	."./chain"
	."./block"
	."./wallet"
	."./transaction"
	."./output"
	//"./keypair"
)

func main() {

	/*
	kp := keypair.GenerateKeyPair()
	fmt.Println(" * * * ")
	fmt.Println(kp.PubKeyString)
	fmt.Println(" * * * ")
	fmt.Println(kp.PrivKeyString)
	*/


	//create chain
	chain := &Chain { 
		Difficulty: 10, 
	}
	chain.New(10)
	fmt.Println("Welcome to the playground!")
	fmt.Println(chain.Difficulty);

	//create wallets
	walletA := &Wallet { }
	walletA.New2(chain, "A")
	walletB := &Wallet { }
	walletB.New2(chain, "B")
	walletC := &Wallet { }
	walletC.New2(chain, "C")
	coinbase := &Wallet { }
	coinbase.New2(chain, "coinbase")

	//genesis transaction, sends 100 to walletA
	genesisTrans := &Transaction{}
	genesisTrans.New(coinbase.GetPublicKey(), coinbase.GetPrivateKey(), 1000)
	genesisTrans.GenerateSignature(coinbase.GetPrivateKey())
	genesisTrans.Id = "0"
	
	output := &Output{}
	output.New(genesisTrans.Recipient, genesisTrans.Amount, genesisTrans.Id)
	genesisTrans.Outputs = append(genesisTrans.Outputs, *output)
	chain.AddUtxo(output)

	//genesis block 
	genesisBlock := &Block{}
	genesisBlock.New("")
	genesisBlock.AddTransaction(genesisTrans, chain.Utxos)
	genesisBlock.MineBlock(chain.Difficulty)
	chain.AddBlock(genesisBlock)

	coinbase.Print()
	walletA.Print()
	walletB.Print()
	walletC.Print()
	/*

//genesis transaction, sends 100 to walletA
const genesisTrans = new Transaction(chain, coinbase.publicKey, coinbase.publicKey, 1000); 
genesisTrans.generateSignature(coinbase.privateKey); 
genesisTrans.id= '0'; 
const output = new Output(genesisTrans.recipient, genesisTrans.amount, genesisTrans.id);
genesisTrans.outputs.push(output); 
chain.addUtxo(output); 

//genesis block 
const genesisBlock = new Block(chain, null); 
genesisBlock.addTransaction(genesisTrans); 
genesisBlock.mineBlock(); 
chain.addBlock(genesisBlock); 
*/


}




