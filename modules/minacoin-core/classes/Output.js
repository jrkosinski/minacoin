'use strict'; 

const common = require('minacoin-common');
const exception = common.exceptions('OUTP'); 
const crypto = common.crypto;

// 
// Output
//
class Output {
	constructor(recipient, amount, parentId) {    
		this.id = crypto.hashString(recipient + amount.toString() + parentId);
		this.recipient = recipient; //also known as the new owner of these coins.
		this.amount = amount; //the amount of coins they own
		this.parentTransactionId = parentId; //the id of the transaction this output was created 
	}
	
	/**
	 * converts the object to a JSON representation 
	 * @returns {json}
	 */
	serialize() {
		return {
			id: this.id,
			recipient: this.recipient,
			amount: this.amount,
			parentTransactionId: this.parentTransactionId 
		};
	}
}

module.exports = { 
    class: Output, 
    deserialize: (data) => {
        return exception.try(() => {
			const output = new Output(data.recipient, data.amount, data.parentId);
			output.parentTransactionId = data.parentTransactionId; 
			return output; 
        });
    }
};