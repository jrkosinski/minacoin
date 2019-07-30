'use strict'; 

const common = require('minacoin-common');
const exception = common.exceptions('INP'); 
const crypto = common.crypto;

// 
// Input
// 
class Input {
	constructor(outputId) {
		this.outputId = outputId; //Reference to TransactionOutputs -> transactionId
		this.utxo = null; //Contains the Unspent transaction output	
	}
        
	/**
	 * converts the object to a JSON representation 
	 * @returns {json}
	 */
	serialize() {
		return {
			outputId: this.outputId,
			utxo: this.utxo ? this.utxo.serialize : null
		};
	}
}

module.exports = { 
    class: Input, 
    deserialize: (data) => {
        return exception.try(() => {
			const output = new Input(data.outputId); 
			output.utxo = require('./Output').deserialize(); 
			return output; 
        });
    }
};