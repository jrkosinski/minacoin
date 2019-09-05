'use strict';

const LOG_TAG = 'BLKCH';

const Block = require('./Block');
const ioc = require('../../../util/iocContainer');
const EventEmitter = require('events');

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
        this._emitter = new EventEmitter();
    }

    /**
     * mines a new block, includes the given transactions, and appends it to the chain. 
     * @param {Transaction[]} data transactions to add to the new block
     * @returns {Block}
     */
    /*Block*/ addBlock(data){
        return exception.try(() => {
            const block = Block.mineBlock(this.chain[this.chain.length-1], data);
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
    /*bool*/ isValidChain(chain){
        return exception.try(() => {
            if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
                logger.warn('invalid chain: invalid genesis block');
                return false;
            }

            for(let i = 1 ; i<chain.length; i++){
                const block = chain[i];
                const lastBlock = chain[i-1];

                if ((block.lastHash !== lastBlock.hash) || (
                    block.hash !== Block.blockHash(block))) {
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
                logger.info("recieved chain is not longer than the current chain");
                return;
            }
            else if (!this.isValidChain(newChain)){
                logger.info("recieved chain is invalid");
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
    static /*Blockchain*/ deserialize(json) {
        return exception.try(() => {
            const output = new this();

            output._chain = [];
            if (json && json.chain && json.chain.length) {
                json.chain.forEach(b => {
                    output._chain.push(Block.deserialize(b));
                });
            }

            return output;
        });
    }
}

module.exports = Blockchain;