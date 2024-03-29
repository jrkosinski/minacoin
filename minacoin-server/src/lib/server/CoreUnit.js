'use strict';

const LOG_TAG = 'BCU';

const ioc = require('../../util/iocContainer');

//imports
const { Miner } = require('../miner');
const { Blockchain } = require('../blockchain');
const { Wallet, TransactionPool } = require('../wallet');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

//TODO: add comments here 
class CoreUnit {
    
    constructor(config) {
        this.blockchain = null; 
        this.wallet = null; 
        this.txPool = null; 
        this.miner = null; 
        this.config = config;
    }
    
    async initialize() { 
        await exception.tryAsync(async () => {
            //create instance of blockchain
            this.blockchain = await initializeBlockchain(this.config);
        
            //on blockchain changes, save to database
            this.blockchain.on('update', () => {
                ioc.database.saveBlockchain(this.blockchain);
            });
        
            //create instance of wallet
            this.wallet = await initializeWallet(this.config);
        
            //on wallet changes, save to database
            this.wallet.on('update replace', () => {
                ioc.database.saveWallet(this.wallet);
            });
        
            //create transaction pool
            this.txPool = new TransactionPool();
        
            //create a miner
            this.miner = new Miner(this.blockchain, this.txPool, this.wallet);
        });
    }
    
    /*Transaction[]*/ getTxPoolTransactions() { 
        return exception.try(() => {
            return this.txPool.validTransactions(this.blockchain); 
        });
    }
    
    /*string*/ getWalletAddress() {
        return exception.try(() => {
            return this.wallet.publicKey;
        });
    }
    
    /*json*/ getBlockchainInfo() { 
        return exception.try(() => {
            this.wallet.updateBalance(this.blockchain);
            return {
                address: this.wallet.publicKey, 
                balance: this.wallet.balance, 
                chainSize: this.blockchain.height, 
                
                transactionPool: {
                    count: this.txPool.txCount, 
                    pending: this.txPool.pendingTransactions(this.wallet.publicKey)
                }
            }; 
        });
    }
    
    /*json*/ getBlocks() { 
        return exception.try(() => {
            return this.blockchain.toJson();
        });
    }
    
    /*Transaction*/ transferTo(recipAddr, amount) { 
        return exception.try(() => {
            return this.wallet.createTransaction(
                recipAddr,
                amount,
                this.blockchain,
                this.txPool
            );
        });
    }
    
    /*Block*/ mine() { 
        return exception.try(() => {
            const block = this.miner.mine();
            return block;
        });
    }
    
    /*float*/ getWalletBalance(address) {
        return exception.try(() => {
            return this.blockchain.getWalletBalance(address); 
        });
    }
    
    /*bool*/ replaceChain(blocks) {
        return exception.try(() => {
            return this.blockchain.replaceChain(blocks);
        });
    } 
    
    /*void*/ updateWallet() {
        exception.try(() => {
            this.wallet.updateBalance(this.blockchain); 
        });
    }
    
    /*void*/ addTxToPool(tx) {
        exception.try(() => {
            this.txPool.updateOrAddTransaction(tx); 
        });
    }
    
    /*void*/ clearTxPool() {
        exception.try(() => {
            this.txPool.clear();
        });
    }
    
    /*void*/ deallocate() {
        exception.try(() => {
            
        });
    }
}


async function initializeBlockchain(config) {
    return await exception.tryAsync(async () => {
        logger.info('initializing blockchain...');

        let blockchain = null;

        if (config.USE_DATABASE) {
            let blockchainData = await ioc.database.getBlockchain();
            if (blockchainData) {
                blockchain = Blockchain.fromJson(blockchainData);
            }
        }

        if (!blockchain) {
            logger.info('no blockchain found in DB; creating new one...')
            blockchain = new Blockchain();
            ioc.database.saveBlockchain(blockchain);
        }

        return blockchain;
    });
}

async function initializeWallet(config) {
    return await exception.tryAsync(async () => {
        logger.info('initializing wallet...');

        let wallet = null;

        if (config.USE_DATABASE) {
            let walletData = await ioc.database.getWallet();
            if (walletData) {
                wallet = Wallet.fromJson(walletData);
            }
        }

        if (!wallet) {
            logger.info('no wallet found in DB; creating new one...')
            wallet = new Wallet();
            ioc.database.saveWallet(wallet);
        }

        return wallet;
    });
}


module.exports = { CoreUnit };