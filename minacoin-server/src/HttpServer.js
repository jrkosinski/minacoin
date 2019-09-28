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
    constructor(httpPort, coreUnit, p2pServer) {
        this.port = httpPort;
        this.coreUnit = coreUnit;
        this.p2pServer = p2pServer;
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

                        res.json(convertJson(this.coreUnit.getTxPoolTransactions()));
                    });
                });

                app.get('/public', (req, res) => {
                    exception.try(() => {
                        logger.info('GET /public');

                        const output = this.coreUnit.getBlockchainInfo();
                        output.peers = this.p2pServer.peerList(); 
                        res.json(output);
                    });
                });
                
                app.get('/blocks', (req, res) => {
                    exception.try(() => {
                        logger.info('GET /blocks');
                        
                        res.json(this.coreUnit.getBlocks()); 
                    });
                }); 

                //pass in: recipient, amount
                app.post('/transact', (req, res) => {
                    exception.try(() => {
                        logger.info('POST /transact');

                        const { recipient, amount } = req.body;
                        const transaction = this.coreUnit.transferTo(recipient, amount);

                        this.p2pServer.broadcastTransaction(transaction);
                        res.redirect('/transactions');
                    });
                });

                app.post('/mine-transactions',(req, res)=>{
                    exception.try(() => {
                        logger.info('POST /mine-transactions');

                        const block = this.coreUnit.mine();
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




