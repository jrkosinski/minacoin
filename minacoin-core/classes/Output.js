'use strict'; 

const exception = require('../util/exceptions')('OUTP'); 
const crypto = require('../util/crypto'); 

// ======================================================================================================
// Output
// 
// @recipient: 
// @amount: 
// @parentId: 
//
function Output(recipient, amount, parentId) {
    const _this = this; 
    
	this.id = crypto.hashString(recipient + amount.toString() + parentId);
	this.recipient = recipient; //also known as the new owner of these coins.
	this.amount = amount; //the amount of coins they own
	this.parentTransactionId = parentId; //the id of the transaction this output was created 
	
	this.serialize = () => {
		return {
			id: _this.id,
			recipient: _this.recipient,
			amount: _this.amount,
			parentTransactionId: _this.parentTransactionId 
		};
	};
}

module.exports = { 
    class: Output, 
    deserialize: () => {
        return exception.try((data) => {
			const output = new Output(data.recipient, data.amount, data.parentId);
			output.parentTransactionId = data.parentTransactionId; 
			return output; 
        });
    }
};