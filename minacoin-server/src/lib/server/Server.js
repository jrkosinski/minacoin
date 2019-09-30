'use strict';

const LOG_TAG = 'SRV';

const ioc = require('../../util/iocContainer');

//imports
const { Miner } = require('../miner');
const { Blockchain } = require('../blockchain');
const { CoreUnit } = require('./CoreUnit'); 
const { Wallet, TransactionPool } = require('../wallet');
const { HttpServer } = require('./HttpServer');
const { IHttpServer } = require('./IHttpServer');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

class Server extends IHttpServer {
    constructor(config) {
        super();
        this.coreUnit = new CoreUnit(config);
        this.config = config;
    }
    
    async run() {
        await exception.tryAsync(async () => {
            await this.coreUnit.initialize();
            
            //create instance of P2P server
            this.p2pServer = ioc.p2pServerFactory.createInstance(this.config, this.coreUnit);
        
            //create and start server
            this.httpServer = new HttpServer(
                this.config, 
                this.coreUnit,
                this.p2pServer
            );
            this.httpServer.start();
        });
    }
    
    /*json*/ getTransactions() {
        return this.httpServer.getTransactions();
    }
    
    /*json*/ getBlocks() {
        return this.httpServer.getBlocks();
    }
    
    /*json*/ getPublic() {
        return this.httpServer.getPublic();
    }
    
    /*Transaction*/ postTransact(recipient, amount) {
        return this.httpServer.postTransact(recipient, amount);
    }
    
    /*Block*/ postMineTransactions() {
        return this.httpServer.postMineTransactions();
    }
}


module.exports = Server;