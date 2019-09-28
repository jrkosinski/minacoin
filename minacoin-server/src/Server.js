'use strict';

const LOG_TAG = 'SRV';

const ioc = require('./util/iocContainer');

//imports
const { Miner } = require('./lib/miner');
const { Blockchain } = require('./lib/blockchain');
const { Wallet, TransactionPool } = require('./lib/wallet');
const { HttpServer } = require('./HttpServer');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

class Server {
    constructor(config) {
        this.config = config;
    }
    
    async run() {
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
    
        //create instance of P2P server
        this.p2pServer = ioc.p2pServerFactory.createInstance(this.blockchain, this.txPool, this.wallet);
    
        //create a miner
        this.miner = new Miner(this.blockchain, this.txPool, this.wallet, this.p2pServer);
    
        //create and start server
        this.httpServer = new HttpServer(
            this.config.HTTP_PORT, 
            this.blockchain, 
            this.wallet, 
            this.p2pServer, 
            this.txPool, 
            this.miner
        );
        this.httpServer.start();
        
        //createTestChain(); 
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

//TODO: convert these to unit tests 
async function createTestChain() {
    const blockchain = new Blockchain(); 
    const txPool = new TransactionPool(); 
    
    const wallet1 = new Wallet(); 
    const wallet2 = new Wallet(); 
    const wallet3 = new Wallet(); 

    const miner1 = new Miner(blockchain, txPool, wallet1); 
    const miner2 = new Miner(blockchain, txPool, wallet2); 
    const miner3 = new Miner(blockchain, txPool, wallet3); 
    
    wallet1.createTransaction(wallet2.publicKey, 10, blockchain, txPool); 
    wallet1.createTransaction(wallet3.publicKey, 10, blockchain, txPool); 
    wallet3.createTransaction(wallet2.publicKey, 100, blockchain, txPool);     
    
    miner1.mine(); 
    
    wallet1.updateBalance(blockchain);
    wallet2.updateBalance(blockchain);
    wallet3.updateBalance(blockchain);
    
    console.log('wallet 1 balance: ' + wallet1.balance);
    console.log('wallet 2 balance: ' + wallet2.balance);
    console.log('wallet 3 balance: ' + wallet3.balance);
    
    ioc.database.saveBlockchain(blockchain); 
    const bc = Blockchain.fromJson(await ioc.database.getBlockchain()); 
    
    wallet2.createTransaction(wallet1.publicKey, 10, blockchain, txPool); 
    wallet3.createTransaction(wallet1.publicKey, 10, blockchain, txPool); 
    wallet2.createTransaction(wallet3.publicKey, 100, blockchain, txPool);     
    
    miner3.mine();
    
    wallet1.updateBalance(blockchain);
    wallet2.updateBalance(blockchain);
    wallet3.updateBalance(blockchain);
    
    console.log('wallet 1 balance: ' + wallet1.balance);
    console.log('wallet 2 balance: ' + wallet2.balance);
    console.log('wallet 3 balance: ' + wallet3.balance);
}

async function runTestServers() {
    const server1 = new Server({
        
    }); 
    const server2 = new Server(); 
    const server3 = new Server(); 
}


module.exports = Server;