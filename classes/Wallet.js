'use strict'; 

const crypto = require('../util/crypto');
const Input = require('./Input'); 
const Transaction = require('./Transaction'); 
const exception = require('../util/exceptions')('WALL'); 

// ======================================================================================================
function Wallet(chain, name) {
    const _this = this; 
    let _keyPair = null; 

    this.chain = chain;
    this.publicKey = null;
    this.privateKey = null; 
    this.name = name; 

    //TODO: make private? 
    this.utxos = {};
    
    // ------------------------------------------------------------------------------------------------------
    const generateKeyPair = () => {
        return exception.try(() => {
            _keyPair = crypto.generateKeyPair();     
            _this.privateKey = _keyPair.priv;

            var pubPoint = _keyPair.getPublic();
            _this.publicKey = pubPoint.encode('hex'); 
        });
    }; 
    
    // ------------------------------------------------------------------------------------------------------
    this.getBalance = () => {
        return exception.try(() => {
            let total = 0;
    
            _this.chain.getUtxos().forEach((id) => {
                const utxo = _this.chain.getUtxo(id);
                
                if (utxo && utxo.recipient === _this.publicKey) {
                    _this.utxos[utxo.id] = utxo; 
                    total += utxo.amount;
                }
            });
    
            return total; 
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    this.sendFunds = (recipient, amount) => {
        return exception.try(() => {
            
            //check for sufficient balance first 
            if (_this.getBalance() < amount) {
                console.log('insufficient balance'); 
                return null;
            }

            const inputs = []; 
            let total = 0; 

            //gather inputs 
            for (let id in _this.utxos) {
                let utxo = _this.utxos[id]; 
                total += utxo.amount;
                inputs.push(new Input(utxo.id)); 
            }

            //create new transaction
            const trans = new Transaction(_this.chain, _this.publicKey, recipient, amount, inputs); 
            trans.generateSignature(_this.privateKey); 

            //remove spent inputs
            inputs.forEach((i) => {
                delete _this.utxos[i.outputId]; 
            }); 

            return trans;
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    this.print = () => {
        return exception.try(() => {
            console.log('');
            console.log('* wallet ' + _this.name + ' *'); 
            console.log('public: ' + _this.publicKey);
            console.log('private: ' + _this.privateKey); 
            console.log('balance: ' + _this.getBalance()); 
        });
    }; 

    generateKeyPair(); 
}

module.exports = Wallet;