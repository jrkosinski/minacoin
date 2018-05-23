'use strict'; 

const exception = require('../util/exceptions')('CHAIN'); 

// ======================================================================================================
function Chain(difficulty) {
    const _this = this; 
    const _blocks = []; 
    const _utxos = {}; 

    this.difficulty = difficulty;

    // ------------------------------------------------------------------------------------------------------
    const validateBlock = (block, index) => {
        return exception.try(() => {
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
    this.size = () => {
        return _blocks.length; 
    }; 
    
    // ------------------------------------------------------------------------------------------------------
    this.addBlock = (block) => {
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
    this.getUtxos = () => {
        return exception.try(() => {
            const output = []; 
            for (let id in _utxos) {
                output.push(id); 
            }
            return output; 
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    this.getUtxo = (id) => {
        return exception.try(() => {
            return _utxos[id]; 
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    this.addUtxo = (utxo) => {
        exception.try(() => {
            if (utxo && utxo.id) {
                _utxos[utxo.id] = utxo; 
            }
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    this.removeUtxo = (id) => {
        exception.try(() => {
            delete _utxos[id]; 
        });
    }; 
}

module.exports = Chain;