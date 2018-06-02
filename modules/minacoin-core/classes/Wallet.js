'use strict'; 

const common = require('minacoin-common');
const exception = common.exceptions('WALL'); 
const crypto = common.crypto;
const Input = require('./Input').class; 
const Transaction = require('./Transaction').class; 

// ======================================================================================================
// Wallet 
// 
// A minacoin wallet 
// 
// @chain: instance of blockchain on which the wallet operates
// @name: optional friendly name of wallet (for debugging)
// 
function Wallet(chain, name, pubKey, privKey) {
    const _this = this; 
    let _keyPair = null; 

    this.chain = chain;
    this.publicKey = pubKey;
    this.privateKey = privKey; 
    this.name = name; 

    this.utxos = {};
    
    // ------------------------------------------------------------------------------------------------------
    // generates a new public/private key pair 
    // 
    const generateKeyPair = () => {
        return exception.try(() => {
            _keyPair = crypto.generateKeyPair();     
            _this.privateKey = _keyPair.priv;

            let pubPoint = _keyPair.getPublic();
            _this.publicKey = pubPoint.encode('hex'); 

            _this.privateKey = _keyPair.priv.toString(16, 2);

            console.log('new wallet key pair created: '); 
            console.log('public key: ' + _this.publicKey.toString()); 
            console.log('private key: ' + _this.privateKey.toString()); 
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    // constructor 
    // 
    // @chain: instance of blockchain on which the wallet operates
    // @name: optional friendly name of wallet (for debugging)
    // @pubKey: optional public key of existing wallet (optional) 
    // @privKey: optional private key of exxisting wallet (optional)
    // 
    const ctor = (chain, name, pubKey, privKey) => {
        exception.try(() => {   
            this.chain = chain; 
            this.name = name; 

            if (pubKey && privKey) {
                this.publicKey = pubKey;
                this.privateKey = privKey;
            }
            else {
                generateKeyPair(); 
            }
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
                    _this.utxos[utxo.id] = utxo; 
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

    // ------------------------------------------------------------------------------------------------------
    // converts the wallet to a json representation
    // 
    this.serialize = () => {
        return exception.try(() => {
            const output = {
                chain: _this.chain.serialize(),
                publicKey: _this.publicKey.toString(), 
                privateKey: _this.privateKey.toString(),
                name: _this.name,
                utxos: {}
            };

            for (let id in _this.utxos) {
                output.utxos[id] = _this.utxos[id].serialize()
            }

            return output; 
        });
    };

    ctor(chain, name, pubKey, privKey);  
}


module.exports = {
    class: Wallet, 
    deserialize: (data) => {
        return exception.try(() => {
            const chain = require('./Chain').deserialize(data.chain); 
            const output = new Wallet(chain, data.name, data.publicKey, data.privateKey); 
            output.utxos = {}; 

            const deserializeOutput = require('./Output').deserialize;

            if (data.utxos) {
                for (let id in data.utxos) {
                    output.utxos[id] = deserializeOutput(data.utxos[id]); 
                }
            }

            return output; 
        });
    }
};