'use strict'; 

const common = require('minacoin-common');
const exception = common.exceptions('TRAN'); 
const crypto = common.crypto;
const Output = require('./Output').class;

// 
// Transaction 
// 
// encapsulates a single coin transaction
// 
// @chain: the blockchain instance
// @from: the public key of the sender's wallet
// @to: the public key of the recipient's wallet 
// @inputs: array of inputs 
// 
class Transaction {
    constructor(chain, from, to, amount, inputs) {
        this.id = null; 
        this.sender = from; 
        this.recipient = to; 
        this.amount = amount; 
        this.signature = null; 
        this.inputs = inputs ? inputs : []; 
        this.outputs = []; 
        this.chain = chain;
    }
    
    /**
     * get the total sum value of all inputs
     * @returns {float}
     */
	/*float*/ getInputsValue() {
        let output = 0;
        if (this.inputs) {
            this.inputs.forEach((i) => {
                if (i.utxo) {
                    output += i.utxo.amount;
                }
            });
        }
        
		return output;
	}

    /**
     * get the total sum value of all outputs
     * @returns {float}
     */
	/*float*/ getOutputsValue() {
        let output = 0;
        if (this.outputs) {
            this.outputs.forEach((o) => {
                output += o.amount; 
            });
        }
        
		return output;
	}

    /**
     * calculate a new hash of the currently encapsulated data 
     * @returns {string}
     */
    /*string*/ calculateHash() {
        return exception.try(() => {
            return crypto.hashString(
                this.sender + 
                this.recipient + 
                this.amount.toString()
            );
        });
    }

    /**
     * signs a hash of the current transaction's data using the given private key
     * @param {*} privateKey use this key to sign
     * @returns {signature}
     */
    /*signature*/ generateSignature(privateKey) {
        return exception.try(() => {
            this.signature = crypto.sign(
                privateKey, 
                this.sender + 
                this.recipient + 
                this.amount.toString()
            );
            return this.signature;
        });
    }
    
    /**
     * verifies a previously signed hash, using the transaction sender as the public key
     * @returns {bool}
     */
    /*bool*/ verifySignature() {
        
        return exception.try(() => {                
            const data = this.sender + 
                this.recipient + 
                this.amount.toString();
            return crypto.verify(this.sender, data, this.signature);
        });
    }
    
    /**
     * validates and processes a transaction, assigning the correct amounts to the appropriate wallets
     * @returns {bool}
     */
    /*bool*/ process() {
        return exception.try(() => {
            
            //verify 
            if (!this.verifySignature()) {
                console.log('failed to verify signature'); 
                return false; 
            }

            //gather the inputs from the chain 
            if (this.inputs) {
                this.inputs.forEach((i) => {
                    i.utxo = this.chain.getUtxo(i.outputId); 
                });
            }

            const inputsTotal = this.getInputsValue(); 
            const remainingBalance = inputsTotal - this.amount; 
            this.id = this.calculateHash(); 

            //output for the recipient is the trans amount 
            this.outputs.push(new Output(this.recipient, this.amount, this.id));
            
            //output for the sender is the remaining balance 
            this.outputs.push(new Output(this.sender, remainingBalance, this.id));             

            //add outputs to Unspent list
            this.outputs.forEach((o) => {
                this.chain.addUtxo(o); 
            });
		
            //remove transaction inputs from UTXO lists as spent:
            this.inputs.forEach((i) => {
                if (i.utxo) {
                    this.chain.removeUtxo(i.outputId);
                }
            });

            return true; 
        });
    }

    /**
     * converts this transaction to a json representation
     * @returns {json}
     */
    /*json*/ serialize() {
        return exception.try(() => {
            const output = {
                id: this.id,
                recipient: this.recipient,
                sender: this.sender,
                amount: this.amount,
                signature: this.signature, //TODO: does this work for signature?
                inputs: [],
                outputs: []
            }; 

            for (let n=0; n<this.inputs.length; n++) {
                output.inputs.push(this.inputs[n].serialize());
            }

            for (let n=0; n<this.outputs.length; n++) {
                output.outputs.push(this.outputs[n].serialize());
            }

            return output; 
        });
    }
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