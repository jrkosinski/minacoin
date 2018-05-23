'use strict'; 

const crypto = require('../util/crypto'); 
const merkle = require('../util/merkle'); 
const strings = require('../util/strings');

const exception = require('../util/exceptions')('BLCK'); 

// ======================================================================================================
function Block(chain, prevHash) {
    const _this = this; 
    const _transactions = [];
    const _prevHash = prevHash; 

    let _timestamp = new Date().getTime(); 
    let _merkleRoot = null; 
    let _nonce = 0; 

    this.chain = chain;

    // ------------------------------------------------------------------------------------------------------
    this.getPrevHash = () => {
        return _prevHash;
    }; 

    // ------------------------------------------------------------------------------------------------------
    this.calculateHash = () => {
        return exception.try(() => {
            return crypto.hashString(
                _prevHash + 
                _merkleRoot + 
                _nonce.toString() + 
                _timestamp.toString()
            );
        });
    }; 

    // ------------------------------------------------------------------------------------------------------
    this.addTransaction = (transaction) => {
        exception.try(() => {
            let output = true; 

            if (transaction) {
                //exclude genesis block
                if (_prevHash) {
                    if (!transaction.process()) {
                        console.log('transaction failed to process; discarding'); 
                        output = false;
                    }
                }
            }
            else 
                output = false;

            if (output) {
                _transactions.push(transaction); 
                console.log('successfully added transaction');                 
            }

            return output; 
        });
    }; 
    
    // ------------------------------------------------------------------------------------------------------
    this.mineBlock = () => {
        _this.merkleRoot = merkle.getMerkleRoot(_transactions); 
        
		//while(_this.hash.substring(0, difficulty) !== target) {
        while(strings.numZeros(_this.hash) !== _this.chain.difficulty) {
            _nonce++; 
            _this.hash = _this.calculateHash(); 
        }
        
		console.log("Block Mined!!! : " + _this.hash);
    };
    
    // ------------------------------------------------------------------------------------------------------
    this.isMined = () => {
        //TODO: implement 
        return true; 
    }; 
    
    this.hash = _this.calculateHash(); 
}

module.exports = Block;