'use strict';

const testUtil = require('./testUtil');
const { Block, Blockchain } = require('../lib/blockchain');

describe("Blockchain",()=>{
    let blockchain, blockchain2;

    beforeEach(()=>{
        blockchain = new Blockchain();
        blockchain2 = new Blockchain();
    });

    it('starts with the genesis block',()=>{
        expect(blockchain.chain[0]).toEqual(Block.genesis());
        expect(blockchain2.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block',()=>{
        const data = [{id:'1'}];
        blockchain.addBlock(data);
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(data);
        expect(blockchain.isValidChain(blockchain.chain)).toBe(true);
    });

    it('validates a valid chain',()=>{
        blockchain2.addBlock([{id:'1'}]);
        // conventional method for check true and false is toBe
        expect(blockchain.isValidChain(blockchain2.chain)).toBe(true);
    });

    it('invalidates a chain with a corrupt the genesis block',()=>{
        blockchain2.chain[0].data = [{id:'bad data'}];
        expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
    });

    it('invalidates a corrupt chain',()=>{
        blockchain2.addBlock([{id:'1'}]);
        blockchain2.chain[1].data = [{id:'2'}];

        expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
    });

    it('replaces the chain with a valid chain',()=>{
        blockchain2.addBlock([{id:'1'}]);
        blockchain.replaceChain(blockchain2.chain);
        expect(blockchain.chain).toEqual(blockchain2.chain);
    });

    it('does not replaces the chain with a one with less than or equal to chain',()=>{
        blockchain.addBlock([{id:'1'}]);
        blockchain.replaceChain(blockchain2.chain);
        expect(blockchain.chain).not.toEqual(blockchain2.chain);
    });
});