'use strict';

const LOG_TAG = 'SERV';

const ioc = require('./util/iocContainer');
const express = require('express');
const config = require('./config');
const { convertJson } = require('./util/jsonUtil');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

let running = false;

class Server {
    /**
     * constructor
     *
     * @param {Blockchain} blockchain
     * @param {Wallet} wallet
     * @param {IP2PServer} p2pServer
     * @param {TransactionPool} txPool
     * @param {Miner} miner
     */
    constructor(blockchain, wallet, p2pServer, txPool, miner) {
        this.blockchain = blockchain;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
        this.txPool = txPool;
        this.miner = miner;
    }

    /**
     * starts the server
     */
    start() {
        exception.try(() => {
            if (!running) {
                logger.info('starting p2p server...');
                this.p2pServer.listen();

                const app = express();
                const port = config.HTTP_PORT;

                app.use(express.json());

                app.get('/transactions', (req, res) => {
                    exception.try(() => {
                        logger.info('GET /transactions');

                        res.json(convertJson(this.txPool.transactions));
                    });
                });

                app.get('/public-key', (req, res) => {
                    exception.try(() => {
                        logger.info('GET /public-key');

                        res.json({publicKey: this.wallet.publicKey, balance: this.wallet.balance });
                    });
                });

                //pass in: recipient, amount
                app.post('/transact', (req, res) => {
                    exception.try(() => {
                        logger.info('POST /transact');

                        const { recipient, amount } = req.body;
                        const transaction = this.wallet.createTransaction(
                            recipient,
                            amount,
                            this.blockchain,
                            this.txPool
                        );

                        this.p2pServer.broadcastTransaction(transaction);
                        res.redirect('/transactions');
                    });
                });

                //TODO: should be POST request
                app.post('/mine-transactions',(req, res)=>{
                    exception.try(() => {
                        logger.info('POST /mine-transactions');

                        const block = this.miner.mine();
                        logger.info(`new block added: ${block.toJsonString()}`);
                        res.redirect('/blocks');
                    });
                })

                logger.info('starting web server...');
                app.listen(port, () => {
                    logger.info(`app running on port ${port}`);
                });

                running = true;
            }
        });
    }
}

module.exports = { Server };



//TODO: add request/response logging
//TODO: change these to be requests from P2P network
//TODO: balances are not updating when they should (only updating my wallet when I create a transaction)
//TODO: bug: I can send myself coins? that doesn't make sense



