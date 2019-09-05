'use strict';

const LOG_TAG = 'BLK';

const cryptoUtil = require('../../../util/cryptoUtil');
const { DIFFICULTY,MINE_RATE } = require('../../../config.js');
const ioc = require('../../../util/iocContainer');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

/**
 * minacoin: Block
 * ---------------
 * implementation of a Blockchain block. 
 *
 * author: John R. Kosinski
 */
class Block{
    get timestamp() { return this._timestamp; }
    get lastHash() { return this._lastHash; }
    get hash() { return this._hash; }
    get data() { return this._data; }
    get nonce() { return this._nonce; }
    get difficulty() { return this._difficulty; }

    constructor(timestamp, lastHash, hash, data, nonce, difficulty){
        this._timestamp = timestamp;
        this._lastHash = lastHash;
        this._hash = hash;
        this._data = data;
        this._nonce = nonce;
        this._difficulty = difficulty || DIFFICULTY;

        logger.info('block created: ' + this.toJsonString());
    }

    set data(d) { this._data = d; }

    /**
     * creates the special genesis block
     * @returns {Block}
     */
    static /*Block*/ genesis() {
        return exception.try(() => {
            return new this('Genesis time','----','f1574-h4gh',[],0,DIFFICULTY);
        });
    }

    /**
     * creates & returns a hash of the given data
     * 
     * @param {int} timestamp block timestamp
     * @param {string} lastHash hash of intended parent block
     * @param {Transaction[]} data the data to include in the block
     * @param {int} nonce created during mining
     * @param {int} difficulty block mining difficulty
     * @returns {string}
     */
    static /*string*/ hash(timestamp, lastHash, data, nonce, difficulty){
        return exception.try(() => {
            return cryptoUtil.hash({timestamp, lastHash, data, nonce, difficulty});
        });
    }

    /**
     * mines a new block to be added to the chain, and returns it (without adding it to
     * the blockchain)
     *
     * @param {Block} lastBlock the parent block (should be most recent block in chain)
     * @param {Transaction[]} data transactions to be included in the block
     */
    static /*Block*/ mineBlock(lastBlock, data){
        return exception.try(() => {
            let hash;
            let timestamp = Date.now();
            const lastHash = lastBlock.hash;
            let { difficulty } = lastBlock;
            let nonce = 0;  

            do {
                nonce++;
                timestamp = Date.now();
                difficulty = Block.adjustDifficulty(lastBlock, timestamp);
                hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
            } while(hash.substring(0,difficulty) !== '0'.repeat(difficulty));

            logger.info(`block ${hash} mined`);
            return new this(timestamp, lastHash, hash, data, nonce, difficulty);
        });
    }

    /**
     * creates & returns a hash of the given block's essential data
     * @returns string
     * @param {Block} block
     */
    static /*string*/ blockHash(block){
        return exception.try(() => {
            //destructuring
            const { timestamp, lastHash, data, nonce,difficulty } = block;
            return Block.hash(timestamp, lastHash, data, nonce, difficulty);
        });
    }

    static /*int*/ adjustDifficulty(lastBlock, currentTime){
        return exception.try(() => {
            let { difficulty } = lastBlock;
            difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
            return difficulty;
        });
    }

    /**
     * returns a string representation
     */
    toString() {
        return exception.try(() => {
            return `Block -
            Timestamp : ${this.timestamp}
            Last Hash : ${this.lastHash.substring(0,10)}
            Hash      : ${this.hash.substring(0,10)}
            Data      : ${this.data}
            Difficulty: ${this.difficulty}`;
        });
    }

    /**
     * returns a json representation
     */
    /*json*/ toJson() {
        const output = {
            timestamp: this.timestamp,
            lastHash: this.lastHash,
            hash: this.hash,
            difficulty: this.difficulty,
            nonce: this.nonce,
            data: [

            ]
        };

        if (this.data && this.data.length) {
            this.data.forEach(t => {
                if (t.toJson) 
                    output.data.push(t.toJson());
            });
        }

        return output;
    }

    /**
     * returns a json representation converted to string
     */
    /*string*/ toJsonString() {
        return JSON.stringify(this.toJson());
    }

    /**
     * deserializes a Block instance from JSON data
     * @returns {Block}
     * @param {json} json
     */
    static /*Block*/ deserialize(json) {
        return exception.try(() => {
            const output = new this(json.timestamp, json.lastHash, json.hash, [], json.nonce, json.difficulty);

            if (json.data) {
                json.data.forEach(t => {
                    output.data.push(Transaction.deserialize(t));
                });
            }

            return output;
        });
    }
}


module.exports = Block;
