'use strict';

const LOG_TAG = 'TRNS';

const cryptoUtil = require('../../util/cryptoUtil');
const ioc = require('../../util/iocContainer');
const { MINING_REWARD }  = require('../../config');

const logger = ioc.loggerFactory.createLogger(LOG_TAG);
const exception = ioc.ehFactory.createHandler(logger);

/**
 * minacoin: Transaction
 * ---------------------
 * a transaction consists of one input and two outputs. The first output goes to the
 * recipient; the second output sends the change back to the sender. The sender's entire
 * wallet balance is the input to the transaction, the actual sent amount is the first
 * output (to the recipient), and the remainder is in the second output back to the sender.
 *
 * author: John R. Kosinski
 */
class Transaction {

    /**
     * constructor
     */
    constructor(){
        this.id = cryptoUtil.id();
        this.input = null;
        this.outputs = [];

        logger.info(`created new transaction ${this.id}`);
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

    /**
     * returns a json representation
     */
    /*json*/ toJson() {
        return {
            id: this.id,
            input: this.input,
            outputs: this.outputs
        }
    }

    /**
     * returns a json representation converted to string
     */
    /*string*/ toJsonString() {
        return JSON.stringify(this.toJson());
    }

    static /*Transaction*/ signTransaction(transaction, senderWallet) {
        return exception.try(() => {
            logger.info(`signing transaction ${transaction.id}`);
            transaction.input = {
                timestamp: Date.now().getTime(),
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

    /**
     * deserializes a Transaction instance from JSON data
     * @returns {Transaction}
     * @param {json} json
     */
    static /*Transaction*/ deserialize(json) {
        return exception.try(() => {
            const output = new this();
            output.id = json.id;
            output.input = json.input;
            output.outputs = json.outputs;

            return output;
        });
    }
}

module.exports = Transaction;