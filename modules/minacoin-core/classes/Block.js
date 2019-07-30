'use strict'; 

const common = require('minacoin-common');
const crypto = common.crypto;
const merkle = common.merkle;
const strings = common.strings;

const exception = common.exceptions('BLCK'); 

// 
// Block
// 
// generic blockchain block 
// 
// @chain: instance of the chain on which the block will live 
// @prevHash: hash of the block in the chain immediately previous to this one 
// 
class Block {
    constructor (chain, prevHash) {
        this.prevHash = prevHash;
        this.chain = chain;
        this.merkleRoot = null; 
        this.nonce = 0; 
        this.transactions = [];
        this.timestamp = new Date().getTime(); 

        this.hash = this.calculateHash(); 
    }

    /**
     * calculates a new hash from the block's contained data
     * @returns {string}
     */
    /*string*/ calculateHash() {
        return exception.try(() => {
            return crypto.hashString(
                this.prevHash + 
                this.merkleRoot + 
                this.nonce.toString() + 
                this.timestamp.toString()
            );
        });
    }

    /**
     * adds a transaction to the block
     * @param {*} transaction 
     * @returns {bool} true on success
     */
    /*bool*/ addTransaction(transaction) {
        return exception.try(() => {
            let output = true; 

            if (transaction) {
                //exclude genesis block
                if (this.prevHash) {
                    if (!transaction.process()) {
                        console.log('transaction failed to process; discarding'); 
                        output = false;
                    }
                }
            }
            else 
                output = false;

            if (output) {
                this.transactions.push(transaction); 
                console.log('successfully added transaction');                 
            }

            return output; 
        });
    }

    /**
     * mines a new block; an instantiated block is not valid (cannot be added to the blockchain) until 
     * it's been mined 
     */
    mineBlock() {
        exception.try(() => {
            this.merkleRoot = merkle.getMerkleRoot(this.transactions); 
            
            while(strings.numZeros(this.hash) !== this.chain.difficulty) {
                this.nonce++; 
                this.hash = this.calculateHash(); 
            }
            
            console.log("Block Mined!!! : " + this.hash);
        });
    }

    /**
     * has the block been validly mined? 
     * @returns {bool}
     */
    /*bool*/ isMined() {
        return exception.try(() => {
            return strings.numZeros(this.hash) === this.chain.difficulty; 
        });
    }

    /**
     * converts the whole block to a json representation
     * @returns {bool}
     */
    /*json*/ serialize() {
        return exception.try(() => {
            const output = {
                prevHash: this.prevHash,
                hash: this.hash,
                timestamp: this.timestamp,
                nonce: this.nonce,
                merkleRoot: this.merkleRoot,
                transactions: []
            }; 

            for (let n=0; n<this.transactions.length; n++) {
                output.transactions.push(this.transactions[n].serialize());
            }

            return output; 
        });
    }
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