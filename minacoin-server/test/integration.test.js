'use strict';

const testUtil = require('./util/testUtil');
const { TestProcessArray } = require('./util/TestProcessArray');
const { INITIAL_BALANCE } = require('../src/config');
const { MINING_REWARD } = require('../src/config');
const expect = require('chai').expect;


//TODO: process doesn't die when killed 

/*
every combat turn: 
- pick two nodes: A sends 1 to B 
- if txPool count is >= 10, mine a block (pick a node at random to be the miner)
- 
*/ 

describe('Integration Tests',()=> {

    /*
    it('server 1 transacts and mines', async ()=>{
        const sendAmount = 20;
        
        const test = new TestProcessArray(3, 3000).startAll();
        await testUtil.sleep(2);
                
        //server 1 sends to server 2, and mines 
        const wallet2 = await test.proc2.getWalletAddress();
        await test.proc1.postTransact(wallet2, sendAmount);
        await test.proc1.postMineTransactions(); 
        
        await testUtil.sleep(5); 
        
        //test
        const results = await Promise.all([
            test.proc1.getBalance(),
            test.proc2.getBalance(),
            test.proc1.getBlocks(),
            test.proc2.getBlocks(),
            test.proc3.getBlocks()
        ]); 
        const balance1 = results[0];
        const balance2 = results[1]; 
        const count1 = results[2].chain.length; 
        const count2 = results[3].chain.length; 
        const count3 = results[4].chain.length; 
        
        expect(count1).to.equal(count2, 'count1 == count2');
        expect(count2).to.equal(count3, 'count2 == count3');
        expect(balance1).to.equal(INITIAL_BALANCE - sendAmount + MINING_REWARD, 'balance1 == ?'); 
        expect(balance2).to.equal(INITIAL_BALANCE + sendAmount, 'balance2 == ?'); 
        
        test.killAll();
        await testUtil.sleep(2);
        
    }).timeout(20000);
    */

    /*
    it('server 1 transacts and server 2 mines', async ()=>{
        console.log('test 2 start');
        const sendAmount = 20;
        
        const test = new TestProcessArray(3, 3000).startAll();
        await testUtil.sleep(2);
                
        //server 1 sends to server 2, and mines 
        const wallet2 = await test.proc2.getWalletAddress();
        await test.proc1.postTransact(wallet2, sendAmount);
        await test.proc2.postMineTransactions(); 
        
        await testUtil.sleep(5); 
        
        //test
        const results = await Promise.all([
            test.proc1.getBalance(),
            test.proc2.getBalance(),
            test.proc1.getBlocks(),
            test.proc2.getBlocks(),
            test.proc3.getBlocks()
        ]); 
        const balance1 = results[0];
        const balance2 = results[1]; 
        const count1 = results[2].chain.length; 
        const count2 = results[3].chain.length; 
        const count3 = results[4].chain.length; 
        
        expect(count1).to.equal(count2, 'count1 == count2');
        expect(count2).to.equal(count3, 'count2 == count3');
        expect(balance1).to.equal(INITIAL_BALANCE - sendAmount, 'balance1 == ?'); 
        expect(balance2).to.equal(INITIAL_BALANCE + MINING_REWARD + sendAmount, 'balance2 == ?'); 
        
        test.killAll();
        await testUtil.sleep(2);
        console.log('test 2 end');
        
    }).timeout(20000);
    */

    /*
    it('server 1 transacts and server 3 mines', async ()=>{
        const sendAmount = 20;
        
        const test = new TestProcessArray(3, 3000).startAll();
        await testUtil.sleep(2);
                
        //server 1 sends to server 2, and mines 
        const wallet2 = await test.proc2.getWalletAddress();
        await test.proc1.postTransact(wallet2, sendAmount);
        await test.proc3.postMineTransactions(); 
        
        await testUtil.sleep(2); 
        
        //test
        const results = await Promise.all([
            test.proc1.getBalance(),
            test.proc2.getBalance(),
            test.proc3.getBalance(),
            test.proc1.getBlocks(),
            test.proc2.getBlocks(),
            test.proc3.getBlocks()
        ]); 
        const balance1 = results[0];
        const balance2 = results[1]; 
        const balance3 = results[2]; 
        const count1 = results[3].chain.length; 
        const count2 = results[4].chain.length; 
        const count3 = results[5].chain.length; 
        
        expect(count1).to.equal(count2, 'count1 == count2');
        expect(count2).to.equal(count3, 'count2 == count3');
        expect(balance1).to.equal(INITIAL_BALANCE - sendAmount, 'balance1 == ?'); 
        expect(balance2).to.equal(INITIAL_BALANCE + sendAmount, 'balance2 == ?'); 
        expect(balance3).to.equal(INITIAL_BALANCE + MINING_REWARD, 'balance3 == ?'); 
        
        test.killAll();
        await testUtil.sleep(2);
        
    }).timeout(20000);
    */ 
   
    /*
    it('server 1 transacts and server 3 mines (4 servers)', async ()=>{
        const sendAmount = 20;
        
        const test = new TestProcessArray(4, 3000).startAll();
        await testUtil.sleep(2);
                
        //server 1 sends to server 2, and mines 
        const wallet2 = await test.proc2.getWalletAddress();
        await test.proc1.postTransact(wallet2, sendAmount);
        await test.proc3.postMineTransactions(); 
        
        await testUtil.sleep(2); 
        
        //test
        const results = await Promise.all([
            test.proc1.getBalance(),
            test.proc2.getBalance(),
            test.proc3.getBalance(),
            test.proc1.getBlocks(),
            test.proc2.getBlocks(),
            test.proc3.getBlocks(),
            test.proc4.getBlocks()
        ]); 
        const balance1 = results[0];
        const balance2 = results[1]; 
        const balance3 = results[2]; 
        const count1 = results[3].chain.length; 
        const count2 = results[4].chain.length; 
        const count3 = results[5].chain.length; 
        const count4 = results[6].chain.length; 
        
        expect(count1).to.equal(count2, 'count1 == count2');
        expect(count2).to.equal(count3, 'count2 == count3');
        expect(count3).to.equal(count4, 'count2 == count3');
        expect(balance1).to.equal(INITIAL_BALANCE - sendAmount, 'balance1 == ?'); 
        expect(balance2).to.equal(INITIAL_BALANCE + sendAmount, 'balance2 == ?'); 
        expect(balance3).to.equal(INITIAL_BALANCE + MINING_REWARD, 'balance3 == ?'); 
        
        test.killAll();
        await testUtil.sleep(2);
        
    }).timeout(330000);
    */ 
   
    /*
    it('server 1 transacts x3 and mines', async ()=>{
        const sendAmount = 20;
        
        const test = new TestProcessArray(3, 3000).startAll();
        await testUtil.sleep(2);
                
        //server 1 sends to server 2, and mines 
        const wallet2 = await test.proc2.getWalletAddress();
        const wallet3 = await test.proc3.getWalletAddress();
        
        await test.proc1.postTransact(wallet2, sendAmount);
        await test.proc1.postTransact(wallet2, sendAmount);
        await test.proc1.postTransact(wallet3, sendAmount);
        await test.proc1.postMineTransactions(); 
        
        await testUtil.sleep(5); 
        
        //test
        const results = await Promise.all([
            test.proc1.getBalance(),
            test.proc2.getBalance(),
            test.proc3.getBalance(),
            test.proc1.getBlocks(),
            test.proc2.getBlocks(),
            test.proc3.getBlocks()
        ]); 
        const balance1 = results[0];
        const balance2 = results[1]; 
        const balance3 = results[2]; 
        const count1 = results[3].chain.length; 
        const count2 = results[4].chain.length; 
        const count3 = results[5].chain.length; 
        
        expect(count1).to.equal(count2, 'count1 == count2');
        expect(count2).to.equal(count3, 'count2 == count3');
        expect(balance1).to.equal(INITIAL_BALANCE - (sendAmount * 3) + MINING_REWARD, 'balance1 == ?'); 
        expect(balance2).to.equal(INITIAL_BALANCE + (sendAmount * 2), 'balance2 == ?'); 
        expect(balance3).to.equal(INITIAL_BALANCE + (sendAmount), 'balance3 == ?'); 
        
        test.killAll();
        await testUtil.sleep(2);
        
    }).timeout(20000);
    */
    
    it('happy go-time #1', async ()=>{
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
            if (txPoolCount >= 10) {
                const minerIndex = Math.floor(Math.random() * nodeCount); 
                console.log(`${minerIndex+1} is mining...`);
                
                await test.procAt(minerIndex).postMineTransactions(); 
            
                await testUtil.sleep(2); 
            }
        }
        
        test.killAll();
        await testUtil.sleep(2);
        
    }).timeout(20000000);
});
