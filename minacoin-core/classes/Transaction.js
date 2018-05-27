'use strict'; 

const exception = require('../util/exceptions')('TRAN'); 
const crypto = require('../util/crypto'); 
const Output = require('./Output').class;

// ======================================================================================================
// Transaction 
// 
// encapsulates a single coin transaction
// 
// @chain: the blockchain instance
// @from: the public key of the sender's wallet
// @to: the public key of the recipient's wallet 
// @inputs: array of inputs 
// 
function Transaction(chain, from, to, amount, inputs) {
    const _this = this; 
    
    this.id = null; 
    this.sender = from; 
    this.recipient = to; 
    this.amount = amount; 
    this.signature = null; 
    this.inputs = inputs ? inputs : []; 
    this.outputs = []; 
    this.chain = chain;

    // ------------------------------------------------------------------------------------------------------
    // get the total sum value of all inputs
    // 
	const /*float*/ getInputsValue = () => {
        let output = 0;
        if (_this.inputs) {
            _this.inputs.forEach((i) => {
                if (i.utxo) {
                    output += i.utxo.amount;
                }
            });
        }
        
		return output;
	};

    // ------------------------------------------------------------------------------------------------------
    // get the total sum value of all outputs
    // 
	const /*float*/ getOutputsValue = () => {
        let output = 0;
        if (_this.outputs) {
            _this.outputs.forEach((o) => {
                output += o.amount; 
            });
        }
        
		return output;
	};

    // ------------------------------------------------------------------------------------------------------
    // calculate a new hash of the currently encapsulated data 
    //
    const /*string*/ calculateHash = () => {
        return exception.try(() => {
            return crypto.hashString(
                _this.sender + 
                _this.recipient + 
                _this.amount.toString()
            );
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    // signs a hash of the current transaction's data using the given private key
    // 
    // @privateKey: use this key to sign
    // 
    /*signature*/ this.generateSignature = (privateKey) => {
        return exception.try(() => {
            _this.signature = crypto.sign(
                privateKey, 
                _this.sender + 
                _this.recipient + 
                _this.amount.toString()
            );
            return _this.signature;
        });
    };
    
    // ------------------------------------------------------------------------------------------------------
    // verifies a previously signed hash, using the transaction sender as the public key
    // 
    /*bool*/ this.verifySignature = () => {
        
        return exception.try(() => {                
            const data = _this.sender + 
                _this.recipient + 
                _this.amount.toString();
            return crypto.verify(_this.sender, data, _this.signature);
        });
    };
    
    // ------------------------------------------------------------------------------------------------------
    // validates and processes a transaction, assigning the correct amounts to the appropriate wallets
    // 
    /*bool*/ this.process = () => {
        return exception.try(() => {
            
            //verify 
            if (!_this.verifySignature()) {
                console.log('failed to verify signature'); 
                return false; 
            }

            //gather the inputs from the chain 
            if (_this.inputs) {
                _this.inputs.forEach((i) => {
                    i.utxo = _this.chain.getUtxo(i.outputId); 
                });
            }

            const inputsTotal = getInputsValue(); 
            const remainingBalance = inputsTotal - _this.amount; 
            _this.id = calculateHash(); 

            //output for the recipient is the trans amount 
            _this.outputs.push(new Output(_this.recipient, _this.amount, _this.id));
            
            //output for the sender is the remaining balance 
            _this.outputs.push(new Output(_this.sender, remainingBalance, _this.id));             

            //add outputs to Unspent list
            _this.outputs.forEach((o) => {
                _this.chain.addUtxo(o); 
            });
		
            //remove transaction inputs from UTXO lists as spent:
            _this.inputs.forEach((i) => {
                if (i.utxo) {
                    _this.chain.removeUtxo(i.outputId);
                }
            });

            return true; 
        });
    };

    // ------------------------------------------------------------------------------------------------------
    // converts this transaction to a json representation
    // 
    /*json*/ this.serialize = () => {
        return exception.try(() => {
            const output = {
                id: _this.id,
                recipient: _this.recipient,
                sender: _this.sender,
                amount: _this.amount,
                signature: _this.signature, //TODO: does this work for signature?
                inputs: [],
                outputs: []
            }; 

            for (let n=0; n<_this.inputs.length; n++) {
                output.inputs.push(_this.inputs[n].serialize());
            }

            for (let n=0; n<_this.outputs.length; n++) {
                output.outputs.push(_this.outputs[n].serialize());
            }

            return output; 
        });
    }; 
}

module.exports = {
    class: Transaction, 
    deserialize: (data, chain) => {
        return exception.try(() => {
            const inputs = []; 
            const output = new Transaction(chain, data.from, data.to, data.amount, inputs); 
            output.signature = data.signature;
            output.outputs = []; 
            
            return output; 
        });
    }
};