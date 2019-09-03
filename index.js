'use strict';

const LOG_TAG = 'IDX';

//configure IOC container
const ioc = require('./util/iocContainer');
ioc.service('loggerFactory', c => require('./util/winstonLogger'));
ioc.service('ehFactory', c => require('./util/exceptionHandler'));
ioc.service('p2pServerFactory', c=> require('./p2p/classes/TestP2PServer').factory);

//imports
const { Miner } = require('./miner');
const { Block, Blockchain } = require('./blockchain');
const { Wallet, Transaction, TransactionPool } = require('./wallet');
const { Server } = require('./server');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);


//create instance of blockchain
const blockchain = new Blockchain();

logger.info('creating new wallet...');
const wallet = new Wallet();

//create transaction pool
const txPool = new TransactionPool();

//create instance of P2P server
const p2pServer = ioc.p2pServerFactory.createInstance(blockchain, txPool, wallet);

//create a miner
const miner = new Miner(blockchain, txPool, wallet, p2pServer);

//create and start server
const server = new Server(blockchain, wallet, p2pServer, txPool, miner);
server.start();
