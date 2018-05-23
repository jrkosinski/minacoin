'use strict'; 

const exception = require('../util/exceptions')('CHAIN'); 

// ======================================================================================================
// Chain
// 
// generic blockchain 
// 
// @difficulty: number of zeros that must be solved for when mining (PoW)
// 
function Chain(difficulty) {
    const _this = this; 
    const _blocks = []; 
    const _utxos = {}; 

    this.difficulty = difficulty;

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
    
            const prevBlock = _blocks[index-1]; 
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
        return _blocks.length; 
    }; 
    
    // ------------------------------------------------------------------------------------------------------
    // add a new block to the chain 
    // 
    // @block: the block to add
    // 
    /*bool*/ this.addBlock = (block) => {
        return exception.try(() => {
            
            if (_blocks.length === 0) {
                _blocks.push(block); 
            }
            else {
                if (validateBlock(block, _this.size()))
                    _blocks.push(block); 
                else 
                    return false;
            }
    
            return true;
        });
    }; 
    
    // ------------------------------------------------------------------------------------------------------
    //TODO: implement 
    this.isValid = () => {
        return exception.try(() => {
            return true; 
        });
    };
    
    // ------------------------------------------------------------------------------------------------------
    // gets a list of all unspent transaction outputs (UTXOs)
    // 
    /*Output[]*/ this.getUtxos = () => {
        return exception.try(() => {
            const output = []; 
            for (let id in _utxos) {
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
            return _utxos[id]; 
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
                _utxos[utxo.id] = utxo; 
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
            if (_utxos[id]) {
                delete _utxos[id]; 
                return true;
            }
            return false;
        });
    }; 
}

module.exports = Chain;