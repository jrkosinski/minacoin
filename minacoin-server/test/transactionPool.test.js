'use strict';

const testUtil = require('./util/testUtil');
const { Blockchain } = require('../src/lib/blockchain');
const { Wallet, TransactionPool } = require('../src/lib/wallet');
const expect = require('chai').expect;

/*
describe('Transaction Pool',()=>{
    let transactionPool, wallet, transaction, blockchain;

    beforeEach(()=>{
        transactionPool = new TransactionPool();
        wallet = new Wallet();
        blockchain = new Blockchain();
        transaction = wallet.createTransaction('r4nd-addr355',30,blockchain,transactionPool);
    });

    it('adds a transaction to the pool',()=>{
        expect(transactionPool.transactions.find(t => t.id === transaction.id)).to.equal(transaction);
    });

    it('updates a transaction in the pool',()=>{
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet,'foo-4ddr355',40);
        transactionPool.updateOrAddTransaction(newTransaction);
        expect(JSON.stringify(transactionPool.transactions.find(t => t.id === transaction.id)))
        .not.to.equal(oldTransaction);
    });

    it('clears transactions',()=>{
        transactionPool.clear();
        expect(transactionPool.transactions).to.eql([]);
    })

    describe('mixing valid and corrupt transactions',()=>{
        let validTransactions;

        beforeEach(()=>{
            validTransactions = [...transactionPool.transactions];

            // creating new transactions with corrupted transactions
            for (let i = 0;i<6;i++){
                wallet = new Wallet();
                transaction = wallet.createTransaction('r4nd-4ddr355',30,blockchain,transactionPool);
                if (i&1){
                    transaction.input.amount = 999999;
                }
                else{
                    validTransactions.push(transaction);
                }
            }
        });

        it('shows a difference between valid adnd corrupt transactions',()=>{
            expect(JSON.stringify(transactionPool.transactions)).not.to.equal(JSON.stringify(validTransactions));
        });

        it('grabs valid transactions',()=>{
            expect(transactionPool.validTransactions()).to.eql(validTransactions);
        });
    });
});
*/