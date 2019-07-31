'use strict'; 

const Wallet = require('../classes/Wallet').class; 
const Chain = require('../classes/Chain').class;
const Transaction = require('../classes/Transaction').class;
const Output = require('../classes/Output').class;
const Block = require('../classes/Block').class;

function createWallets() {
    const chain = new Chain(10); 

    const walletA = new Wallet(chain, 'A'); 
    const walletB = new Wallet(chain, 'B'); 
    const walletC = new Wallet(chain, 'C'); 
    const coinbase = new Wallet(chain, 'coinbase'); 

    return [coinbase, walletA, walletB, walletC]; 
}

function genesisTrans() {
    const wallets = createWallets(); 
    const coinbase = wallets[0]; 
    const chain = coinbase.chain;

    const genesisTrans = new Transaction(chain, coinbase.publicKey, coinbase.publicKey, 1000); 
    genesisTrans.generateSignature(coinbase.privateKey); 
    genesisTrans.id= '0'; 

    const output = new Output(genesisTrans.recipient, genesisTrans.amount, genesisTrans.id);
    genesisTrans.outputs.push(output); 
    chain.addUtxo(output); 

    const genesisBlock = new Block(chain, null); 
    genesisBlock.addTransaction(genesisTrans); 
    genesisBlock.mineBlock(); 
    chain.addBlock(genesisBlock); 

    return {
        wallets: wallets, 
        genesisBlock: genesisBlock
    };
}


module.exports = {
    createWallets, 
    genesisTrans
}