'use strict'; 

const fs = require('fs'); 

const core = require('minacoin-core'); 
const common = require('minacoin-common'); 

const exception = common.exceptions('DB');

// 
// Database
// 
// John R. Kosinski 
// 27 May 2018
// 
class Database {
    constructor() {
        this._filename = 'database.txt'; 
    }
    
    /**
     * serialize & save the given wallet to data source 
     * @param {Wallet} wallet 
     */
    async saveWallet(wallet) {
        exception.try(() => {
            const data = JSON.stringify(wallet.serialize()); 
            await writeFile(this._filename, data);
        });
    }

    /**
     * read wallet data from data source and return as Wallet instance 
     * @returns {Wallet}
     */
    /*Wallet*/ async getWallet() {
        return exception.try(() => {
            const data = await readFile(this._filename); 
            if (data) 
                return core.deserializeWallet(JSON.parse(data)); 
            
            return null;
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


module.exports = Database;