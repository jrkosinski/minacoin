'use strict' 

const assert = require('assert'); 
const expect = require('chai').expect;
const should = require('chai').should();
const util = require('./util');
const mocha = require('mocha');

const Transaction = require('../classes/Transaction').class;
const Output = require('../classes/Output').class;
const Block = require('../classes/Block').class;

describe ('wallets test', () => {
    describe('create wallets', () => {
        it('create wallets', () => {
            const wallets = util.createWallets(); 
    
            expect(wallets[1].name).to.equal('A');
            expect(wallets[2].name).to.equal('B');
            expect(wallets[3].name).to.equal('C');
        });
    }); 
    describe('genesis transaction', () => {
        it('genesis transaction', () => {
            const wallets = util.createWallets(); 
            const coinbase = wallets[0]; 
            const chain = coinbase.chain;

            const genesisTrans = new Transaction(chain, coinbase.publicKey, coinbase.publicKey, 1000); 
            genesisTrans.generateSignature(coinbase.privateKey); 
            genesisTrans.id= '0'; 

            const output = new Output(genesisTrans.recipient, genesisTrans.amount, genesisTrans.id);
            genesisTrans.outputs.push(output); 
            chain.addUtxo(output); 

            expect(genesisTrans.amount).is.greaterThan(0);
        });
    }); 
    describe('send funds', () => {
        it('send funds', () => {
            const genData = util.genesisTrans();
            const wallets = genData.wallets;
            const genesisBlock = genData.genesisBlock; 
            const coinbase = wallets[0]; 
            const chain = coinbase.chain;
            
            const block1 = new Block(chain, genesisBlock.hash); 
            if (block1.addTransaction(coinbase.sendFunds(wallets[2].publicKey, 100))) {
                block1.mineBlock();
                chain.addBlock(block1); 
            }
    
            const block2 = new Block(chain, block1.hash); 
            if (block2.addTransaction(wallets[2].sendFunds(wallets[1].publicKey, 10))) {
                block2.mineBlock();
                chain.addBlock(block2); 
            }
    
            const block3 = new Block(chain, block1.hash); 
            if (block3.addTransaction(wallets[2].sendFunds(wallets[3].publicKey, 10))) {
                block3.mineBlock();
                chain.addBlock(block3); 
            }

            expect(wallets[0].getBalance()).equals(900);
            expect(wallets[1].getBalance()).equals(10);
            expect(wallets[2].getBalance()).equals(80);
            expect(wallets[3].getBalance()).equals(10);
    
            wallets[0].print();
            wallets[1].print();
            wallets[2].print();
            wallets[3].print();
        });
    });
});