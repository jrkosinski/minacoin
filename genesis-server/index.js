'use strict'; 

require('dotenv').config();

const async = require('asyncawait/async'); 
const await = require('asyncawait/await'); 

const p2p = require('p2p-client'); 
const core = require('minacoin-core'); 
const common = require('minacoin-common'); 
const exception = common.exceptions('GEN');
const ClientWallet = p2p.ClientWallet;
const Database = p2p.Database; 

const MINING_DIFFICULTY = 10; 
const INITIAL_AMOUNT = 1000000; 

const run = async(() => {
    exception.try(() => {
        const database = new Database(); 
        let wallet = await(database.getWallet()); 
        
        //if no wallet found, time to create a new one 
        if (!wallet) {
            //create the first chain 
            const chain = new core.Chain(10); 

            //create wallets
            wallet = new core.Wallet(chain, 'coinbase'); 

            //genesis transaction, sends INITIAL_AMOUNT to wallet
            const genesisTrans = new core.Transaction(chain, wallet.publicKey, wallet.publicKey, INITIAL_AMOUNT); 
            genesisTrans.generateSignature(wallet.privateKey); 
            genesisTrans.id= '0'; 
            const output = new core.Output(genesisTrans.recipient, genesisTrans.amount, genesisTrans.id);
            genesisTrans.outputs.push(output); 
            chain.addUtxo(output); 

            //genesis block 
            const genesisBlock = new core.Block(chain, null); 
            genesisBlock.addTransaction(genesisTrans); 
            genesisBlock.mineBlock(); 
            chain.addBlock(genesisBlock); 

            //print to verify 
            wallet.print();

            //send funds to random wallet 
            console.log('genesis wallet amount is ' + wallet.getBalance()); 

            let trans = wallet.sendFunds("04be58d4f8c7fa88b70d7ff346f450b2fa299e2f4852c7ecca2ba95afe034456dff436952822b074fb614240eadaa74417a5f446ccbb0476924934ce07eeab4cef", 10000) ; 
            const newBlock = new core.Block(wallet.chain, wallet.chain.lastBlock().hash); 
            newBlock.addTransaction(trans); 
            newBlock.mineBlock(); 
            wallet.chain.addBlock(newBlock); 

            //save the wallet to database 
            await(database.saveWallet(wallet)); 
            
            //send funds to random wallet 
            console.log('genesis wallet amount is ' + wallet.getBalance()); 
        }

        //start the server listening for connections  
        const clientWallet = new ClientWallet('localhost', 5000, wallet); 
        clientWallet.connectToNetwork();
    });
});

run(); 