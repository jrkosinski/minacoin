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

            await(database.saveWallet(wallet)); 
            console.log('genesis wallet amount is ' + wallet.getBalance()); 
        }
        else {
            //make a transaction 
            const transaction = wallet.sendFunds("043fe0b8eae0da8a69f70cb32a242df4b46e15ffc96419a8bbc86bb9e120b1903ec3cd4fa8275b571a4821dc8aa05d00626ef0a5211e1485acb6b9aeb5bf525aec", 1000000); 
            const chain = wallet.chain;

            if (transaction) {
                //add it to a new block 
                const block = new core.Block(chain, chain.lastBlock().hash); 
                if (block.addTransaction(transaction)) {
                    block.mineBlock(); 

                    //add block to chain 
                    if (chain.addBlock(block)) {
                        await(database.saveWallet(wallet)); 
                        
                        console.log('genesis wallet amount is ' + wallet.getBalance()); 
                    }
                }
            }    
        }

        //start the server listening for connections  
        console.log('genesis wallet amount is ' + wallet.getBalance());
        const clientWallet = new ClientWallet('localhost', 5000, wallet); 
        clientWallet.connectToNetwork();
    });
});

run(); 