'use strict'; 

const exception = require('../util/exceptions')('OUTP'); 
const crypto = require('../util/crypto'); 

// ======================================================================================================
function Output(recipient, amount, parentId) {
    const _this = this; 
    
	this.id = crypto.hashString(recipient + amount.toString() + parentId);
	this.recipient = recipient; //also known as the new owner of these coins.
	this.amount = amount; //the amount of coins they own
	this.parentTransactionId = parentId; //the id of the transaction this output was created in
}

module.exports = Output;