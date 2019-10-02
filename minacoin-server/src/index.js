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


//parse command line args 
if (process.argv.length > 2) {
    const port = process.argv[2]; 
    if (port) {
        config.HTTP_PORT = port;
    }
}
    
let TEST = false;
console.log('');

if (TEST) {
    runTestServers();
} else {
    const server = new Server(config);  
    server.run(); 
}



async function runTestServers() {
    const { TestProcessArray } = require('../test/util/TestProcessArray'); 
    const testUtil = require('../test/util/testUtil');
    
    const sendAmount = 20;
    const nodeCount = 20; 
        
    console.log('starting processes...'); 
    const test = new TestProcessArray(nodeCount, 3000).startAll();
    await testUtil.sleep(10);
        
    while(true) {
        await testUtil.sleep(3); 
            
        //pick random sender & receiver 
        const senderIndex = Math.floor(Math.random() * nodeCount); 
        let recipIndex = senderIndex;
        while(recipIndex === senderIndex) {
            recipIndex = Math.floor(Math.random() * nodeCount); 
        }
        console.log(`sending from ${senderIndex+1} to ${recipIndex+1}`);
            
        const recipAddr = await test.procAt(recipIndex).getWalletAddress(); 
        await test.procAt(senderIndex).postTransact(recipAddr, sendAmount); 
            
        await testUtil.sleep(2); 
            
        //if txPool count >= 10, choose a miner 
        const txPoolCount = await test.procAt(0).getTxPoolCount(); 
        if (txPoolCount >= 5) {
            const minerIndex = Math.floor(Math.random() * nodeCount); 
            console.log(`${minerIndex+1} is mining...`);
                
            await test.procAt(minerIndex).postMineTransactions(); 
            
            await testUtil.sleep(2); 
        }
    }
        
    test.killAll();
    await testUtil.sleep(2);
}


