'use strict'; 

const async = require('asyncawait/async');
const await = require('asyncawait/await');
const fs = require('fs'); 

const core = require('minacoin-core'); 
const common = require('minacoin-common'); 

const exception = common.exceptions('CWAL');

// ======================================================================================================
// Database
// 
// John R. Kosinski 
// 27 May 2018
// 
function Database() {
    const _this = this; 
    const _filename = 'database.txt'; 

    // ------------------------------------------------------------------------------------------------------
    // write string data to a text file 
    // 
    const /*bool*/ writeFile = (path, data) => {
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
    }; 

    // ------------------------------------------------------------------------------------------------------
    // read string data from a text file 
    // 
    const /*string*/ readFile = (path) => {
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
    }; 
    

    // ------------------------------------------------------------------------------------------------------
    // serialize & save the given wallet to data source 
    // 
    this.saveWallet = async((wallet) => {
        exception.try(() => {
            const data = JSON.stringify(wallet.serialize()); 
            await(writeFile(_filename, data));
        });
    }); 

    // ------------------------------------------------------------------------------------------------------
    // read wallet data from data source and return as Wallet instance 
    // 
    /*Wallet*/ this.getWallet = async(() => {
        return exception.try(() => {
            const data = await(readFile(_filename)); 
            if (data) 
                return core.deserializeWallet(JSON.parse(data)); 
            
            return null;
        });
    }); 
}

module.exports = Database;