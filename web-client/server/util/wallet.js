'use strict';

// ===============================================================================================
// 
// John R. Kosinski
// 1 Apr 2018
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const common = require('minacoin-common'); 
const client = require('minacoin-client'); 
const exception = common.exceptions('WAL');

let _wallet = null; 

// -----------------------------------------------------------------------------------------------
const initializeWallet = async(() => {
    _wallet = await(client.start()); 
});

// -----------------------------------------------------------------------------------------------
const getBalance = async((query) => {
    return exception.try(() => {
        return _wallet.getBalance(); 
    });
}); 

// -----------------------------------------------------------------------------------------------
const getWalletInfo = async(() => {
    return exception.try(() => {
        const output = {
            address: _wallet.getAddress(),
            balance: _wallet.getBalance(), 
            chainSize: _wallet.getChainSize(),
            blockHashes: [],
            pendingTransactions: []
        }; 

        const blocks = _wallet.getBlocks();
        for (let n=0; n<blocks.length; n++) {
            output.blockHashes.push(blocks[n].hash); 
        }

        return output; 
    });
}); 

// -----------------------------------------------------------------------------------------------
const sendCoins = async((query, postData) => {
    return exception.try(() => {
        _wallet.sendFunds(postData.recipient, postData.amount); 
    });
}); 



//start the client wallet; connect to network 
initializeWallet();

module.exports = {
    getBalance, 
    getWalletInfo,
    sendCoins
};