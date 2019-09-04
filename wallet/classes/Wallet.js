'use strict';

const LOG_TAG = 'WAL';

const { INITIAL_BALANCE } = require('../../config');
const cryptoUtil = require('../../util/cryptoUtil');
const ioc = require('../../util/iocContainer');
const Transaction = require('./Transaction');
const EventEmitter = require('events');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

/**
 * minacoin: Wallet
 * ----------------
 * wallet class with public/private key pair and balance
 *
 * author: John R. Kosinski
 */
class Wallet {
    get balance() { return this._balance; }
    get keyPair() { return this._keyPair; }
    get publicKey() { return this._publicKey; }

    /**
     * constructor
     */
    constructor() {
        this._balance = INITIAL_BALANCE;
        this._keyPair = cryptoUtil.generateKeyPair();
        this._publicKey = this.keyPair.getPublic().encode('hex');
        this._emitter = new EventEmitter();

        logger.info(`wallet created: public key is ${this._publicKey.toString()}`);
    }

    /**
     * signs the given data using the wallet's keypair
     * @param {string} data
     * @returns {string}
     */
    /*Signature*/ sign(data) {
        return this.keyPair.sign(data);
    }

    /*Transaction*/ createTransaction(recipient, amount, blockchain, transactionPool) {
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

    /**
     * recalculates the wallet's balance according to the transactions in the given blockchain
     * @returns {float} the calculated balance
     * @param {Blockchain} blockchain
     */
    /*float*/ calculateBalance(blockchain) {
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

    /**
     * recalculates the wallet's balance according to the transactions in the given blockchain
     * and replaces the current balance with the calculated balance
     * @param {Blockchain} blockchain
     */
    updateBalance(blockchain) {
        exception.try(() => {
            const newBalance = this.calculateBalance(blockchain);
            if (newBalance !== this._balance) {
                this._balance = this.calculateBalance(blockchain);
                this._emitter.emit('update');
            }
        });
    }

    on(eventName, callback) {
        if (eventName && callback) {
            this._emitter.on(eventName, callback);
        }
    }

    /**
     * returns a string representation
     */
    /*string*/ toString() {
        return `Wallet -
        publicKey: ${this.publicKey.toString()},
        balance  : ${this.balance}`;
    }

    /**
     * returns a json representation
     */
    /*json*/ toJson() {
        return {
            publicKey: this.publicKey.toString(),
            privateKey: this.keyPair.priv.toString(16,2),
            balance: this.balance
        };
    }

    /**
     * returns a json representation converted to string
     */
    /*string*/ toJsonString() {
        return JSON.stringify(this.toJson());
    }

    /**
     * creates a new wallet to be used as the sender when awarding the mining reward
     * @returns {Wallet}
     */
    static /*Wallet*/ blockchainWallet() {
        return exception.try(() => {
            const blockchainWallet = new this();
            blockchainWallet.address = 'blockchain-wallet';
            return blockchainWallet;
        });
    }

    static /*Wallet*/ deserialize(json) {
        return exception.try(() => {
            const output = new this();

            output._balance = json.balance;
            output._keyPair = cryptoUtil.deserializeKeyPair(json.publicKey, json.privateKey);
            output._publicKey = output.keyPair.getPublic().encode('hex');

            return output;
        });
    }
}

module.exports = Wallet; //TODO: change all of these to exports.Wallet