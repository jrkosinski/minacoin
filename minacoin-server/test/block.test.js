'use strict';

const testUtil = require('./testUtil');
const { Block } = require('../src/lib/blockchain');
const expect = require('chai').expect;

/**
 * describe is jest specific function
 * name of the object as string for which the test is written
 * function that will define a series of tests
 */
describe("Block",()=>{

    let data,lastBlock,block;
    /**
     * beforeEach allows us to run some code before
     * running any test
     * example creating an instance
     */
    beforeEach(()=>{
         data = [];
         lastBlock = Block.genesis();
         block = Block.mineBlock(lastBlock, data);
    });
    /**
     * it function is used to write unit tests
     * first param is a description
     * second param is callback arrow function
     */
    it("sets the `data` to match the input",()=>{
        /**
         * expect is similar to assert
         * it expects something
         */
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
