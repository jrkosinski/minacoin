'use strict'; 

const exception = require('../util/exceptions')('INP'); 
const crypto = require('../util/crypto'); 

// ======================================================================================================
// Input
// 
// @outputId: 
// 
function Input(outputId) {
    const _this = this; 
        
	this.outputId = outputId; //Reference to TransactionOutputs -> transactionId
	this.utxo = null; //Contains the Unspent transaction output	
}

module.exports = Input;