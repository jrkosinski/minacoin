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
        return {
            address: _wallet.getAddress(),
            balance: _wallet.getBalance(), 
            pendingTransactions: []
        }
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