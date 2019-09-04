'use strict';

/**
 * minacoin: IDatabase
 * -------------------
 * interface for app database which stores things like the blockchain 
 * and wallet info. 
 *
 * author: John R. Kosinski
 */
class IDatabase {
    saveBlockchain(blockchain) { }
    getBlockchain() { }
    saveWallet(wallet) { }
    getWallet() { }
}

module.exports = IDatabase;