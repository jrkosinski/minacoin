'use strict';

const LOG_TAG = "LDB";

const ioc = require('../../util/iocContainer');
const fs = require('fs');
const IDatabase = require('./IDatabase');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

/**
 * minacoin: LocalJsonDb
 * ---------------------
 * implementation of IDatabase that reads/writes local files. 
 *
 * author: John R. Kosinski
 */
class LocalFileDb extends IDatabase {
    constructor() {
        super();
    }

    /**
     * serialize & save the given blockchain to data source
     * @param {Blockchain} blockchain
     */
    async saveBlockchain(blockchain) {
        await this.save('blockchain', blockchain);
    }

    /**
     * read blockchain data from data source and return as json
     * @returns {json}
     */
    /*json*/ async getBlockchain() {
        return await this.read('blockchain');
    }

    /**
     * serialize & save the given wallet to data source
     * @param {Wallet} wallet
     */
    async saveWallet(wallet) {
        await this.save('wallet', wallet);
    }

    /**
     * read wallet data from data source and return as Wallet instance
     * @returns {json}
     */
    /*json*/ async getWallet() {
        return await this.read('wallet');
    }

    /**
     * writes a value (json object) to a DB file 
     * @param {string} key 
     * @param {json} obj 
     */
    async save(key, obj) {
        await exception.tryAsync(async () => {
            let data = {};
            if (obj) {
                data = JSON.stringify(obj.toJson());
            }
            await writeFile(key + '.txt', data);
        });
    }

    /**
     * reads a value (json object) from the DB file 
     * @param {string} key 
     */
    async read(key) {
        return await exception.tryAsync(async () => {
            const data = await readFile(key + '.txt');
            return data ? JSON.parse(data) : null;
        });
    }
}


/**
 * write string data to a text file
 * @param {string} path
 * @param {string} data
 * @returns {Promise(bool)}
 */
function /*bool*/ writeFile(path, data) {
    exception.try(() => {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(true);
            });
        });
    });
}

/**
 * read string data from a text file
 * @param {string} path
 * @returns {Promise(string)}
 */
function /*string*/ readFile(path) {
    return exception.try(() => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    logger.error(err);
                    resolve(null);
                }
                else {
                    resolve(data.toString());
                }
            });
        });
    });
}

const database = new LocalFileDb();
module.exports = database;