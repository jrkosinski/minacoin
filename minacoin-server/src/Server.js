'use strict';

const LOG_TAG = 'SRV';

const ioc = require('./util/iocContainer');

//imports
const { Miner } = require('./lib/miner');
const { Blockchain } = require('./lib/blockchain');
const { CoreUnit } = require('./CoreUnit'); 
const { Wallet, TransactionPool } = require('./lib/wallet');
const { HttpServer } = require('./HttpServer');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

class Server {
    constructor(config) {
        this.coreUnit = new CoreUnit(config);
        this.config = config;
    }
    
    async run() {
        await exception.tryAsync(async () => {
            await this.coreUnit.initialize();
            
            //create instance of P2P server
            this.p2pServer = ioc.p2pServerFactory.createInstance(this.coreUnit);
        
            //create and start server
            this.httpServer = new HttpServer(
                this.config.HTTP_PORT, 
                this.coreUnit,
                this.p2pServer
            );
            this.httpServer.start();
        });
    }
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