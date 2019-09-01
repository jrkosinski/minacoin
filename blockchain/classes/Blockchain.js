'use strict';

const LOG_TAG = 'BLKCH';

const Block = require('./Block');
const ioc = require('../../util/iocContainer');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

class Blockchain{
    get chain() { return this._chain; }
    get height() { return this._chain.length; }

    constructor(){
        this._chain = [Block.genesis()];
    }

    addBlock(data){
        return exception.try(() => {
            const block = Block.mineBlock(this.chain[this.chain.length-1],data);
            this.chain.push(block);
            logger.info(`block ${block.hash} added to chain. new chain height: ${this.height}`);

            return block;
        });
    }

    isValidChain(chain){
        return exception.try(() => {
            if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
                logger.warn('invalid chain: invalid genesis block');
                return false;
            }

            for(let i = 1 ; i<chain.length; i++){
                const block = chain[i];
                const lastBlock = chain[i-1];

                if((block.lastHash !== lastBlock.hash) || (
                    block.hash !== Block.blockHash(block))) {
                        logger.warn(`invalid chain: invalid block ${block.hash}`);
                        return false;
                    }
            }

            return true;
        });
    }

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
        });
    }
}

module.exports = Blockchain;