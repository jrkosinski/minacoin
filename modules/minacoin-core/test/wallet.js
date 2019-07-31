'use strict' 

const assert = require('assert'); 
const expect = require('chai').expect;
const should = require('chai').should();
const util = require('./util');
const mocha = require('mocha');

const Transaction = require('../classes/Transaction').class;
const Output = require('../classes/Output').class;

describe ('wallets test', () => {
    describe('create wallets', () => {
        it('', () => {
            const wallets = util.createWallets(); 
            
            /*
            expect(wallets[0]).to.be.not.null(); 
            expect(wallets[1]).to.be.not.null(); 
            expect(wallets[2]).to.be.not.null(); 
            expect(wallets[3]).to.be.not.null(); 
            */
    
            expect(wallets[1].name).to.equal('A');
            expect(wallets[2].name).to.equal('B');
            expect(wallets[3].name).to.equal('C');
        });
    }); 
    describe('genesis transaction', () => {
        it('', () => {
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
});