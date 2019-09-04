'use strict';

const LOG_TAG = 'IDX';

//configure IOC container
const ioc = require('./util/iocContainer');
ioc.service('loggerFactory', c => require('./util/winstonLogger'));
ioc.service('ehFactory', c => require('./util/exceptionHandler'));
ioc.service('p2pServerFactory', c=> require('./p2p/classes/SwarmP2PServer').factory);
ioc.service('database', c=> require('./database/classes/LocalJsonDb'));

//imports
const { Miner } = require('./miner');
const { Block, Blockchain } = require('./blockchain');
const { Wallet, Transaction, TransactionPool } = require('./wallet');
const { Server } = require('./server');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);


async function run() {
    //create instance of blockchain
    const blockchain = await initializeBlockchain();

    //on blockchain changes, save to database
    blockchain.on('update', () => {
        ioc.database.saveBlockchain(blockchain);
    });

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
}



async function initializeBlockchain() {
    return await exception.tryAsync(async () => {
        logger.info('initializing blockchain...');

        let blockchain = null;

        if (config.USE_DATABASE) {
            let blockchainData = await ioc.database.getBlockchain();
            if (blockchainData) {
                blockchain = Blockchain.deserialize(blockchainData);
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
                wallet = Wallet.deserialize(walletData);
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


run();