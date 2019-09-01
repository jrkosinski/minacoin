'use strict';

const LOG_TAG = 'TRNS';

const cryptoUtil = require('../../util/cryptoUtil');
const ioc = require('../../util/iocContainer');
const { MINING_REWARD }  = require('../../config');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

class Transaction {
    get id() { return this._id; }
    get input() { return this._input; }
    get outputs() { return this._outputs; }

    constructor(){
        this._id = cryptoUtil.id();
        this._input = null;
        this._outputs = [];

        logger.info(`created new transaction ${this._id}`);
    }

    /*Transaction*/ update(senderWallet, recipient, amount) {
        return exception.try(() => {
            logger.info(`updating transaction ${this.id}...`)
            const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

            if (amount > senderWallet.amount){
                logger.warn(`amount ${amount} exceeds balance`);
                return null;
            }

            senderOutput.amount = (senderOutput.amount - amount);
            this.outputs.push({amount: amount,address: recipient});
            Transaction.signTransaction(this,senderWallet);

            return this;
        });
    }

    static /*Transaction*/ signTransaction(transaction, senderWallet) {
        return exception.try(() => {
            logger.info(`signing transaction ${transaction.id}`);
            transaction._input = {
                timestamp: Date.now(),
                amount: senderWallet.balance,
                address: senderWallet.publicKey,
                signature: senderWallet.sign(cryptoUtil.hash(transaction.outputs))
            };
            return transaction;
        });
    }

    static /*Transaction*/ newTransaction(senderWallet, recipient, amount) {
        return exception.try(() => {
            if (amount > senderWallet.balance) {
                logger.warn(`amount ${amount} exceeds balance`);
                return;
            }

            return Transaction.transactionWithOutputs(senderWallet, [{
                    amount:  senderWallet.balance -amount,
                    address: senderWallet.publicKey
                },  {
                    amount:  amount,
                    address: recipient
                }
            ]);

            /*
            const transaction = new Transaction();

            transaction.outputs.push({
                amount: senderWallet.balance - amount,    //output remainder back to sender
                address: senderWallet.publicKey
            });
            transaction.outputs.push({
                amount: amount,                     //send amount to sender
                address: recipient
            });

            Transaction.signTransaction(transaction,senderWallet);

            return transaction;
            */
        });
    }

    static verifyTransaction(transaction) {
        return exception.try(() => {
            const output = cryptoUtil.verifySignature(
                transaction.input.address,
                transaction.input.signature,
                cryptoUtil.hash(transaction.outputs)
            );

            if (!output) {
                logger.warn(`transaction ${transaction.id} failed verification`);
            }

            return output;
        });
    }

    static /*Transaction*/ rewardTransaction(minerWallet, blockchainWallet) {
        return exception.try(() => {
            return Transaction.transactionWithOutputs(blockchainWallet, [{
                    amount: MINING_REWARD,
                    address: minerWallet.publicKey
                }]
            );
        });
    }

    static /*Transaction*/ transactionWithOutputs(senderWallet, outputs) {
        return exception.try(() => {
            const transaction = new this();
            transaction.outputs.push(...outputs);
            Transaction.signTransaction(transaction, senderWallet);
            return transaction;
        });
    }

    /*json*/ toJson() {
        return {
            id: this.id,
            input: this.input,
            outputs: this.outputs
        }
    }

    /*string*/ toJsonString() {
        return JSON.stringify(this.toJson());
    }
}

module.exports = Transaction;