'use strict';

const LOG_TAG = 'IDX';

//configure IOC container
const ioc = require('./util/iocContainer');
ioc.service('loggerFactory', c => require('./util/winstonLogger'));
ioc.service('ehFactory', c => require('./util/exceptionHandler'));
ioc.service('p2pServerFactory', c=> require('./lib/p2p/classes/SwarmP2PServer').factory);
ioc.service('database', c=> require('./lib/database/classes/LocalJsonDb'));

const Server = require('./lib/server/Server');
const config = require('./config'); 

//parse command lines 
for (let n = 0; n < process.argv.length; n++) {
    console.log(`${n}: ${process.argv[n]}`);
}
if (process.argv.length > 2) {
    const port = process.argv[2]; 
    if (port) {
        config.HTTP_PORT = port;
    }
}

const TEST = false;
if (TEST) {
    runTestServers();
} else {
    const server = new Server(config);  
    server.run(); 
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
        DIFFICULTY: 3,
        MINE_RATE: 100,
        INITIAL_BALANCE: 500, 
        HTTP_PORT: process.env.HTTP_PORT || 3001,
        P2P_PORT: process.env.P2P_PORT || 5001,
        RUN_HTTP_SERVER: true,
        MINING_REWARD: 50,
        USE_DATABASE: false,
        PEER_LIMIT: 3
    }); 
    const server2 = new Server({
        DIFFICULTY: 3,
        MINE_RATE: 100,
        INITIAL_BALANCE: 500,  
        HTTP_PORT: process.env.HTTP_PORT || 3002,
        P2P_PORT: process.env.P2P_PORT || 5002,
        MINING_REWARD: 50,
        USE_DATABASE: false,
        PEER_LIMIT: 3
    });  
    const server3 = new Server({
        DIFFICULTY: 3,
        MINE_RATE: 100,
        INITIAL_BALANCE: 500, 
        HTTP_PORT: process.env.HTTP_PORT || 3003,
        P2P_PORT: process.env.P2P_PORT || 5003,
        MINING_REWARD: 50,
        USE_DATABASE: false,
        PEER_LIMIT: 3
    }); 
    
    server1.run(); 
    
    await sleep(3);
    
    const { HttpTestServer } = require('../test/util/HttpTestServer'); 
    const testServer = new HttpTestServer('http://localhost:3001'); 
    const info = await testServer.getWalletAddress(); 
    const info2 = await testServer.getBalance(); 
}


function sleep(seconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve(true); }, seconds * 1000);
    });
}
