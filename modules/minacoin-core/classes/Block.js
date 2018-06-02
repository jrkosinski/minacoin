'use strict'; 

const common = require('minacoin-common');
const crypto = common.crypto;
const merkle = common.merkle;
const strings = common.strings;

const exception = common.exceptions('BLCK'); 

// ======================================================================================================
// Block
// 
// generic blockchain block 
// 
// @chain: instance of the chain on which the block will live 
// @prevHash: hash of the block in the chain immediately previous to this one 
// 
function Block(chain, prevHash) {
    const _this = this; 
    
    this.prevHash = prevHash; 
    this.merkleRoot = null; 
    this.nonce = 0; 
    this.transactions = [];
    this.chain = chain;
    this.timestamp = new Date().getTime(); 

    // ------------------------------------------------------------------------------------------------------
    // calculates a new hash from the block's contained data
    // 
    /*string*/ this.calculateHash = () => {
        return exception.try(() => {
            return crypto.hashString(
                _this.prevHash + 
                _this.merkleRoot + 
                _this.nonce.toString() + 
                _this.timestamp.toString()
            );
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    // adds a transaction to the block
    // 
    // @transaction: the transaction to add
    // 
    // returns: true on success 
    /*bool*/ this.addTransaction = (transaction) => {
        return exception.try(() => {
            let output = true; 

            if (transaction) {
                //exclude genesis block
                if (_this.prevHash) {
                    if (!transaction.process()) {
                        console.log('transaction failed to process; discarding'); 
                        output = false;
                    }
                }
            }
            else 
                output = false;

            if (output) {
                _this.transactions.push(transaction); 
                console.log('successfully added transaction');                 
            }

            return output; 
        });
    }; 
    
    // ------------------------------------------------------------------------------------------------------
    // mines a new block; an instantiated block is not valid (cannot be added to the blockchain) until 
    // it's been mined 
    // 
    this.mineBlock = () => {
        exception.try(() => {
            _this.merkleRoot = merkle.getMerkleRoot(_this.transactions); 
            
            //while(_this.hash.substring(0, difficulty) !== target) {
            while(strings.numZeros(_this.hash) !== _this.chain.difficulty) {
                _this.nonce++; 
                _this.hash = _this.calculateHash(); 
            }
            
            console.log("Block Mined!!! : " + _this.hash);
        });
    };
    
    // ------------------------------------------------------------------------------------------------------
    // has the block been validly mined? 
    //
    /*bool*/ this.isMined = () => {
        return exception.try(() => {
            return strings.numZeros(_this.hash) === _this.chain.difficulty; 
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    // converts the whole block to a json representation
    // 
    /*json*/ this.serialize = () => {
        return exception.try(() => {
            const output = {
                prevHash: _this.prevHash,
                hash: _this.hash,
                timestamp: _this.timestamp,
                nonce: _this.nonce,
                merkleRoot: _this.merkleRoot,
                transactions: []
            }; 

            for (let n=0; n<_this.transactions.length; n++) {
                output.transactions.push(_this.transactions[n].serialize());
            }

            return output; 
        });
    }; 
    
    this.hash = _this.calculateHash(); 
}

module.exports = { 
    class: Block, 
    deserialize: (data, chain) => {
        return exception.try(() => {
            const output = new Block(chain, data.prevHash);
            output.timestamp = data.timestamp; 
            output.hash = data.hash;
            output.merkleRoot = data.merkleRoot;
            output.nonce = data.nonce;

            const deserializeTran = require('./Transaction').deserialize; 
            if (data.transactions) {
                data.transactions.forEach((t) => {
                    output.transactions.push(deserializeTran(t, chain));
                });
            }

            return output; 
        });
    }
};