'use strict'; 

const common = require('minacoin-common');
const exception = common.exceptions('CHAIN'); 

// 
// Chain
// 
// generic chain of blocks 
// 
class Chain {
    constructor(difficulty) {
        this.difficulty = difficulty;
        this.blocks = []; 
        this.utxos = {}; 
    }

    /**
     * determines whether the block is valid and can be added to the chain 
     * @param {Block} block the block to validate 
     * @param {int} index index at which the block exists, or is intended to be added 
     * @returns {bool}
     */
    /*bool*/ validateBlock(block, index) {
        return exception.try(() => {            

            //ignore genesis block
            if (index <= 0) 
                return true; 
    
            const prevBlock = this.blocks[index-1]; 
            if (prevBlock.hash !== block.prevHash) {
                console.log('previous hash not valid'); 
                return false;
            }
            else if (block.prevHash !== prevBlock.calculateHash()) {
                console.log('previous hash not equal to hash'); 
                return false;
            }
            else if (block.hash !== block.calculateHash()) {
                console.log('current hash not valid');
                return false;
            }
            else if (!block.isMined()) {
                console.log('block not mined'); 
                return false;
            }
    
            return true; 
        });
    }
    
    /**
     * gets the number of blocks in the chain
     * @returns {int}
     */
    /*int*/ size() {
        return this.blocks.length; 
    }

    /**
     * returns the last (most recently added) block on the chain
     * @returns {Block}
     */
    /*Block*/ lastBlock() {
        return (this.blocks.length ? this.blocks[this.size()-1] : null);  
    }

    /**
     * returns the block with the given hash, or null
     * @param {string} hash
     * @returns {Block}
     */
    /*Block*/ getBlockByHash(hash) {
        if (this.blocks && this.blocks.length) {
            for (let n=this.blocks.length-1; n>=0; n--) {
                if (this.blocks[n].hash === hash) {
                    return this.blocks[n];
                }
            }
        }
        return null;
    }
    
    /**
     * add a new block to the chain
     * @param {Block} block 
     * @returns {bool}
     */
    /*bool*/ addBlock(block) {
        return exception.try(() => {
            
            if (this.blocks.length === 0) {
                this.blocks.push(block); 
            }
            else {
                if (this.validateBlock(block, this.size()))
                    this.blocks.push(block); 
                else 
                    return false;
            }
    
            return true;
        });
    }

    /**
     * returns true if a block with the same has exists in the chain
     * @param {Block} block 
     * @returns {bool}
     */
    /*bool*/ blockExists(block) {
        return exception.try(() => {
            let output = false; 
            for (let n=0; n<this.blocks.length; n++) {
                if (this.blocks[n].hash === block.hash) {
                    output = true; 
                    break;
                }
            }

            return output; 
        });
    }
    
    /**
     * returns true if the entire chain consists of valid blocks
     * @returns {bool}
     */
    /*bool*/ isValid() {
        return exception.try(() => {
            for (let n=1; n<this.blocks.length; n++) {
                if (!this.validateBlock(this.blocks[n], n))
                    return false;
            }
            return true;
        });
    }
    
    /**
     * gets a list of all unspent transaction outputs (UTXOs)
     * @returns {Output[]}
     */
    /*Output[]*/ getUtxos() {
        return exception.try(() => {
            const output = []; 
            for (let id in this.utxos) {
                output.push(id); 
            }
            return output; 
        });
    }

    /**
     * gets a single UTXO, specified by id
     * @param {string} id the id of the desired UTXO 
     * @returns {Output}
     */
    /*Output*/ getUtxo(id) {
        return exception.try(() => {
            return this.utxos[id]; 
        });
    }

    /**
     * adds a UTXO 
     * @param {*} utxo 
     */
    addUtxo(utxo) {
        exception.try(() => {
            if (utxo && utxo.id) {
                this.utxos[utxo.id] = utxo; 
            }
        });
    }

    /**
     * removes the specified UTXO 
     * @param {*} id the id of the UTXO to remove
     * @returns {bool} true on successful removal
     */
    /*bool*/ removeUtxo(id) {
        exception.try(() => {
            if (this.utxos[id]) {
                delete this.utxos[id]; 
                return true;
            }
            return false;
        });
    }

    /**
     * converts the whole chain to a json representation
     * @returns {json}
     */
    /*json*/ serialize() {
        return exception.try(() => {
            const output = {
                difficulty: this.difficulty,
                blocks: [],
                utxos: {}
            }; 

            this.blocks.forEach((block) => {
                output.blocks.push(block.serialize());
            });

            if (this.utxos) {
                for (let id in this.utxos) {
                    output.utxos[id] = this.utxos[id]; 
                }
            }

            return output; 
        });
    }
}

module.exports = {
    class: Chain,
    deserialize: (data) => { 
        return exception.try(() => {
            const output = new Chain(data.difficulty); 
            const deserializeBlock = require('./Block').deserialize;
            const deserializeOutput = require('./Output').deserialize;

            if (data.blocks) {
                data.blocks.forEach((block) => {
                    output.blocks.push(deserializeBlock(block, output)); 
                });
            }

            if (data.utxos) {
                for (let id in data.utxos) {
                    output.utxos[id] = deserializeOutput(data.utxos[id]); 
                }
            }

            return output; 
        });
    }
};