'use strict'; 

const common = require('minacoin-common');
const exception = common.exceptions('WALL'); 
const crypto = common.crypto;
const Input = require('./Input').class; 
const Transaction = require('./Transaction').class; 

// 
// Wallet 
// 
// A minacoin wallet 
// 
// @chain: instance of blockchain on which the wallet operates
// @name: optional friendly name of wallet (for debugging)
// @pubKey: optional public key of existing wallet (optional) 
// @privKey: optional private key of exxisting wallet (optional)
// 
class Wallet {

    constructor(chain, name, pubKey, privKey) {
        this.chain = chain;
        this.publicKey = pubKey;
        this.privateKey = privKey; 
        this.name = name; 
        this._keyPair = null; 
    
        this.utxos = {};

        exception.try(() => {   
            this.chain = chain; 
            this.name = name; 

            if (pubKey && privKey) {
                this.publicKey = pubKey;
                this.privateKey = privKey;
            }
            else {
                this.generateKeyPair(); 
            }
        });
    }
    
    /**
     * generates a new public/private key pair 
     */
    generateKeyPair() {
        exception.try(() => {
            this._keyPair = crypto.generateKeyPair();     
            this.privateKey = this._keyPair.priv;

            let pubPoint = this._keyPair.getPublic();
            this.publicKey = pubPoint.encode('hex'); 

            this.privateKey = this._keyPair.priv.toString(16, 2);

            console.log('new wallet key pair created: '); 
            console.log('public key: ' + this.publicKey.toString()); 
            console.log('private key: ' + this.privateKey.toString()); 
        });
    }
    
    /**
     * calculates & returns the current balance as a sum of wallet inputs & outputs
     * @returns {float} current wallet balance 
     */
    /*float*/ getBalance() {
        return exception.try(() => {
            let total = 0;
    
            this.chain.getUtxos().forEach((id) => {
                const utxo = this.chain.getUtxo(id);
                
                if (utxo && utxo.recipient === this.publicKey) {
                    this.utxos[utxo.id] = utxo; 
                    total += utxo.amount;
                }
            });
    
            return total; 
        });
    }

    /**
     * creates & returns a new Transaction object for sending the given amount to the specified 
     * recipient's wallet address, from the current wallet 
     * @param {string} recipient the receiving wallet public key 
     * @param {float} amount the amount to send from this wallet, to the given wallet
     */
    /*Transaction*/ sendFunds(recipient, amount) {
        return exception.try(() => {
            
            //check for sufficient balance first 
            if (this.getBalance() < amount) {
                console.log('insufficient balance'); 
                return null;
            }

            const inputs = []; 
            let total = 0; 

            //gather inputs 
            for (let id in this.utxos) {
                let utxo = this.utxos[id]; 
                total += utxo.amount;
                inputs.push(new Input(utxo.id)); 
            }

            //create new transaction
            const trans = new Transaction(this.chain, this.publicKey, recipient, amount, inputs); 
            trans.generateSignature(this.privateKey); 

            //remove spent inputs
            inputs.forEach((i) => {
                delete this.utxos[i.outputId]; 
            }); 

            return trans;
        });
    }

    /**
     * displays wallet keys & balance for debugging
     */
    print() {
        return exception.try(() => {
            console.log('');
            console.log('* wallet ' + this.name + ' *'); 
            console.log('public: ' + this.publicKey);
            console.log('private: ' + this.privateKey); 
            console.log('balance: ' + this.getBalance()); 
        });
    }

    // ------------------------------------------------------------------------------------------------------
    // 
    // 
    /**
     * converts the wallet to a json representation
     * @returns {json}
     */
    /*json*/ serialize() {
        return exception.try(() => {
            const output = {
                chain: this.chain.serialize(),
                publicKey: this.publicKey.toString(), 
                privateKey: this.privateKey.toString(),
                name: this.name,
                utxos: {}
            };

            for (let id in this.utxos) {
                output.utxos[id] = this.utxos[id].serialize()
            }

            return output; 
        });
    }
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