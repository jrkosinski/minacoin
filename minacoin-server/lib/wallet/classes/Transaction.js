'use strict';

const LOG_TAG = 'TRNS';

const cryptoUtil = require('../../../util/cryptoUtil');
const ioc = require('../../../util/iocContainer');
const { MINING_REWARD }  = require('../../../config');

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
 * Input format: {
 *      timestamp: <int>,  //datetime in ms
 *      amount: <float>,   //full amount of sender's wallet
 *      address: <string>, //public key of sender wallet
 *      signature: <EC.Signature> //cryptographic signature of transaction 
 * }
 * 
 * Output format: {
 *      amount: <float>,   //amount to send to address
 *      address: <string>, //public key of recipient wallet
 * }
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
            input: serializeTxInput(this.input),
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
        });
    }

    /**
     * cryptographically verifies the validity of the given Transaction 
     * @param {Transaction} transaction 
     * @returns {bool}
     */
    static /*bool*/ verifyTransaction(transaction) {
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

    /**
     * awards a small reward to the miner's wallet for mining a new block 
     * 
     * @param {Wallet} minerWallet the miner's wallet 
     * @param {Wallet} blockchainWallet a wallet to stand in as the wallet of the sender
     * of the reward
     * @returns {Transaction}
     */
    static /*Transaction*/ rewardTransaction(minerWallet, blockchainWallet) {
        return exception.try(() => {
            return Transaction.transactionWithOutputs(blockchainWallet, [{
                    amount: MINING_REWARD,
                    address: minerWallet.publicKey
                }]
            );
        });
    }

    /**
     * creates & signs a new Transaction instance with the given outputs
     * @param {Wallet} senderWallet 
     * @param {Output[]} outputs 
     * @returns {Transaction}
     */
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
    static /*Transaction*/ fromJson(json) {
        return exception.try(() => {
            const output = new this();
            output.id = json.id;
            output.input =  deserializeTxInput(json.input); 
            output.outputs = json.outputs;

            return output;
        });
    }
    
    static /*[json]*/ arrayToJson(array) {
        return exception.try(() => {
            const output = []; 
            array.forEach((t) => {
                output.push(t.toJson ? t.toJson() : t); 
            });
            return output; 
        });
    }
}

function serializeTxInput(txInput) {
    return exception.try(() => {
        const output = { 
            address: txInput.address,
            amount: txInput.amount,
            timestamp: txInput.timestamp
        }; 
        
        if (txInput.signature) {
            output.signature = cryptoUtil.serializeSignature(txInput.signature); 
        }
        
        return output; 
    });
}

function deserializeTxInput(txInput) {
    return exception.try(() => {
        const output = { 
            address: txInput.address,
            amount: txInput.amount,
            timestamp: txInput.timestamp
        }; 
        
        if (txInput.signature) {
            output.signature = cryptoUtil.deserializeSignature(txInput.signature);
        }
        
        return output; 
    });
}

module.exports = Transaction;