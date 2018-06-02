'use strict'; 

require('dotenv').config();

const async = require('asyncawait/async'); 
const await = require('asyncawait/await'); 

const p2p = require('p2p-client'); 
const core = require('minacoin-core'); 
const common = require('minacoin-common'); 
const exception = common.exceptions('CLI');
const ClientWallet = p2p.ClientWallet;
const Database = p2p.Database; 

const start = async((host, port) => {
    exception.try(() => {

        //get wallet from database 
        const database = new Database(); 
        const wallet = await(database.getWallet()); 
        let clientWallet = null; 

        //first connect to server, and request the full chain 
        clientWallet = new ClientWallet(host, port, wallet, database); 

        //on connection, request full chain 
        clientWallet.node.on('connected', () => {
                
            //wallet is created automatically when chain is received
            clientWallet.requestChain(); 
        });
        
        clientWallet.connectToNetwork();                         
    });
});


module.exports = {
    start: () => { start(process.env.P2P_HOSTNAME, process.env.P2P_PORT); }
}