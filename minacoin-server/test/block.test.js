'use strict';

const testUtil = require('./util/testUtil');
const { Block } = require('../src/lib/blockchain');
const expect = require('chai').expect;

/*
describe("Block",()=>{

    let data,lastBlock,block;
    
    beforeEach(()=>{
         data = [];
         lastBlock = Block.genesis();
         block = Block.mineBlock(lastBlock, data);
    });
    
    it("sets the `data` to match the input",()=>{
        expect(block.data).to.equal(data);
    });

    it("sets the `lastHash` to match the hash of the last block",()=>{
        expect(block.lastHash).to.equal(lastBlock.hash);
    });

    it('generates a hash that matches the difficutly',()=>{
        // use the dynamic difficulty to match the difficulty
        expect(block.hash.substring(0,block.difficulty)).to.equal('0'.repeat(block.difficulty));
    });

    it('lower the difficulty for a slower generated block',()=>{
        // 300000 will make it insanely slow
        expect(Block.adjustDifficulty(block,block.timestamp + 300000)).to.equal(block.difficulty - 1);
    });

    it('raise the difficulty for a faster generated block',()=>{
        expect(Block.adjustDifficulty(block,block.timestamp + 1)).to.equal(block.difficulty + 1);
    });
});
*/