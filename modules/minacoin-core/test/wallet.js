'use strict' 

const assert = require('assert'); 
const expect = require('chai').expect;
const should = require('chai').should();
const util = require('./util');


describe('wallets test', () => {
    it('', () => {
        const wallets = util.createWallets(); 
        
        expect(wallets[0]).to.be.not.null(); 
        expect(wallets[1]).to.be.not.null(); 
        expect(wallets[2]).to.be.not.null(); 
        expect(wallets[3]).to.be.not.null(); 

        expect(wallets[1].name).to.equal('A');
        expect(wallets[2].name).to.equal('B');
        expect(wallets[3].name).to.equal('C');
    });
}); 