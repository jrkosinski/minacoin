package main 

import (
	"fmt"
	"./chain"
	"./block"
	"./wallet"
	"./transaction"
	"./output"
	//"./keypair"
)

//TODO: encryption
//TODO: add unit tests 
//# TODO: constructors
//TODO: link to nodejs

func main() {

	/*
	kp := keypair.GenerateKeyPair()
	fmt.Println(" * * * ")
	fmt.Println(kp.PubKeyString)
	fmt.Println(" * * * ")
	fmt.Println(kp.PrivKeyString)
	*/


	//create chain
	chain := chain.New(10)
	fmt.Println(chain.Difficulty);

	//create wallets
	walletA := wallet.New2(chain, "A")
	walletB := wallet.New2(chain, "B")
	walletC := wallet.New2(chain, "C")
	coinbase := wallet.New2(chain, "coinbase")

	//genesis transaction, sends 100 to walletA
	genesisTrans := transaction.New(coinbase.GetPublicKey(), coinbase.GetPrivateKey(), 1000)
	genesisTrans.GenerateSignature(coinbase.GetPublicKey(), coinbase.GetPrivateKey())
	genesisTrans.Id = "0"
	
	output := output.New(genesisTrans.Recipient, genesisTrans.Amount, genesisTrans.Id)
	genesisTrans.Outputs = append(genesisTrans.Outputs, *output)
	chain.AddUtxo(output)

	//genesis block 
	genesisBlock := block.New("")
	genesisBlock.AddTransaction(genesisTrans, chain.Utxos)
	genesisBlock.MineBlock(chain.Difficulty)
	chain.AddBlock(genesisBlock)

	coinbase.Print()
	walletA.Print()
	walletB.Print()
	walletC.Print()

}




