'use strict';

// 
// John R. Kosinski
// 1 Apr 2018
const common = require('minacoin-common'); 
const client = require('minacoin-client'); 
const exception = common.exceptions('WAL');

let _wallet = null; 

async function initializeWallet() {
    _wallet = await client.start(); 
}

async function getBalance(query) {
    return exception.try(() => {
        return _wallet.getBalance(); 
    });
}

async function getWalletInfo() {
    return exception.try(() => {
        const output = {
            address: _wallet.address,
            balance: _wallet.balance, 
            chainSize: _wallet.chainSize,
            blockHashes: [],
            pendingTransactions: []
        }; 

        const blocks = _wallet.blocks;
        for (let n=0; n<blocks.length; n++) {
            output.blockHashes.push(blocks[n].hash); 
        }

        return output; 
    });
}

async function sendCoins(query, postData) {
    return exception.try(() => {
        _wallet.sendFunds(postData.recipient, postData.amount); 
    });
} 



//start the client wallet; connect to network 
initializeWallet();

module.exports = {
    getBalance, 
    getWalletInfo,
    sendCoins
};