'use strict';

const fs = require('fs');
const IDatabase = require('./IDatabase');

class LocalFileDb extends IDatabase {
    constructor() {
    }

    /**
     * serialize & save the given blockchain to data source
     * @param {Blockchain} blockchain
     */
    async saveBlockchain(blockchain) {
        await this.save('blockchain', wallet);
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

    async save(key, obj) {
        await exception.tryAsync(async () => {
            let data = {};
            if (obj) {
                data = JSON.stringify(obj.toJson());
            }
            await writeFile(key + '.txt', data);
        });
    }

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
                if (err)
                    reject(err);
                else
                    resolve(data.toString());
            });
        });
    });
}

const database = new LocalFileDb();
module.exports = database;