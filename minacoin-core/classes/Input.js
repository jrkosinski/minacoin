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

	this.serialize = () => {
		return {
			outputId: _this.outputId,
			utxo: _this.utxo ? _this.utxo.serialize : null
		};
	};
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