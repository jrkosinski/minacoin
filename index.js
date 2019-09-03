'use strict';

const LOG_TAG = 'IDX';

//configure IOC container
const ioc = require('./util/iocContainer');
ioc.service('loggerFactory', c => require('./util/winstonLogger'));
ioc.service('ehFactory', c => require('./util/exceptionHandler'));

const express = require('express');
const config = require('./config');
const { P2PServer } = require('./p2p');
const { Miner } = require('./miner');
const { Block, Blockchain } = require('./blockchain');
const { Wallet, Transaction, TransactionPool } = require('./wallet');
const { convertJson } = require('./util/jsonUtil');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

const blockchain = new Blockchain();

logger.info('creating new wallet...');
const wallet = new Wallet();

const txPool = new TransactionPool();
const server = new P2PServer(blockchain, txPool, wallet);

//create a miner
const miner = new Miner(blockchain, txPool, wallet, server);

logger.info('starting p2p server...');
server.listen();

const app = express();
const port = config.HTTP_PORT;

app.use(express.json());

//TODO: add request/response logging
//TODO: change these to be requests from P2P network
//TODO: balances are not updating when they should (only updating my wallet when I create a transaction)
//TODO: bug: I can send myself coins? that doesn't make sense

app.get('/transactions', (req, res) => {
    logger.info('GET /transactions');

    res.json(convertJson(txPool.transactions));
});

app.get('/public-key', (req, res) => {
    logger.info('GET /public-key');

    res.json({publicKey: wallet.publicKey, balance: wallet.balance });
});

//pass in: recipient, amount
app.post('/transact', (req, res) => {
    logger.info('POST /transact');

    exception.try(() => {
        const { recipient, amount } = req.body;
        const transaction = wallet.createTransaction(
            recipient,
            amount,
            blockchain,
            txPool
        );

        server.broadcastTransaction(transaction);
        res.redirect('/transactions');
    });
});

//TODO: should be POST request
app.post('/mine-transactions',(req, res)=>{
    logger.info('POST /mine-transactions');

    const block = miner.mine();
    logger.info(`new block added: ${block.toJsonString()}`);
    res.redirect('/blocks');
 })

logger.info('starting web server...');
app.listen(port, () => {
    logger.info(`app running on port ${port}`);
});

/*

const bc = new Blockchain();

const kp = require('./util/cryptoUtil').generateKeyPair();

const isValid = bc.isValidChain(bc.chain);
bc.addBlock('foo');
const isValid2 = bc.isValidChain(bc.chain);

bc.chain[0].data = 'bad data';
const isValid3 = bc.isValidChain(bc.chain);



const wallet = new Wallet();
const amount = 50;
const recipient = 'r3c1p13nt';
const transaction = Transaction.newTransaction(wallet, recipient, amount);
*/

