'use strict';

const LOG_TAG = 'WAL';

const { INITIAL_BALANCE } = require('../../config');
const cryptoUtil = require('../../util/cryptoUtil');
const ioc = require('../../util/iocContainer');
const Transaction = require('./Transaction');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

class Wallet {
    get balance() { return this._balance; }
    get keyPair() { return this._keyPair; }
    get publicKey() { return this._publicKey; }

    constructor() {
        this._balance = INITIAL_BALANCE;
        this._keyPair = cryptoUtil.generateKeyPair();
        this._publicKey = this.keyPair.getPublic().encode('hex');

        logger.info(`wallet created: public key is ${this._publicKey.toString()}`);
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool) {
        return exception.try(() => {
            logger.info(`creating transaction: send ${amount} to ${recipient}`);

            //update balance
            this.updateBalance(blockchain);

            //disallow transaction if more than balance
            if (amount > this.balance) {
                logger.warn(`amount: ${amount} exceeds the current balance: ${this.balance}`);
                return;
            }

            //get existing transaction
            let transaction = transactionPool.existingTransaction(this.publicKey);

            if (transaction) {
                transaction.update(this, recipient, amount);
            }
            else {
                transaction = Transaction.newTransaction(this, recipient, amount);
                transactionPool.updateOrAddTransaction(transaction);
            }

            return transaction;
        });
    }

    calculateBalance(blockchain) {
        return exception.try(() => {

            //existing balance
            let balance = this.balance;

            // store all the transactions in blockchain, in temp array
            let transactions = [];
            blockchain.chain.forEach(block => block.data.forEach(transaction => {
                transactions.push(transaction);
            }));

            //get all transactions sent from this wallet
            const inputTransactions = transactions.filter(
                transaction => transaction.input.address === this.publicKey
            );

            let lastTransTime = 0;

            if (inputTransactions.length > 0) {

                //get latest transaction
                const recentInputTrans = inputTransactions.reduce(
                    (prev,current)=> prev.input.timestamp > current.input.timestamp ? prev : current
                );

                //balance is output back to sender
                balance = recentInputTrans.outputs.find(output => output.address === this.publicKey).amount;

                // save the timestamp of the latest transaction made by the wallet
                lastTransTime = recentInputTrans.input.timestamp;
            }

            // get the transactions that were addressed to this wallet ie somebody sent some moeny
            // and add its ouputs.
            // since we save the timestamp we would only add the outputs of the transactions recieved
            // only after the latest transactions made by us
            transactions.forEach(transaction => {
                if (transaction.input.timestamp > lastTransTime) {
                    transaction.outputs.find(output => {
                        if (output.address === this.publicKey) {
                            balance += output.amount;
                        }
                    })
                }
            });

            return balance;
        });
    }

    updateBalance(blockchain) {
        this._balance = this.calculateBalance(blockchain);
    }

    static /*Wallet*/ blockchainWallet() {
        return exception.try(() => {
            const blockchainWallet = new this();
            blockchainWallet.address = 'blockchain-wallet';
            return blockchainWallet;
        });
    }

    toString() {
        return `Wallet -
        publicKey: ${this.publicKey.toString()}
        balance  : ${this.balance}`;
    }

    toJson() {
        return {
            publicKey: this.publicKey.toString(),
            balance: this.balance
        }
    }

    toJsonString() {
        return JSON.stringify(this.toJson());
    }
}

module.exports = Wallet; //TODO: change all of these to exports.Wallet