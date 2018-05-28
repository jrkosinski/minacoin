'use strict'; 

const common = require('minacoin-common');
const exception = common.exceptions('CHAIN'); 

// ======================================================================================================
// Chain
// 
// generic blockchain 
// 
// @difficulty: number of zeros that must be solved for when mining (PoW)
// 
function Chain(difficulty) {
    const _this = this; 

    this.difficulty = difficulty;
    this.blocks = []; 
    this.utxos = {}; 

    // ------------------------------------------------------------------------------------------------------
    // determines whether the block is valid and can be added to the chain 
    // 
    // @block: the block to validate 
    // @index: index at which the block exists, or is intended to be added 
    // 
    const /*bool*/ validateBlock = (block, index) => {
        return exception.try(() => {            

            //ignore genesis block
            if (index <= 0) 
                return true; 
    
            const prevBlock = _this.blocks[index-1]; 
            if (prevBlock.hash !== block.getPrevHash()) {
                console.log('previous hash not valid'); 
                return false;
            }
            else if (block.getPrevHash() !== prevBlock.calculateHash()) {
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
    }; 

    // ------------------------------------------------------------------------------------------------------
    // gets the number of blocks in the chain
    //
    /*int*/ this.size = () => {
        return _this.blocks.length; 
    }; 
    
    // ------------------------------------------------------------------------------------------------------
    // add a new block to the chain 
    // 
    // @block: the block to add
    // 
    /*bool*/ this.addBlock = (block) => {
        return exception.try(() => {
            
            if (_this.blocks.length === 0) {
                _this.blocks.push(block); 
            }
            else {
                if (validateBlock(block, _this.size()))
                    _this.blocks.push(block); 
                else 
                    return false;
            }
    
            return true;
        });
    };

    // ------------------------------------------------------------------------------------------------------
    // returns true if a block with the same has exists in the chain
    // 
    /*bool*/ this.blockExists = (block) => {
        return exception.try(() => {
            const output = false; 
            for (let n=0; n<_this.blocks.length; n++) {
                if (_this.blocks[n].hash === block.hash) {
                    output = true; 
                    break;
                }
            }

            return output; 
        });
    };
    
    // ------------------------------------------------------------------------------------------------------
    // returns true if the entire chain consists of valid blocks 
    // 
    /*bool*/ this.isValid = () => {
        return exception.try(() => {
            for (let n=1; n<_this.blocks.length; n++) {
                if (!validateBlock(_this.blocks[n], n))
                    return false;
            }
            return true;
        });
    };
    
    // ------------------------------------------------------------------------------------------------------
    // gets a list of all unspent transaction outputs (UTXOs)
    // 
    /*Output[]*/ this.getUtxos = () => {
        return exception.try(() => {
            const output = []; 
            for (let id in _this.utxos) {
                output.push(id); 
            }
            return output; 
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    // gets a single UTXO, specified by id
    // 
    // @id: the id of the desired UTXO 
    // 
    /*Output*/ this.getUtxo = (id) => {
        return exception.try(() => {
            return _this.utxos[id]; 
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    // adds a UTXO 
    // 
    // @utxo: the output to add
    // 
    this.addUtxo = (utxo) => {
        exception.try(() => {
            if (utxo && utxo.id) {
                _this.utxos[utxo.id] = utxo; 
            }
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    // removes the specified UTXO 
    // 
    // @id: the id of the UTXO to remove
    // 
    // returns: true if removed 
    /*bool*/ this.removeUtxo = (id) => {
        exception.try(() => {
            if (_this.utxos[id]) {
                delete _this.utxos[id]; 
                return true;
            }
            return false;
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    // converts the whole chain to a json representation
    // 
    /*json*/ this.serialize = () => {
        return exception.try(() => {
            const output = {
                difficulty: _this.difficulty,
                blocks: [],
                utxos: {}
            }; 

            _this.blocks.forEach((block) => {
                output.blocks.push(block.serialize());
            });

            if (_this.utxos) {
                for (let id in _this.utxos) {
                    output.utxos[id] = _this.utxos[id]; 
                }
            }

            return output; 
        });
    }; 
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
                    output.blocks.push(deserializeBlock(block)); 
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