'use strict'; 

const Chain = require('./classes/Chain'); 
const Block = require('./classes/Block'); 
const Wallet = require('./classes/Wallet'); 
const Transaction = require('./classes/Transaction'); 
const Output = require('./classes/Output'); 
const crypto = require('./util/crypto'); 

const chain = new Chain(10); 

//create wallets
const walletA = new Wallet(chain, 'A'); 
const walletB = new Wallet(chain, 'B'); 
const walletC = new Wallet(chain, 'C'); 
const coinbase = new Wallet(chain, 'coinbase'); 

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

coinbase.print();
walletA.print();
walletB.print();
walletC.print();

//add a new block with another transaction 
const block1 = new Block(chain, genesisBlock.hash); 
if (block1.addTransaction(coinbase.sendFunds(walletB.publicKey, 100))) {
    block1.mineBlock();
    chain.addBlock(block1); 
}

coinbase.print();
walletA.print();
walletB.print();
walletC.print();
