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

            if (amount > this.balance) {
                logger.warn(`amount: ${amount} exceeds the current balance: ${this.balance}`);
                return;
            }

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