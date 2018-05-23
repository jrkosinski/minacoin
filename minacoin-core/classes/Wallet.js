'use strict'; 

const crypto = require('../util/crypto');
const Input = require('./Input'); 
const Transaction = require('./Transaction'); 
const exception = require('../util/exceptions')('WALL'); 

// ======================================================================================================
// Wallet 
// 
// A minacoin wallet 
// 
// @chain: instance of blockchain on which the wallet operates
// @name: optional friendly name of wallet (for debugging)
// 
function Wallet(chain, name) {
    const _this = this; 
    let _keyPair = null; 

    this.chain = chain;
    this.publicKey = null;
    this.privateKey = null; 
    this.name = name; 

    //TODO: make private? 
    let _utxos = {};
    
    // ------------------------------------------------------------------------------------------------------
    // generates a new public/private key pair 
    // 
    const generateKeyPair = () => {
        return exception.try(() => {
            _keyPair = crypto.generateKeyPair();     
            _this.privateKey = _keyPair.priv;

            var pubPoint = _keyPair.getPublic();
            _this.publicKey = pubPoint.encode('hex'); 
        });
    }; 
    
    // ------------------------------------------------------------------------------------------------------
    // calculates & returns the current balance as a sum of wallet inputs & outputs
    // 
    // returns: current wallet balance 
    /*float*/ this.getBalance = () => {
        return exception.try(() => {
            let total = 0;
    
            _this.chain.getUtxos().forEach((id) => {
                const utxo = _this.chain.getUtxo(id);
                
                if (utxo && utxo.recipient === _this.publicKey) {
                    _utxos[utxo.id] = utxo; 
                    total += utxo.amount;
                }
            });
    
            return total; 
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    // creates & returns a new Transaction object for sending the given amount to the specified 
    // recipient's wallet address, from the current wallet 
    // 
    // @recipient: the receiving wallet public key 
    // @amount: the amount to send from this wallet, to the given wallet
    // 
    /*Transaction*/ this.sendFunds = (recipient, amount) => {
        return exception.try(() => {
            
            //check for sufficient balance first 
            if (_this.getBalance() < amount) {
                console.log('insufficient balance'); 
                return null;
            }

            const inputs = []; 
            let total = 0; 

            //gather inputs 
            for (let id in _utxos) {
                let utxo = _utxos[id]; 
                total += utxo.amount;
                inputs.push(new Input(utxo.id)); 
            }

            //create new transaction
            const trans = new Transaction(_this.chain, _this.publicKey, recipient, amount, inputs); 
            trans.generateSignature(_this.privateKey); 

            //remove spent inputs
            inputs.forEach((i) => {
                delete _utxos[i.outputId]; 
            }); 

            return trans;
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    // displays wallet keys & balance for debugging 
    // 
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