'use strict'; 

const Wallet = require('./classes/Wallet').class; 

function createWallets() {
    const walletA = new Wallet(chain, 'A'); 
    const walletB = new Wallet(chain, 'B'); 
    const walletC = new Wallet(chain, 'C'); 
    const coinbase = new Wallet(chain, 'coinbase'); 

    return [coinbase, walletA, walletB, walletC]; 
}


module.exports = {
    createWallets
}