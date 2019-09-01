'use strict';

const LOG_TAG = 'BLK';

const cryptoUtil = require('../../util/cryptoUtil');
const { DIFFICULTY,MINE_RATE } = require('../../config.js');
const ioc = require('../../util/iocContainer');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

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

    static /*Block*/ genesis() {
        return exception.try(() => {
            return new this('Genesis time','----','f1574-h4gh',[],0,DIFFICULTY);
        });
    }

    static hash(timestamp, lastHash, data, nonce, difficulty){
        return exception.try(() => {
            return cryptoUtil.hash({timestamp, lastHash, data, nonce, difficulty});
        });
    }

    static /*Block*/ mineBlock(lastBlock,data){
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
                hash = Block.hash(timestamp,lastHash,data,nonce,difficulty);
            } while(hash.substring(0,difficulty) !== '0'.repeat(difficulty));

            logger.info(`block ${hash} mined`);
            return new this(timestamp,lastHash,hash,data,nonce,difficulty);
        });
    }

    static blockHash(block){
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

    toJson() {
        return {
            timestamp: this.timestamp,
            lastHash: this.lastHash,
            hash: this.hash,
            difficulty: this.difficulty
        };
    }

    toJsonString() {
        return JSON.stringify(this.toJson());
    }
}


module.exports = Block;
