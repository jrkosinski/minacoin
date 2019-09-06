'use strict';

const LOG_TAG = 'IDX';

//configure IOC container
const ioc = require('./util/iocContainer');
ioc.service('loggerFactory', c => require('./util/winstonLogger'));
ioc.service('ehFactory', c => require('./util/exceptionHandler'));
ioc.service('p2pServerFactory', c=> require('./lib/p2p/classes/SwarmP2PServer').factory);
ioc.service('database', c=> require('./lib/database/classes/LocalJsonDb'));

//imports
const { Miner } = require('./lib/miner');
const { Block, Blockchain } = require('./lib/blockchain');
const { Wallet, Transaction, TransactionPool } = require('./lib/wallet');
const { Server } = require('./server');
const config = require('./config');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);


async function run() {
    //create instance of blockchain
    const blockchain = await initializeBlockchain();

    //on blockchain changes, save to database
    blockchain.on('update', () => {
        ioc.database.saveBlockchain(blockchain);
    });

    //create instance of wallet
    const wallet = await initializeWallet();

    //on wallet changes, save to database
    wallet.on('update replace', () => {
        ioc.database.saveWallet(wallet);
    });

    //create transaction pool
    const txPool = new TransactionPool();

    //create instance of P2P server
    const p2pServer = ioc.p2pServerFactory.createInstance(blockchain, txPool, wallet);

    //create a miner
    const miner = new Miner(blockchain, txPool, wallet, p2pServer);

    //create and start server
    const server = new Server(blockchain, wallet, p2pServer, txPool, miner);
    server.start();
    
    //createTestChain(); 
}



async function initializeBlockchain() {
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

async function initializeWallet() {
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
    const wallet1 = new Wallet(); 
    const wallet2 = new Wallet(); 
    const wallet3 = new Wallet(); 
    
    const blockchain = new Blockchain(); 
    const txPool = new TransactionPool(); 

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

run();