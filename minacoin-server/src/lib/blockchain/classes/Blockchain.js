'use strict';

const LOG_TAG = 'BLKCH';

const Block = require('./Block');
const ioc = require('../../../util/iocContainer');
const EventEmitter = require('events');
const R = require('ramda');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

/**
 * minacoin: Blockchain
 * --------------------
 * container for all blocks. supports these events: 
 * - update
 * - replace 
 *
 * author: John R. Kosinski
 */
class Blockchain{
    get chain() { return this._chain; }
    get height() { return this._chain.length; }

    /**
     * constructor 
     */
    constructor(){
        this._emitter = new EventEmitter();
        this._chain = [Block.genesis()];
    }
    
    /**
     * returns a list of all transactions, in all blocks, sorted first by block number 
     * and then by timestamp. 
     */
    /*Transaction*/ allTransactions() {
        return extractTransactionsFromBlocks(this.chain);
    }
    
    /**
     * searches the blockchain to see if a transaction with the same id exists.
     * @param {string} id id of the transaction in question
     * @returns {bool} true if a transaction with the same id exists
     */
    /*bool*/ containsTransaction(id) {
        return this.findTransaction(id);
    }
    
    /**
     * the opposite of containsTransaction(id). this one will return the block index 
     * (1-based) of the block that contains the specified transaction.  
     * @param {string} id 
     * @returns {int} the 1-based block index of the found transaction 
     * (return value of 0 indicates transaction is not found)
     */
    /*int*/ findTransaction(id) {
        return exception.try(() => {
            const allTransactions = this.allTransactions().reverse(); 
            for (let n=0; n<allTransactions.length; n++) {
                const t = allTransactions[n];
                if (id === t.id) {
                    return (n+1);
                }
            }
            
            return 0;
        });
    }

    /**
     * mines a new block, includes the given transactions, and appends it to the chain. 
     * @param {Transaction[]} data transactions to add to the new block
     * @returns {Block}
     */
    /*Block*/ addBlock(data){
        return exception.try(() => {
            const block = Block.mineBlock(this.chain[this.chain.length-1], data);
            
            //check here to make sure that duplicate transactions don't exist
            if (data) {
                for (let t in data) {
                    if (this.containsTransaction(t.id)) {
                        //reject block
                        logger.warn(`block is being rejected, because transaction ${t.id} is a duplicate`);
                        return null;
                    } 
                };
            }
            
            this.chain.push(block);
            logger.info(`block ${block.hash} added to chain. new chain height: ${this.height}`);

            this._emitter.emit('update');
            return block;
        });
    }

    /**
     * validates each block in the chain. 
     * @param {Blockchain} chain 
     * @returns {bool} false if chain is invalid 
     */
    /*bool*/ isValidChain(chain) {
        return exception.try(() => {
            if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
                logger.warn('invalid chain: invalid genesis block');
                return false;
            }
            
            //if the last block has a transaction that exists elsewhere in the chain, then 
            // the chain is invalid 
            if (chain.length > 1) {
                //get all transactions from ALL BUT LAST block
                const allTrans = extractTransactionsFromBlocks(R.init(chain)); 
                
                //examine all transactions in last block for duplicity
                const lastBlock = chain[chain.length-1]; 
                for(let i=0; i<lastBlock.data.length; i++) {
                    const t = lastBlock.data[i]; 
                    if (R.find(R.propEq('id', t.id))(allTrans)) {
                        logger.warn(`invalid chain: transaction ${t.id} is duplicated`);
                        return false;
                    }
                }
            }

            //if the chain has any invalid blocks, then the chain is invalid
            //TODO: redo with ramda
            for (let i=1; i<chain.length; i++) {
                const block = chain[i];
                const lastBlock = chain[i-1];
    
                if ((block.lastHash !== lastBlock.hash) || (block.hash !== Block.blockHash(block))) {
                    logger.warn(`invalid chain: invalid block ${block.hash}`);
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * replace the entire existing chain with the given one 
     * @param {BlockChain} newChain 
     */
    replaceChain(newChain){
        exception.try(() => {
            if (newChain.length <= this._chain.length){
                logger.info("received chain is not longer than the current chain");
                return;
            }
            else if (!this.isValidChain(newChain)){
                logger.info("received chain is invalid");
                return;
            }

            logger.info("replacing the current chain with new chain");
            this._chain = newChain;

            this._emitter.emit('update');
        });
    }

    /**
     * subscribe to an event 
     * @param {string} eventName 
     * @param {fn} callback 
     */
    on(eventName, callback) {
        if (eventName && callback) {
            this._emitter.on(eventName, callback);
        }
    }

    /**
     * returns a json representation
     */
    /*json*/ toJson() {
        const output = {
            chain: []
        };

        this._chain.forEach(b => {
            output.chain.push(b.toJson());
        });

        return output;
    }

    /**
     * deserializes a Blockchain instance from JSON data
     * @returns {Blockchain}
     * @param {json} json
     */
    static /*Blockchain*/ fromJson(json) {
        return exception.try(() => {
            const output = new this();

            output._chain = [];
            if (json && json.chain && json.chain.length) {
                json.chain.forEach(b => {
                    output._chain.push(Block.fromJson(b));
                });
            }

            return output;
        });
    }
}


function extractTransactionsFromBlocks(blocks) {    
    return exception.try(() => {
        const output = [];
        blocks.forEach(block => {
            output.push(...block.data.sort((a,b) => (a.input.timestamp < b.input.timestamp))); 
        });
        
        return output; 
    });
}

module.exports = Blockchain;