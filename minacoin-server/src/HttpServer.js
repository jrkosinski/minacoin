'use strict';

const LOG_TAG = 'HTTP';

const ioc = require('./util/iocContainer');
const cors = require('cors');
const express = require('express');
const { convertJson } = require('./util/jsonUtil');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

let running = false;

/**
 * minacoin: HttpServer
 * --------------------
 * encapsulates the main components of the server-side interface, such as the 
 * web server and the p2p server. 
 *
 * author: John R. Kosinski
 */
class HttpServer {
    /**
     * constructor
     * @param {Blockchain} blockchain
     * @param {Wallet} wallet
     * @param {IP2PServer} p2pServer
     * @param {TransactionPool} txPool
     * @param {Miner} miner
     */
    constructor(httpPort, blockchain, wallet, p2pServer, txPool, miner) {
        this.port = httpPort;
        this.blockchain = blockchain;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
        this.txPool = txPool;
        this.miner = miner;
    }

    /**
     * starts the server running
     */
    start() {
        exception.try(() => {
            if (!running) {
                logger.info('starting p2p server...');
                this.p2pServer.listen();

                const app = express();
                const port = this.httpPort;

                app.use(express.json());
                app.use(cors({
                    origin: 'http://localhost:3000'
                }));

                app.get('/transactions', (req, res) => {
                    exception.try(() => {
                        logger.info('GET /transactions');

                        res.json(convertJson(this.txPool.transactions));
                    });
                });

                app.get('/public', (req, res) => {
                    exception.try(() => {
                        logger.info('GET /public');

                        this.wallet.updateBalance(this.blockchain);
                        res.json({
                            address: this.wallet.publicKey, 
                            balance: this.wallet.balance, 
                            chainSize: this.blockchain.height, 
                            peers: this.p2pServer.peerList(),
                            transactionPool: {
                                count: this.txPool.txCount, 
                                pending: this.txPool.pendingTransactions(this.wallet.publicKey)
                            }
                        });
                    });
                });
                
                app.get('/blocks', (req, res) => {
                    exception.try(() => {
                        logger.info('GET /blocks');
                        
                        res.json(this.blockchain.toJson()); 
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

module.exports = { HttpServer };




