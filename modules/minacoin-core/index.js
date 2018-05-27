'use strict'; 

const chain = require('./classes/Chain'); 
const block = require('./classes/Block'); 
const wallet = require('./classes/Wallet'); 
const output = require('./classes/Output'); 
const transaction = require('./classes/Transaction'); 

module.exports = {
    Block: block.class, 
    Chain: chain.class, 
    Wallet: wallet.class, 
    Transaction: transaction.class, 
    Output: output.class,

    deserializeBlock: block.deserialize, 
    deserializeChain: chain.deserialize,
    deserializeTransaction: transaction.deserialize,
    deserializeWallet: wallet.deserialize
}; 


/*

const Chain = require('./classes/Chain').class; 
const Block = require('./classes/Block').class; 
const Wallet = require('./classes/Wallet').class; 
const Transaction = require('./classes/Transaction').class; 
const Output = require('./classes/Output').class; 
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

//add a new block with another transaction 
const block2 = new Block(chain, block1.hash); 
if (block2.addTransaction(walletB.sendFunds(walletA.publicKey, 10))) {
    block2.mineBlock();
    chain.addBlock(block2); 
}

//add a new block with another transaction 
const block3 = new Block(chain, block2.hash); 
if (block3.addTransaction(walletB.sendFunds(walletC.publicKey, 10))) {
    block3.mineBlock();
    chain.addBlock(block3); 
}

coinbase.print();
walletA.print();
walletB.print();
walletC.print();
*/ 


