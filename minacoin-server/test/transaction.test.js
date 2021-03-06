'use strict';

const testUtil = require('./util/testUtil');
const { Transaction, Wallet } = require('../src/lib/wallet/');
const { MINING_REWARD }  = require('../src/config');
const expect = require('chai').expect;

/*
describe('Transaction', () => {
    let transaction, wallet, recipient, amount;

    beforeEach(()=>{
        wallet = new Wallet();
        amount = 50;
        recipient = 'r3c1p13nt';
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('outputs the `amount` subtracted from the wallet balance',()=>{
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).to.equal(wallet.balance - amount);
    });

    it('outputs the `amount` added to the recipient',()=>{
        expect(transaction.outputs.find(output => output.address === recipient).amount).to.equal(amount);
    });

    it('inputs the balance of the wallet',()=>{
        expect(transaction.input.amount).to.equal(wallet.balance);
    });

    it('validates a valid transaction',()=>{
        expect(Transaction.verifyTransaction(transaction)).to.equal(true);
    });

    it('invalidates a invalid transaction',()=>{
        transaction.outputs[0].amount = 500000;
        expect(Transaction.verifyTransaction(transaction)).to.equal(false);
    });

    describe('transacting with less balance',()=>{
        beforeEach(()=>{
            amount = 5000;
            transaction = Transaction.newTransaction(wallet,recipient,amount);
        });

        it('does not create the transaction',()=>{
            expect(transaction).to.equal(undefined);
        })
    });

    describe('updated transaction',()=>{
        let nextAmount, nextRecipient;

        beforeEach(()=>{
            nextAmount = 20;
            nextRecipient = 'n3xt-4ddr355';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });

        it('substracts the nect amount from the sender\'s outouts',()=>{
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .to.equal(wallet.balance - amount -nextAmount);
        });

        it('outputs an amount for the next recipient',()=>{
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
            .to.equal(nextAmount);
        });
    });

    describe('creating a reward transaction',()=>{
        beforeEach(()=>{
            transaction = Transaction.rewardTransaction(wallet,Wallet.blockchainWallet());
        });

        it('reward the miners wallet',()=>{
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).to.equal(MINING_REWARD);
        });
    });
});
*/