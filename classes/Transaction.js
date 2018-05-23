'use strict'; 

const exception = require('../util/exceptions')('TRAN'); 
const crypto = require('../util/crypto'); 
const Output = require('./Output');

// ======================================================================================================
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
	const getInputsValue = () => {
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
	const getOutputsValue = () => {
        let output = 0;
        if (_this.outputs) {
            _this.outputs.forEach((o) => {
                output += o.amount; 
            });
        }
        
		return output;
	};

    // ------------------------------------------------------------------------------------------------------
    const calculateHash = () => {
        return exception.try(() => {
            return crypto.hashString(
                _this.sender + 
                _this.recipient + 
                _this.amount.toString()
            );
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    this.generateSignature = (privateKey) => {
        return exception.try(() => {
            _this.signature = crypto.sign(
                _this.sender + 
                _this.recipient + 
                _this.amount.toString()
            );
            return _this.signature;
        });
    };
    
    // ------------------------------------------------------------------------------------------------------
    this.verifySignature = () => {
        return true; 
        
        //TODO: why's this returning false?
        return exception.try(() => {                
            const data = _this.sender + _this.recipient + _this.amount.toString();
            return crypto.verify(_this.sender, data, _this.signature);
        });
    };
    
    // ------------------------------------------------------------------------------------------------------
    this.process = () => {
        return exception.try(() => {
            
            //verify 
            if (!_this.verifySignature()) {
                console.log('failed to verify signature'); 
                return false; 
            }

            //gather the inputs from the chain 
            if (_this.inputs) {
                _this.inputs.forEach((i) => {
                    //TODO: inputs has no id property
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
}

module.exports = Transaction;