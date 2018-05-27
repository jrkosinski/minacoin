'use strict'; 

const p2p = require('p2p-client'); 
const core = require('minacoin-core'); 
const ClientWallet = p2p.ClientWallet;
const Database = p2p.Database; 

const run = async(() => {
    exception.try(() => {

        //get wallet from database 
        const database = new Database(); 
        const wallet = await(database.getWallet()); 

        //if no wallet, need to create a new one 
        if (!wallet) {
            
        }
    });
});

run(); 