'use strict';

const LOG_TAG = 'HTTP';

const ioc = require('../../util/iocContainer');
const cors = require('cors');
const express = require('express');
const { convertJson } = require('../../util/jsonUtil');
const { IHttpServer } = require('./IHttpServer');

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
class HttpServer extends IHttpServer {
    /**
     * constructor
     * @param {Blockchain} blockchain
     * @param {Wallet} wallet
     * @param {IP2PServer} p2pServer
     * @param {TransactionPool} txPool
     * @param {Miner} miner
     */
    constructor(config, coreUnit, p2pServer) {
        super();
        this.coreUnit = coreUnit;
        this.p2pServer = p2pServer;
        this.config = config; 
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
                const port = this.config.HTTP_PORT;

                app.use(express.json());
                app.use(cors({
                    origin: 'http://localhost:3000'
                }));

                app.get('/transactions', (req, res) => {
                    exception.try(() => {
                        logger.info('GET /transactions');

                        res.json(this.getTransactions());
                    });
                });

                app.get('/public', (req, res) => {
                    exception.try(() => {
                        logger.info('GET /public');

                        res.json(this.getPublic());
                    });
                });
                
                app.get('/blocks', (req, res) => {
                    exception.try(() => {
                        logger.info('GET /blocks');
                        
                        res.json(this.getBlocks()); 
                    });
                }); 

                //pass in: recipient, amount
                app.post('/transact', (req, res) => {
                    exception.try(() => {
                        logger.info('POST /transact');

                        const { recipient, amount } = req.body;
                        this.postTransact(recipient, amount); 
                        res.redirect('/transactions');
                    });
                });

                app.post('/mine-transactions',(req, res)=>{
                    exception.try(() => {
                        logger.info('POST /mine-transactions');
                        
                        this.postMineTransactions();
                        res.redirect('/blocks');
                    });
                })

                if (this.config.RUN_HTTP_SERVER) {
                    logger.info('starting web server...');
                    app.listen(port, () => {
                        logger.info(`app running on port ${port}`);
                    });
                }

                running = true;
            }
        });
    }
    
    /*json*/ getTransactions() {
        return exception.try(() => {
            return convertJson(this.coreUnit.getTxPoolTransactions());
        });
    }
    
    /*json*/ getBlocks() {
        return exception.try(() => {
            return this.coreUnit.getBlocks();
        });
    }
    
    /*json*/ getPublic() {
        return exception.try(() => {
            const output = this.coreUnit.getBlockchainInfo();
            output.peers = this.p2pServer.peerList(); 
            return output; 
        });        
    }
    
    /*Transaction*/ postTransact(recipient, amount) {
        return exception.try(() => {
            const transaction = this.coreUnit.transferTo(recipient, amount);
            this.p2pServer.broadcastTransaction(transaction);
            return transaction;
        });
    }
    
    /*Block*/ postMineTransactions() {
        return exception.try(() => {
            const block = this.coreUnit.mine();
            if (block) {
                logger.info(`new block added: ${block.toJsonString()}`);
                this.p2pServer.syncChain();
            }
            return block;
        });
    }
}

module.exports = { HttpServer };




